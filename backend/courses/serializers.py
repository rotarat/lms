from rest_framework import serializers
from .models import Course, Video, Presentation, Exam, StudentExam
from django.core.validators import FileExtensionValidator
import magic

class CourseSerializer(serializers.ModelSerializer):
    id             = serializers.UUIDField(read_only=True)
    owner_id       = serializers.UUIDField(source='owner.id', read_only=True)
    owner_username = serializers.CharField(source='owner.user.username', read_only=True)

    class Meta:
        model = Course
        fields = [
            'id','owner_id','owner_username',
            'title','description','featured_image',
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
            'title','description','link','key_points', 'script',
        ]
        read_only_fields = ['id','owner_id','owner_username','course_id', 'course', 'link', 'script', 'key_points']


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

class ExamSerializer(serializers.ModelSerializer):
    class Meta:
        model = Exam
        fields = '__all__'
        read_only_fields = ('creator','test')


class CreateExamSerializer(serializers.ModelSerializer):
    class Meta:
        model = Exam
        fields = ('course','due_date','duration')

class StudentExamSerializer(serializers.ModelSerializer):
    class Meta:
        model = StudentExam
        fields = '__all__'
        read_only_fields = ('student','started_at','submitted_at','grade')
