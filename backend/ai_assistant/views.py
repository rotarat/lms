import os
from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from django.http import FileResponse
from rest_framework.parsers import MultiPartParser, FormParser
from .services import fetch_quiz_questions, ask_openai, generate_or_explain_diagram  
from core.settings import MEDIA_ROOT, MEDIA_URL
from .models import AdaptiveQuizSession, WrongQuizAnswer
from .serializers import WrongQuizAnswerSerializer, WrongQuizAnswerReflectionSerializer
from courses.models import Course
    
class ChatbotServiceViewSet(viewsets.ViewSet):
    permission_classes = [IsAuthenticated]

    def create(self, request):
        message  = request.data.get('message')

        if not message:
            return Response(
                {"error": "'message' is required."},
                status=status.HTTP_400_BAD_REQUEST
            )

        response = ask_openai(message)
        
        return Response({"message_resp": response}, status=status.HTTP_200_OK)
    
class DiagramViewSet(viewsets.ViewSet):
    """
    A lean ViewSet that:
      - POST /api/ai/diagrams/      → create()
      - GET  /api/ai/diagrams/{name}/ → retrieve()
    """

    parser_classes = [MultiPartParser, FormParser]

    def create(self, request):
        """
        POST /api/ai/diagrams/
        Required fields in request.data:
          - text:         str   (description or prompt)
          - action:       "diagram" or "explanation"
          - image:        file (only if action == "explanation")
        Returns JSON:
          - { "imageUrl": "<full-url>" }       OR
          - { "explanation": "<...>" }
        """
        text = request.data.get('text', '').strip()
        action = request.data.get('action', '').strip().lower()
        image_file = request.data.get('image', None)

        if action not in ("diagram", "explanation"):
            return Response(
                {"error": "Field 'action' must be either 'diagram' or 'explanation'."},
                status=status.HTTP_400_BAD_REQUEST
            )

        if action == "diagram" and not text:
            return Response(
                {"error": "Field 'text' is required for diagram generation."},
                status=status.HTTP_400_BAD_REQUEST
            )

        if action == "explanation" and image_file is None:
            return Response(
                {"error": "To get an explanation, please upload an image."},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            png_filename, explanation_text = generate_or_explain_diagram(
                text=text,
                image_file=image_file,
                action=action
            )
        except Exception as exc:
            return Response(
                {"error": str(exc)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

        if action == "diagram":
            relative_url = f"{MEDIA_URL}diagrams/{png_filename}"
            full_url   = request.build_absolute_uri(relative_url)
            return Response({"imageUrl": full_url, "explanation": explanation_text})

        # action == "explanation"
        return Response({"explanation": explanation_text})

    def retrieve(self, request, pk=None):
        """
        GET /api/ai/diagrams/{pk}/
        Serves the file at MEDIA_ROOT/diagrams/{pk} as an attachment.
        """
        if pk is None:
            raise status.HTTP_404_NOT_FOUND("Missing diagram name.")

        diagram_path = os.path.join(MEDIA_ROOT, 'diagrams', pk)
        if not os.path.exists(diagram_path):
            raise status.HTTP_404_NOT_FOUND(f"Diagram '{pk}' not found.")

        return FileResponse(
            open(diagram_path, 'rb'),
            as_attachment=False,
            filename=pk,
            content_type="image/png"
        )
    
class AdaptiveQuizViewSet(viewsets.ViewSet):
    """
    - GET  /api/quiz/adaptive/  → initialize session & return first question
    - POST /api/quiz/adaptive/next/ → accept student's answer to last question, return next question or finished.
    """
    permission_classes = [IsAuthenticated]

    def list(self, request):
        """
        Initialize a new adaptive session and return the first MCQ.
        Query params:
          - course_id
          - text   (source material)
          - difficulty (string)
          - total    (int)
        """
        user = request.user.profile.personal_data
        course_id  = request.query_params.get("course_id")
        difficulty = request.query_params.get("difficulty")
        total      = int(request.query_params.get("total", 10))

        # Validate inputs (course exists, difficulty valid, etc.)
        if not (course_id and difficulty):
            return Response(
                {"detail": "Missing one of course_id, text, or difficulty."},
                status=status.HTTP_400_BAD_REQUEST
            )
        try:
            course = Course.objects.get(id=course_id)
        except Course.DoesNotExist:
            return Response({"detail": "Course not found."}, status=status.HTTP_404_NOT_FOUND)
        
        #TODO: Add lecture text to Course model
        video = course.videos.first()
        if not video:
            return Response({"detail": "No video found."}, status=status.HTTP_404_NOT_FOUND)
        text = video.script or ""

        # Create session
        session = AdaptiveQuizSession.objects.create(
            personal_data=user,
            course=course,
            text=text,
            initial_difficulty=difficulty,
            total_questions=total,
            asked_count=0,
            last_difficulty=difficulty,
        )

        # Generate first question at initial difficulty
        first_mcq = fetch_quiz_questions(text, difficulty)
        session.asked_count = 1
        session.save(update_fields=["asked_count"])

        # Return session_id + question
        return Response({
            "session_id": str(session.id),
            "question": first_mcq
        }, status=status.HTTP_200_OK)

    def create(self, request):
        """
        Called by front end when user clicks “Next” after answering last question.
        Body (JSON):
          {
            "session_id": "<uuid>",
            "question": "<string>",      # from last question
            "was_correct": true/false,
            "submitted_answer": "<string>",  # if wrong
            "distractors_with_rationale": [  # if wrong, from A
                { "distractor": "<str>", "rationale": "<str>" }, …
            ]
          }
        """
        data        = request.data
        sess_id     = data.get("session_id")
        was_correct = data.get("was_correct")

        # 1) Validate session
        try:
            session = AdaptiveQuizSession.objects.get(
                id=sess_id,
                personal_data=request.user.profile.personal_data
            )
        except AdaptiveQuizSession.DoesNotExist:
            return Response(
                {"detail": "Session not found."},
                status=status.HTTP_404_NOT_FOUND
            )

        # 2) If the student was wrong, save a WrongQuizAnswer
        if not was_correct:
            wq_data = {
                "question": data.get("question"),
                "submitted": data.get("submitted_answer"),
                "correct": data.get("correct_answer"),
                "distractors_with_rationale": data.get("distractors_with_rationale", []),
                "course": session.course.id,
                # pass the session *ID*, not the model instance
                "session": session.id,
            }
            wq_serializer = WrongQuizAnswerSerializer(data=wq_data)
            wq_serializer.is_valid(raise_exception=True)

            # pass personal_data and session object into save(), not via data
            wq_serializer.save(
                personal_data=request.user.profile.personal_data,
                session=session
            )
            # Signal will generate reflection_prompt asynchronously

        # 3) Decide next difficulty and continue as before…
        last_diff = session.last_difficulty or session.initial_difficulty
        if was_correct and last_diff != "Hard":
            next_diff = {"Easy":"Medium","Medium":"Hard"}.get(last_diff, last_diff)
        elif not was_correct and last_diff != "Easy":
            next_diff = {"Hard":"Medium","Medium":"Easy"}.get(last_diff, last_diff)
        else:
            next_diff = last_diff

        if session.asked_count < session.total_questions:
            next_mcq = fetch_quiz_questions(session.text, next_diff)
            session.asked_count += 1
            session.last_difficulty = next_diff
            session.save(update_fields=["asked_count", "last_difficulty"])
            return Response({
                "question": next_mcq,
                "remaining": session.total_questions - session.asked_count
            }, status=status.HTTP_200_OK)
        else:
            session.finished = True
            session.save(update_fields=["finished"])
            return Response({"finished": True}, status=status.HTTP_200_OK)
        
    @action(detail=False, methods=['get'])
    def reflections(self, request):
        """
        GET /api/ai/quiz/reflections/?session_id=<uuid>

        Returns a list of WrongQuizAnswer records (with reflection_prompt, question, etc.)
        for the current user's session. We filter on personal_data + course to fetch only
        wrong answers from this session's course. Alternatively, if your model has session_id
        linked directly, filter on that. But since WrongQuizAnswer only has personal_data & course:

        Query param: session_id
        """
        sess_id = request.query_params.get('session_id')
        if not sess_id:
            return Response(
                {"detail": "session_id is required."},
                status=status.HTTP_400_BAD_REQUEST
            )

        # 1) Verify that the session exists and belongs to the current user
        try:
            session = AdaptiveQuizSession.objects.get(
                id=sess_id,
                personal_data=request.user.profile.personal_data
            )
        except AdaptiveQuizSession.DoesNotExist:
            return Response(
                {"detail": "Quiz session not found."},
                status=status.HTTP_404_NOT_FOUND
            )

        # 2) Fetch all WrongQuizAnswer records for this user’s personal_data + course
        wrong_qs = WrongQuizAnswer.objects.filter(
            personal_data=request.user.profile.personal_data,
            course=session.course,
            session=session,
        )

        # 3) Serialize and return
        serializer = WrongQuizAnswerReflectionSerializer(
            wrong_qs,
            many=True
        )
        return Response(serializer.data, status=status.HTTP_200_OK)