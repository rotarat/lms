import uuid
from django.db import models
from django.contrib.auth.models import User

class Profile(models.Model):
    """
    Profile that extends the basic user with additional client information
    """
    class Role(models.TextChoices):
        STUDENT = 'student', 'Student'
        TEACHER = 'teacher', 'Teacher'

    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile', null=True, blank=True)
    first_name = models.CharField(max_length=150, blank=True)
    last_name  = models.CharField(max_length=150, blank=True)
    bio = models.TextField(blank=True)
    profile_pic = models.ImageField(
        upload_to='profiles/images/',
        default='profiles/images/default-avatar.png',
        blank=True
    )
    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False
    )
    role = models.CharField(
        max_length=10,
        choices=Role.choices,
    )
    enrolled_courses = models.ManyToManyField(
        'courses.Course',
        related_name='enrolled_profiles',
        blank=True
    )

    @property
    def username(self):
        return self.user.username

    def __str__(self):
        return f'{self.username}'
