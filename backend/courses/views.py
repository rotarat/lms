import os
import tempfile
import json
from pathlib import Path
from django.utils import timezone
from datetime import timedelta
from rest_framework.decorators import action
from rest_framework import viewsets, status, decorators
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import ValidationError
from .models import Course, Video, Presentation, Exam, StudentExam, OpenEndedQuestion
from .serializers import CourseSerializer, VideoSerializer, PresentationSerializer, ExamSerializer, CreateExamSerializer, StudentExamSerializer, OpenEndedQuestionSerializer
from .permissions import CoursePermissions, VideoPermissions, PresentationPermissions, ExamPermissions, StudentExamPermissions
from django_filters.rest_framework import DjangoFilterBackend
from django.core.files.base import ContentFile
from .filters import CourseFilter, PresentationFilter, VideoFilter
from rest_framework.filters import SearchFilter, OrderingFilter
from video_generation.services import script_generation, audio_generation, video_rendering, youtube_uploader
from ai_assistant.services import fetch_quiz_questions, generate_open_ended_questions, _clean_response
from video_generation.services.audio_generation import synthesize_speech
from video_generation.services.slide import Slide
from profiles.models import Profile

class CourseViewSet(viewsets.ModelViewSet):
    queryset = Course.objects.select_related('owner__user').all()
    serializer_class = CourseSerializer
    permission_classes = [CoursePermissions]

    # GET /api/courses/?owner=<your-profile-id>
    # GET /api/videos/?course=123e4567-e89b-12d3-a456-426614174000
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['owner','title']
    search_fields    = ['title','description']
    ordering_fields  = ['title','owner__user__username']
    filterset_class = CourseFilter

    def get_permissions(self):
        if self.request.user.is_authenticated and self.request.user.is_staff:
            return []
        return super().get_permissions()
    
    def get_serializer_context(self):
        return {"request": self.request}

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user.profile)

    @action(detail=True, methods=["post"], url_path="generate-audio")
    def generate_audio(self, request, pk=None):
        """
        POST /api/courses/<pk>/generate-audio/
        Use Course.script to generate an MP3 via ElevenLabs (audio_generation.py).
        Save the resulting MP3 into Course.audio and return the Course data.
        """
        course = self.get_object()

        # Only allow if we have a script
        if not course.script:
            return Response(
                {"detail": "No script available. Wait for presentation generation first."},
                status=status.HTTP_400_BAD_REQUEST
            )

        audio_slide = Slide(num_page=1, script=course.script, image_path=Path(), topic=course.title)

        try:
            synthesize_speech([audio_slide])
        except Exception as e:
            return Response(
                {"detail": f"Audio generation failed: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

        audio_path_full = audio_slide.audio_path
        if not audio_path_full or not os.path.exists(audio_path_full):
            return Response(
                {"detail": "Audio file not created."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

        with open(audio_path_full, "rb") as f:
            audio_bytes = f.read()

        filename = f"course_{course.id}_lecture.mp3"
        course.audio.save(filename, ContentFile(audio_bytes), save=True)

        try:
            os.remove(audio_path_full)
        except OSError:
            pass

        serializer = self.get_serializer(course)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    @action(detail=True, methods=["post"], url_path="enroll")
    def enroll(self, request, pk=None):
        """
        POST /api/courses/<course_id>/enroll/
        Adds the requesting student (request.user.profile) to course.enrolled_students.
        Returns 200 + updated Course data on success, or 400/403 if something's wrong.
        """
        # 1) Fetch the Course (or 404)
        course = self.get_object()

        # 2) Get the student’s Profile
        try:
            profile = request.user.profile
        except Profile.DoesNotExist:
            return Response(
                {"detail": "Profile not found for this user."},
                status=status.HTTP_400_BAD_REQUEST
            )

        # 3) Ensure they are not already enrolled
        if course in profile.enrolled_courses.all():
            return Response(
                {"detail": "You are already enrolled in this course."},
                status=status.HTTP_400_BAD_REQUEST
            )

        # 4) Add the course to the student’s enrolled_courses
        profile.enrolled_courses.add(course)
        profile.save()

        # 5) Return the updated course data
        serializer = self.get_serializer(course, context={"request": request})
        return Response(serializer.data, status=status.HTTP_200_OK)

class VideoViewSet(viewsets.ModelViewSet):
    queryset = Video.objects.select_related('owner__user', 'course').all()
    serializer_class = VideoSerializer
    permission_classes = [VideoPermissions]

    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['owner','title','course']
    search_fields    = ['title','description', 'course__title', 'course__description']
    ordering_fields  = ['title','owner__user__username']
    filterset_class = VideoFilter

    def get_permissions(self):
        if self.request.user.is_authenticated and self.request.user.is_staff:
            return []
        return super().get_permissions()

    def perform_create(self, serializer):
        presentation_title = self.request.data.get('title')
        description = self.request.data.get('description', '')

        if not presentation_title:
            raise ValidationError("title are required")

        presentation = Presentation.objects.filter(title=presentation_title).first()
        if not presentation:
            raise ValidationError("Presentation not found in database")

        pdf_path = Path(presentation.file.path)
        course_title = presentation.course.title

        slides = script_generation.generate_slide_scripts(pdf_path, course_title)

        audio_generation.synthesize_speech(slides)

        slides.sort(key=lambda s: s.num_page)

        # 3. Render video
        with tempfile.NamedTemporaryFile(suffix=".mp4", delete=False) as temp:
            video_rendering.render_full_video(course_name=course_title, video_title=presentation_title, slides=slides, output_path=temp.name)
            final_path = Path(temp.name)

        # 4. Upload video
        video_id = youtube_uploader.upload_video(
            video_path=final_path,
            title=presentation.title,
            slides=slides,
            privacy="private"
        )

        os.remove(str(final_path))

        full_script = "\n".join(slide.script for slide in slides if slide.script)

        # 6. Save the video object
        video = Video.objects.create(
            owner=self.request.user.profile,
            course=presentation.course,
            title=presentation.title,
            description=description,
            script=full_script,
            link=f"https://www.youtube.com/watch?v={video_id}"
        )

        serializer = self.get_serializer(video)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    
class OpenEndedQuestionViewSet(viewsets.ModelViewSet):
    """
    GET  /api/questions/?video_id=<uuid>  → returns ["Q1", "Q2", …]
    POST /api/questions/                   → save { video_id, responses: [ {question,answer}, … ] }
    """
    queryset = OpenEndedQuestion.objects.all()
    serializer_class = OpenEndedQuestionSerializer
    permission_classes = [IsAuthenticated]
    http_method_names = ["get", "post"]  # only GET and POST

    def list(self, request, *args, **kwargs):
        video_id = request.query_params.get("video_id")
        if not video_id:
            return Response(
                {"detail": "Missing video_id query parameter."},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            video = Video.objects.get(id=video_id)
        except Video.DoesNotExist:
            return Response(
                {"detail": "Video not found."},
                status=status.HTTP_404_NOT_FOUND
            )

        script = video.script or ""
        try:
            raw = generate_open_ended_questions(script)
            # remove ```json fences, literal '\n', etc.
            clean = _clean_response(raw)
            parsed = json.loads(clean)
            questions_list = parsed.get("questions", [])
        except Exception:
            questions_list = []

        # Return a raw list of strings so resource.list(...) unwraps it directly
        return Response(questions_list, status=status.HTTP_200_OK)

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data, context={"request": request})
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        return Response({"status": "saved"}, status=status.HTTP_201_CREATED)

    def perform_create(self, serializer):
        serializer.save()

    def create(self, request, *args, **kwargs):
        """
        Called when POST /api/videos/questions/ is made.
        We rely on the serializer to validate and create.
        """
        serializer = self.get_serializer(data=request.data, context={"request": request})
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        return Response({"status": "saved"}, status=status.HTTP_201_CREATED)

    def perform_create(self, serializer):
        # The serializer.create() method already sets personal_data & course.
        serializer.save()

class PresentationViewSet(viewsets.ModelViewSet):
    queryset = Presentation.objects.select_related('owner__user', 'course').all()
    serializer_class = PresentationSerializer
    permission_classes = [PresentationPermissions]

    # GET /api/presentations/?course=abc&owner=def
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['owner','title']
    search_fields    = ['title','description', 'course__title', 'course__description']
    ordering_fields  = ['title','owner__user__username']
    filterset_class = PresentationFilter


    def get_permissions(self):
        if self.request.user.is_authenticated and self.request.user.is_staff:
            return []
        return super().get_permissions()

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user.profile)

class ExamViewSet(viewsets.ModelViewSet):
    queryset = Exam.objects.select_related('exam__course', 'teacher', 'student__user').all()
    permission_classes = [ExamPermissions]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['teacher', 'course', 'due_date']
    search_fields = ['description']
    ordering_fields = ['course']

    def get_serializer_class(self):
        if self.action in ['create', 'update', 'partial_update']:
            return CreateExamSerializer
        return ExamSerializer

    def perform_create(self, serializer):
        profile = self.request.user.profile
        serializer.save(
            teacher=profile
        )

class StudentExamViewSet(viewsets.ModelViewSet):
    """
    - Students can list/retrieve only their own attempts.
    - Teachers can list/retrieve all attempts for exams they created.
    """
    queryset = StudentExam.objects.select_related(
        'exam__course',   # for course_title
        'exam__teacher',  # to check teacher ownership
        'student__user'   # for student names
    ).all()
    serializer_class    = StudentExamSerializer
    permission_classes  = [StudentExamPermissions]
    filter_backends     = [DjangoFilterBackend]
    filterset_fields    = ['exam__course', 'exam', 'student__user__username',]

    def get_queryset(self):
        profile = self.request.user.profile

        if profile.role == Profile.Role.STUDENT:
            # student sees only their own attempts
            return self.queryset.filter(student=profile)

        if profile.role == Profile.Role.TEACHER:
            # teacher sees only attempts on exams they createdok what
            return self.queryset.filter(exam__teacher=profile)

        # staff/admin can see all (or return none if you prefer)
        return self.queryset
    
    @decorators.action(detail=False, methods=['post'], url_path='start', permission_classes=[IsAuthenticated],)
    def start(self, request):
        exam_id = request.data.get('exam_id')
        if not exam_id:
            return Response({'detail':'Missing exam_id'}, status=status.HTTP_400_BAD_REQUEST)

        se = StudentExam.objects.get(id=exam_id)
        if se.started_at is None:
            se.started_at = timezone.now()
            se.save(update_fields=['started_at'])
        else:
            return Response({'detail':'You have already attempted'}, status=status.HTTP_400_BAD_REQUEST)
        
        serializer = self.get_serializer(se)
        return Response(serializer.data)

    @decorators.action(detail=True, methods=['post'], url_path='submit')
    def submit(self, request, pk=None):
        se = self.get_object()
        now = timezone.now()

        # record server timestamp
        se.submitted_at = now

        # record client timestamp if provided
        client_ts = request.data.get('submittedAt')
        if client_ts:
            try:
                se.submitted_at_client = timezone.datetime.fromisoformat(client_ts)
            except ValueError:
                pass

        # enforce deadline + 5s grace
        if se.deadline and now > se.deadline + timezone.timedelta(seconds=5):
            return Response({'detail':'Too late to submit.'}, status=status.HTTP_403_FORBIDDEN)

        # accept answers
        se.answers = request.data.get('answers', {})
        se.status = 'SUBMITTED'
        se.save(update_fields=['answers','status','submitted_at','submitted_at_client'])
        return Response({'detail':'Submitted successfully.'})