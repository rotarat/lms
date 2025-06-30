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
    
class PersonalData(models.Model):
    """
    One-to-one with Profile (your custom user). Stores only open-ended JSON here.
    All “wrong answer” data lives in child tables (WrongQuizAnswer / WrongExamAnswer).
    """

    profile = models.OneToOneField(
        Profile,
        on_delete=models.CASCADE,
        related_name="personal_data",
    )
    graded_projects = models.JSONField(default=list, blank=True)

    class Meta:
        verbose_name = "Personal Data"
        verbose_name_plural = "Personal Data"

    def __str__(self):
        return f"PersonalData(user={self.profile.user.username})"

class Project(models.Model):
    """
    A Project uploaded by a student, tied to a Course.
    Teachers can assign a grade. Students can upload their project files.
    """
    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False
    )
    student = models.ForeignKey(
        Profile,
        on_delete=models.CASCADE,
        related_name='projects'
    )
    course = models.ForeignKey(
        "courses.course",
        on_delete=models.CASCADE,
        related_name='projects'
    )
    # Allow a file upload (could be .zip, .pdf, etc.). Adjust upload_to as desired.
    file = models.FileField(
        upload_to='projects/',
        help_text='Upload your project files (PDF, ZIP, etc.).'
    )
    title = models.CharField(blank=True)
    description = models.TextField(blank=True)

    # Grade assigned by a teacher. Null if not yet graded.
    grade = models.FloatField(
        null=True,
        blank=True,
        help_text='Grade assigned by teacher.'
    )
    reason = models.TextField(
        blank=True,
        null=True,
        help_text="Teacher's short explanation for the grade."
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f'Project(id={self.id}, student={self.student.user.username}, course={self.course.title})'