from django.db import models
import uuid
from django.utils import timezone
from profiles.models import Profile, PersonalData
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
    script = models.TextField(
        blank=True,
        null=True,
        help_text="Auto-generated lecture script when a presentation is added."
    )

    # (new) Generated audio file (MP3)
    audio = models.FileField(
        upload_to="course/audio/",
        blank=True,
        null=True,
        help_text="Auto-generated audio lecture (MP3)."
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
    id = models.UUIDField(default=uuid.uuid4, unique=True, primary_key=True, editable=False)

    class Meta:
        ordering = ['title']

    def __str__(self):
        return self.title
    
class OpenEndedQuestion(models.Model):
    """
    Stores one open-ended question + answer for a given
    video, as submitted by one user.
    """
    id = models.UUIDField(default=uuid.uuid4, primary_key=True, editable=False)
    personal_data = models.ForeignKey(
        PersonalData,
        on_delete=models.CASCADE,
        related_name="open_ended_question",
    )
    video = models.ForeignKey(
        Video,
        on_delete=models.CASCADE,
        related_name="open_responses",
    )
    course = models.ForeignKey(
        Course,
        on_delete=models.CASCADE,
        related_name="open_responses",
    )
    responses = models.JSONField(
        default=list,
        help_text="A list of {question: <string>, answer: <string>} objects."
    )

    class Meta:
        verbose_name = "Open-Ended Response"
        verbose_name_plural = "Open-Ended Responses"
        ordering = ["course"]

    def __str__(self):
        return f"OpenEndedResponse(user={self.personal_data.profile.user.username}, video={self.video.id})"
    
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
    """
    One per course, created by a teacher. As soon as saved, we generate personalized exams.
    """
    DIFFICULTY_CHOICES = [
        ("Easy", "Easy"),
        ("Medium", "Medium"),
        ("Hard", "Hard"),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    teacher       = models.ForeignKey(
        Profile,
        null=False,
        on_delete=models.CASCADE,
        related_name='exams_created',
        default="",
    )
    course        = models.ForeignKey(
        Course,
        null=False,
        on_delete=models.CASCADE,
        related_name='exams',
        default="",
    )
    description   = models.TextField(null=True, blank=True)
    difficulty    = models.CharField(
        max_length=10,
        choices=DIFFICULTY_CHOICES,
        default="Medium"
    )
    key_concepts  = models.JSONField(
        default=list,
        blank=True,
        help_text="List of key concepts (e.g. ['Loops','Recursion']) that the exam should cover."
    )
    num_questions = models.PositiveIntegerField(
        default=10,
        help_text="Number of MCQ questions to generate per student."
    )
    duration      = models.FloatField(
        null=True,
        blank=True,
        help_text="Time in minutes allocated for the exam."
    )
    due_date      = models.DateField(null=True, blank=True)

    @property
    def duration_seconds(self) -> int:
        """
        Turn the (minutes) float `duration` into whole seconds for StudentExam.
        """
        return int(self.duration * 60) if self.duration else 0

    def __str__(self):
        return f"Exam({self.course.title} by {self.teacher.user.username})"


class StudentExam(models.Model):
    """
    One personalized exam instance per student per Exam.
    - `questions` holds the list of MCQs generated by ChatGPT.
    - `answers` is what the student submits later.
    """
    exam              = models.ForeignKey(
        Exam,
        on_delete=models.CASCADE,
        related_name='student_attempts'
    )
    student           = models.ForeignKey(
        Profile,
        on_delete=models.CASCADE,
        related_name='exam_attempts'
    )
    questions         = models.JSONField(
        default=list,
        blank=True,
        help_text=(
            "Generated exam questions, each as { question: str, choices: [str, str, str, str], correct_index: int }"
        )
    )
    answers           = models.JSONField(
        default=dict,
        blank=True,
        help_text="What the student submitted, e.g. { '0': 2, '1': 0, ... }"
    )
    status    = models.CharField(
        max_length=10,
        choices=[
            ('PENDING','Pending'),
            ('READY','Ready'),
            ('FAILED','Failed'),
            ('SUBMITTED','Submitted'),
        ],
        default='PENDING'
    )
    retries   = models.IntegerField(default=0)
    grade             = models.FloatField(
        null=True,
        blank=True,
        help_text="Final grade after auto-grading or teacher review"
    )
    personal_feedback = models.TextField(
        null=True,
        blank=True,
        help_text="Teacher's feedback after reviewing the student exam."
    )
    duration          = models.IntegerField(help_text="Duration in seconds")
    started_at        = models.DateTimeField(null=True, blank=True)
    submitted_at      = models.DateTimeField(null=True, blank=True)
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    submitted_at_client = models.DateTimeField(null=True, blank=True)

    @property
    def deadline(self):
        return self.started_at + timezone.timedelta(seconds=self.duration) if self.started_at else None


    class Meta:
        unique_together = (('exam', 'student'),)

    def __str__(self):
        return f"StudentExam(exam={self.exam.id}, student={self.student.user.username})"

class WrongExamAnswer(models.Model):
    """
    One row per wrong exam-question attempt. 
    Links to PersonalData → Profile.
    """
    personal_data = models.ForeignKey(
        PersonalData,
        on_delete=models.CASCADE,
        related_name="wrong_exam_answers",
    )
    question_key = models.CharField(
        max_length=100,
        help_text="Unique key/slug for the exam question (e.g. 'exam_q17')",
    )
    submitted = models.CharField(
        max_length=255,
        help_text="What the student submitted."
    )
    exam = models.ForeignKey(
        Exam,
        on_delete=models.PROTECT,
        help_text="Which exam (e.g. 'midterm1' or 'final') this question came from."
    )

    class Meta:
        verbose_name = "Wrong Exam Answer"
        verbose_name_plural = "Wrong Exam Answers"
        ordering = ["exam"]

    def __str__(self):
        return (
            f"WrongExamAnswer(={self.personal_data.profile.user.username}, "
            f"question_key={self.question_key}, exam={self.exam.course.title})"
        )
