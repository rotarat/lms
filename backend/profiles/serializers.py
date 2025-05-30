from rest_framework import serializers
from .models import Profile
from django.contrib.auth.password_validation import validate_password
from django.contrib.auth.hashers import make_password
from rest_framework import serializers
from rest_framework.validators import UniqueValidator
from django.contrib.auth.models import User

class ProfileSerializer(serializers.ModelSerializer):
    """
    Serializes Read Update Delete operations 
    """
    username = serializers.CharField(source='user.username', read_only=True)
    first_name  = serializers.CharField(required=False, allow_blank=True)
    last_name   = serializers.CharField(required=False, allow_blank=True)
    bio         = serializers.CharField(required=False, allow_blank=True)
    profile_pic = serializers.ImageField(required=False, use_url=True)
    role = serializers.ChoiceField(
        choices=Profile.Role.choices,
        read_only=True,
    )

    class Meta:
        model = Profile
        fields = [
            'username','id','first_name','last_name','bio','profile_pic', 'role',
        ]
        read_only_fields = ['username','id','role']

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