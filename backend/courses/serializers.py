from rest_framework import serializers
from .models import Course, Video, Presentation, Exam, StudentExam, OpenEndedQuestion
from profiles.models import Profile
from django.core.validators import FileExtensionValidator
import magic

class CourseSerializer(serializers.ModelSerializer):
    id             = serializers.UUIDField(read_only=True)
    owner_id       = serializers.UUIDField(source='owner.id', read_only=True)
    owner_username = serializers.CharField(source='owner.user.username', read_only=True)
    featured_image_url = serializers.ImageField(source="featured_image", read_only=True)

    class Meta:
        model = Course
        fields = [
            'id','owner_id','owner_username',
            'title','description','featured_image_url', 'audio',
        ]
        read_only_fields = ['id','owner_id','owner_username']


class VideoSerializer(serializers.ModelSerializer):
    id             = serializers.UUIDField(read_only=True)
    owner_id       = serializers.UUIDField(source='owner.id', read_only=True)
    owner_username = serializers.CharField(source='owner.user.username', read_only=True)
    course_id      = serializers.UUIDField(source='course.id', read_only=True)

    class Meta:
        model = Video
        fields = [
            'id', 'owner_id','owner_username',
            'course','course_id',
            'title','description','link', 'script',
        ]
        read_only_fields = ['id','owner_id','owner_username','course_id', 'course', 'link', 'script']


class PresentationSerializer(serializers.ModelSerializer):
    id             = serializers.UUIDField(read_only=True)
    owner_id       = serializers.UUIDField(source='owner.id', read_only=True)
    owner_username = serializers.CharField(source='owner.user.username', read_only=True)
    course_id      = serializers.UUIDField(source='course.id', read_only=True)
    file = serializers.FileField(validators=[FileExtensionValidator(['pdf'])])

    def validate_file(self, f):
        mime = magic.from_buffer(f.read(2048), mime=True)
        f.seek(0)
        if mime != 'application/pdf':
            raise serializers.ValidationError('Uploaded file must be a PDF.')
        return f

    class Meta:
        model = Presentation
        fields = [
            'id', 'owner_id','owner_username',
            'course','course_id',
            'title','description','file',
        ]
        read_only_fields = ['id','owner_id','owner_username','course_id']

class CreateExamSerializer(serializers.ModelSerializer):
    teacher = serializers.HiddenField(default=serializers.CurrentUserDefault())
    key_concepts = serializers.ListField(
        child=serializers.CharField(max_length=100),
        allow_empty=False
    )
    difficulty = serializers.ChoiceField(choices=Exam.DIFFICULTY_CHOICES)
    num_questions = serializers.IntegerField(min_value=1, max_value=20)

    class Meta:
        model = Exam
        fields = [
            "id",
            "teacher",
            "course",
            "description",
            "difficulty",
            "key_concepts",
            "num_questions",
            "duration",
            "due_date",
        ]
        read_only_fields = ["id", "teacher"]

    def create(self, validated_data):
        # teacher will be set by CurrentUserDefault if the user has a Profile
        return Exam.objects.create(**validated_data)

class ExamSerializer(serializers.ModelSerializer):
    class Meta:
        model = Exam
        fields = [
            "id", "teacher", "course", "description", "difficulty", 
            "key_concepts", "num_questions", "duration", "due_date", "created_at",
        ]
        read_only_fields = ["id", "teacher", "created_at", "course", "due_date"]


class NestedExamSerializer(serializers.ModelSerializer):
    course_title = serializers.CharField(source='course.title', read_only=True)

    class Meta:
        model = Exam
        fields = [
            'id',
            'course_title',
            'description',
            'num_questions',
            'duration',
            'due_date',
        ]

class StudentExamSerializer(serializers.ModelSerializer):
    exam = NestedExamSerializer(read_only=True)

    answers = serializers.JSONField(required=False)

    student_first_name = serializers.CharField(
        source='student.user.first_name', read_only=True
    )
    student_last_name  = serializers.CharField(
        source='student.user.last_name',  read_only=True
    )
    course_title       = serializers.CharField(
        source='exam.course.title',      read_only=True
    )
    started_at   = serializers.DateTimeField(read_only=True, allow_null=True, default=None)
    submitted_at = serializers.DateTimeField(read_only=True, allow_null=True, default=None)

    class Meta:
        model = StudentExam
        fields = [
            "id",
            "exam",
            "student",
            "questions",
            "answers",
            "grade",
            'status', 
            'duration',
            "personal_feedback",
            "started_at",
            "submitted_at",
            'submitted_at_client',
            'student_first_name', 
            'student_last_name', 
            'course_title',

        ]
        read_only_fields = [
            "id", "exam", "student", "questions", "started_at", "submitted_at",
            'student_first_name',
            'student_last_name',
            'course_title', 
        ]

class OpenEndedQuestionSerializer(serializers.ModelSerializer):
    """
    Client sends:
      {
        "video_id": "<uuid>",
        "responses": [
          { "question": "<string>", "answer": "<string>" },
          { "question": "<string>", "answer": "<string>" }
        ]
      }
    We automatically set:
      personal_data = request.user.personal_data
      course       = video.course
    """

    video_id = serializers.UUIDField(write_only=True)
    responses = serializers.ListField(
        child=serializers.DictField(child=serializers.CharField()),
        allow_empty=False,
        help_text="List of { question: <string>, answer: <string> }"
    )

    class Meta:
        model = OpenEndedQuestion
        fields = ("id", "video_id", "responses")
        read_only_fields = ("id",)

    def validate_video_id(self, value):
        if not Video.objects.filter(id=value).exists():
            raise serializers.ValidationError("Video with this ID does not exist.")
        return value

    def validate_responses(self, value):
        if not isinstance(value, list) or len(value) == 0:
            raise serializers.ValidationError("Must provide at least one question/answer.")
        for idx, item in enumerate(value):
            if set(item.keys()) != {"question", "answer"}:
                raise serializers.ValidationError(
                    f"Item #{idx + 1} must have exactly 'question' and 'answer' keys."
                )
            if not item["question"].strip():
                raise serializers.ValidationError(
                    f"Item #{idx + 1}: 'question' cannot be empty."
                )
            if not item["answer"].strip():
                raise serializers.ValidationError(
                    f"Item #{idx + 1}: 'answer' cannot be empty."
                )
        return value

    def create(self, validated_data):
        """
        - Pop off 'video_id' UUID, lookup that Video.
        - Attach profile.personal_data and course automatically.
        """
        video_uuid = validated_data.pop("video_id")
        video = Video.objects.get(id=video_uuid)

        user = self.context["request"].user
        profile = Profile.objects.get(user=user)
        pd = profile.personal_data

        return OpenEndedQuestion.objects.create(
            personal_data=pd,
            video=video,
            course=video.course,
            responses=validated_data["responses"],
        )