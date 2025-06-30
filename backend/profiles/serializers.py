from rest_framework import serializers
from django.contrib.auth.password_validation import validate_password
from django.contrib.auth.hashers import make_password
from rest_framework import serializers
from rest_framework.validators import UniqueValidator
from django.contrib.auth.models import User
from .models import Profile, Project

class ProfileSerializer(serializers.ModelSerializer):
    """
    Serializes Read Update Delete operations 
    """
    username = serializers.CharField(source='user.username', read_only=True)
    first_name  = serializers.CharField(required=False, allow_blank=True)
    last_name   = serializers.CharField(required=False, allow_blank=True)
    bio         = serializers.CharField(required=False, allow_blank=True)
    profile_pic = serializers.ImageField(required=False, use_url=True)
    enrolled_courses = serializers.PrimaryKeyRelatedField(
        many=True,
        read_only=True
    )
    role = serializers.ChoiceField(
        choices=Profile.Role.choices,
        read_only=True,
    )

    class Meta:
        model = Profile
        fields = [
            'username','id','first_name','last_name','bio','profile_pic', 'role', 'enrolled_courses',
        ]
        read_only_fields = ['username','id','role', 'enrolled_courses',]

class ProfileCreateSerializer(serializers.Serializer):
    """
    Serializes Create operations and registers Users
    """
    username = serializers.CharField(
        required=True,
        validators=[UniqueValidator(queryset=User.objects.only('username'))],
        style={'input_type': 'text'}
    )
    email = serializers.EmailField(
        required=True,
        validators=[UniqueValidator(queryset=User.objects.only('email'))],
        style={'input_type': 'email'}
    )
    password1 = serializers.CharField(
        write_only=True,
        required=True,
        min_length=8,
        style={'input_type': 'password'}
    )
    password2 = serializers.CharField(
        write_only=True,
        required=True,
        style={'input_type': 'password'}
    )

    first_name = serializers.CharField(
        max_length=150,
        required=False,
        allow_blank=True
    )
    last_name = serializers.CharField(
        max_length=150,
        required=False,
        allow_blank=True
    )
    bio        = serializers.CharField(required=False, allow_blank=True)
    profile_pic = serializers.ImageField(required=False)

    role = serializers.ChoiceField(
        choices=Profile.Role.choices,
        required=True,
    )

    def validate(self, attrs):
        if attrs['password1'] != attrs['password2']:
            raise serializers.ValidationError({
                'password2': "Password fields didn't match."
            })
        
        attrs.pop('password2')
        validate_password(attrs['password1'])

        return attrs

    def create(self, validated_data):

        user_data ={
            'username':  validated_data.pop('username'),
            'email':     validated_data.pop('email'),
            'password':  validated_data.pop('password1'),
            'first_name':validated_data.pop('first_name', ''),
            'last_name': validated_data.pop('last_name', ''),
        }

        user = User.objects.create_user(**user_data)

        profile = Profile.objects.create(
            user=user,
            **validated_data
        )
        return profile
    
class ChangePasswordSerializer(serializers.Serializer):
    """
    Enables password change for the underlaying User
    """

    old_password  = serializers.CharField(write_only=True, required=True)
    new_password1 = serializers.CharField(
        write_only=True,
        required=True,
        min_length=8,
        style={'input_type': 'password'}
    )
    new_password2 = serializers.CharField(
        write_only=True,
        required=True,
        style={'input_type': 'password'}
    )

    def validate(self, attrs):
        if attrs['new_password1'] != attrs['new_password2']:
            raise serializers.ValidationError({'password2': "The specified passwords didn't match"})
        
        validate_password(attrs['new_password1'])
        return attrs

    def validate_old_password(self, value):
        user = self.context['request'].user
        if not user.check_password(value):
            raise serializers.ValidationError("Old password is incorrect.")
        return value

    def save(self):
        user = self.context['request'].user
        user.password = make_password(self.validated_data['new_password1'])
        user.save()

        return user
    
class ProjectCreateSerializer(serializers.ModelSerializer):
    """
    Serializer for students to upload a new project.
    Fields: file, course (UUID), title, description.
    grade is read_only (students cannot set it).
    """
    student = serializers.HiddenField(
        default=serializers.CurrentUserDefault()  # We'll override in view to set the Profile
    )
    class Meta:
        model = Project
        fields = ['id', 'student', 'course', 'file', 'title', 'description', 'grade', 'reason', 'created_at', 'updated_at']
        read_only_fields = ['id', 'student', 'created_at', 'updated_at']

    def create(self, validated_data):
        # Ensure 'student' is saved as the Profile instance, not the User
        request = self.context.get('request')
        user_profile = request.user.profile
        validated_data['student'] = user_profile
        return super().create(validated_data)


class ProjectSerializer(serializers.ModelSerializer):
    """
    Full serializer for Project. Used by teachers to view/edit grades, by students to view their own.
    - student → read-only nested field (profile ID)
    - course → read-only nested field (course ID)
    - file → URL for download
    - grade → teacher can write, student sees read-only
    """
    student_id = serializers.UUIDField(source='student.id', read_only=True)
    student_username = serializers.CharField(source='student.username', read_only=True)
    course_id = serializers.UUIDField(source='course.id', read_only=True)
    course_title = serializers.CharField(source='course.title', read_only=True)
    file_url = serializers.FileField(source='file', read_only=True)

    class Meta:
        model = Project
        fields = [
            'id',
            'student_id',
            'student_username',
            'course_id',
            'course_title',
            'file_url',
            'title',
            'description',
            'grade',
            'reason',
            'created_at',
            'updated_at'
        ]
        read_only_fields = ['id', 'student_id', 'student_username', 'course_id', 'course_title', 'created_at', 'updated_at']
    