import os
from rest_framework import viewsets, status, decorators
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import ValidationError
from .models import Course, Video, Presentation, Exam, StudentExam
from .serializers import CourseSerializer, VideoSerializer, PresentationSerializer, ExamSerializer, CreateExamSerializer, StudentExamSerializer
from .permissions import CoursePermissions, VideoPermissions, PresentationPermissions, ExamPermissions
from django_filters.rest_framework import DjangoFilterBackend
from .filters import CourseFilter, PresentationFilter, VideoFilter
from rest_framework.filters import SearchFilter, OrderingFilter
from video_generation.services import script_generation, audio_generation, video_rendering, youtube_uploader
from pathlib import Path
import tempfile
from video_generation.services import slide
from ai_assistant.services import fetch_quiz_questions
from django.utils import timezone
from datetime import timedelta

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

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user.profile)


class VideoViewSet(viewsets.ModelViewSet):
    queryset = Video.objects.select_related('owner__user', 'course').all()
    serializer_class = VideoSerializer
    permission_classes = [VideoPermissions]

    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['owner','title']
    search_fields    = ['title','description', 'key_points', 'course__title', 'course__description']
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

        # audio_generation.synthesize_speech(slides)

        slides.sort(key=lambda s: s.num_page)

        slides[0].audio_path="video_generation/services/test_slides/audio/slide_1.mp3"
        slides[0].topic="Квантови изчисления"
        slides[0].script="Квантовите изчисления представляват революционна технология, която използва принципите на квантовата механика за обработка на информация. За разлика от класическите компютри, които използват битове, квантовите компютри работят с кубити, което позволява извършване на сложни изчисления с висока скорост и ефективност. Тази лекция ще представи основите на квантовите изчисления и потенциалните им приложения в различни области като криптография, оптимизация и симулации на квантови системи."
        
        slides[1].audio_path="video_generation/services/test_slides/audio/slide_2.mp3"
        slides[1].topic="Квантова информатика"
        slides[1].script="Квантовата информатика е поле, което изучава как информацията може да бъде обработвана и предавана чрез квантови системи. Основава се на принципите на квантовата механика и предлага нови методи за обработка на информация, които надминават възможностите на класическите компютри. Това включва използването на квантови битове или кубити, които могат да съществуват в множество състояния едновременно, което води до значително по-бързо и ефективно изчисление."

        slides[2].audio_path="video_generation/services/test_slides/audio/slide_3.mp3"
        slides[2].topic="Ричард Файнман"
        slides[2].script="Ричард Файнман е виден физик, известен със своите приноси в квантовата информатика и участието си в проект Манхатън. Роден през 1918 г. в Ню Йорк, Файнман проявява интерес към математиката още от ранна възраст, като на 15 години вече овладява интегрално и диференциално смятане. Завършва Масачузетския технологичен институт и защитава докторска степен в Принстън. Кариерата му включва преподавателска дейност в Корнел и Калифорнийския технологичен институт. Файнман участва в разработката на атомната бомба по време на Втората световна война, въпреки първоначалните си колебания. Неговата работа в теоретичните изчисления в Лос Аламос е от съществено значение за успеха на проекта."

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
    queryset = Exam.objects.all()
    filterset_fields = ['course', 'due_date']
    permission_classes = [ExamPermissions]

    def get_serializer_class(self):
        return CreateExamSerializer if self.action == 'create' else ExamSerializer

    def perform_create(self, serializer):
        profile = self.request.user.profile
        course  = serializer.validated_data['course']
        # grab the video script for the course
        video = course.video_set.first()
        text  = video.script if video else ''
        # call your AI helper
        questions = fetch_quiz_questions(
            text=text,
            difficulty="hard",
            questions=10
        )
        serializer.save(
            creator=profile,
            test={'questions': questions}
        )

    @decorators.action(detail=True, methods=['get'], url_path='start')
    def start(self, request, pk=None):
        exam = self.get_object()
        profile = request.user.profile
        # only students enrolled in this course may start
        if exam.course not in profile.enrolled_courses.all():
            return Response(
                {'detail': 'Not enrolled in this course.'},
                status=status.HTTP_403_FORBIDDEN
            )
        student_exam, created = StudentExam.objects.get_or_create(
            exam=exam,
            student=profile
        )
        return Response({
            'test':      exam.test,
            'duration':  exam.duration,
            'attempt_id': student_exam.id
        })


class StudentExamViewSet(viewsets.ReadOnlyModelViewSet):
    """
    Students can list & retrieve only their own attempts.
    Submissions handled via custom POST action.
    """
    queryset = StudentExam.objects.select_related('exam','student')
    serializer_class = StudentExamSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return self.queryset.filter(student=self.request.user.profile)

    @decorators.action(detail=False, methods=['post'], url_path='submit')
    def submit(self, request):
        attempt_id = request.data.get('attempt_id')
        answers    = request.data.get('answers', {})
        try:
            se = StudentExam.objects.get(
                pk=attempt_id,
                student=request.user.profile
            )
        except StudentExam.DoesNotExist:
            return Response(
                {'detail': 'Invalid attempt.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        deadline = se.started_at + timedelta(minutes=se.exam.duration)
        if timezone.now() > deadline:
            return Response(
                {'detail': 'Time is up.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        se.answers      = answers
        # grade calculation
        questions = se.exam.test.get('questions', [])
        correct   = sum(
            1 for idx, q in enumerate(questions)
            if answers.get(str(idx)) == q.get('correct_answer')
        )
        se.grade        = (correct / len(questions)) * 100 if questions else 0
        se.submitted_at = timezone.now()
        se.save()
        return Response({'grade': se.grade})