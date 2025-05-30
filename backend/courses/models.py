from django.db import models
import uuid
from profiles.models import Profile
from django.core.validators import FileExtensionValidator

# Create your models here.
class Course(models.Model):
    owner = models.ForeignKey(Profile, null=True, blank=True, on_delete=models.SET_NULL, related_name='courses')
    title = models.CharField(max_length=200, unique=True)
    description = models.TextField(null=True, blank=True)
    featured_image = models.ImageField(
        upload_to='courses/images/',
        default='courses/images/default_course_img_E4H4Mp2.jpg',
        blank=True
    )
    id = models.UUIDField(default=uuid.uuid4, unique=True, primary_key=True, editable=False)

    class Meta:
        ordering = ['title']

    def __str__(self):
        return self.title
    
class Video(models.Model):
    owner = models.ForeignKey(Profile, null=True, blank=True, on_delete=models.SET_NULL, related_name='videos')
    course = models.ForeignKey(Course, null=True, on_delete=models.SET_NULL, related_name='videos')
    title = models.CharField(max_length=200)
    description = models.TextField(null=True, blank=True)
    link = models.CharField(max_length=2000)
    script = models.CharField(blank=True, null=True)
    from django.db.models import JSONField
    key_points = JSONField(
        default=list,
        blank=True,
        help_text="A list of strings: each one a key point"
    )
    id = models.UUIDField(default=uuid.uuid4, unique=True, primary_key=True, editable=False)

    class Meta:
        ordering = ['title']

    def __str__(self):
        return self.title
    
class Presentation(models.Model):
    owner = models.ForeignKey(Profile, null=True, blank=True, on_delete=models.SET_NULL, related_name='presentations')
    course = models.ForeignKey(Course, null=True, on_delete=models.SET_NULL, related_name='presentations')
    title = models.CharField(max_length=200)
    description = models.TextField(null=True, blank=True)
    file        = models.FileField(
        upload_to='presentations/files/',
        validators=[FileExtensionValidator(allowed_extensions=['pdf'])],
        blank=True,
        null=True,
    )
    id = models.UUIDField(default=uuid.uuid4, unique=True, primary_key=True, editable=False)

    class Meta:
        ordering = ['title']

    def __str__(self):
        return self.title
    
class Exam(models.Model):
    teacher = models.ForeignKey(Profile, null=True, blank=True, on_delete=models.SET_NULL, related_name='exam')
    course = models.ForeignKey(Course, null=True, on_delete=models.SET_NULL, related_name='exam')
    description = models.TextField(null=True, blank=True)
    duration = models.FloatField(null=True, blank=True)
    due_date = models.DateField(null=True, blank=True)
    test = models.JSONField(null=True, blank=True)
    id = models.UUIDField(default=uuid.uuid4, unique=True, primary_key=True, editable=False)

    def __str__(self):
        return self.course.title
    
class StudentExam(models.Model):
    exam         = models.ForeignKey(Exam, on_delete=models.CASCADE, related_name='attempts')
    student      = models.ForeignKey(Profile, on_delete=models.CASCADE, related_name='exam_attempts')
    answers      = models.JSONField()   # {"0": "A", "1": "C", …}
    grade        = models.FloatField(null=True)
    started_at   = models.DateTimeField(auto_now_add=True)
    submitted_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        unique_together = (('exam','student'),)
