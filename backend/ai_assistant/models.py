import uuid
from django.db import models
from django.utils import timezone
from profiles.models import PersonalData
from courses.models import Course

class AdaptiveQuizSession(models.Model):
    """
    Tracks a single student's adaptive quiz run.
    """
    id = models.UUIDField(default=uuid.uuid4, primary_key=True, editable=False)
    personal_data    = models.ForeignKey(PersonalData, on_delete=models.CASCADE)
    course           = models.ForeignKey(Course, on_delete=models.CASCADE)
    text             = models.TextField()
    initial_difficulty = models.CharField(max_length=20, choices=[("Easy","Easy"),("Medium","Medium"),("Hard","Hard")])
    total_questions  = models.IntegerField()
    asked_count      = models.IntegerField(default=0)
    last_difficulty  = models.CharField(max_length=20, blank=True, null=True)
    finished         = models.BooleanField(default=False)
    created_at       = models.DateTimeField(default=timezone.now)

    class Meta:
        ordering = ["-created_at"]

class WrongQuizAnswer(models.Model):
    """
    One row per wrong quiz-question attempt. 
    Links to PersonalData → Profile.
    """
    personal_data = models.ForeignKey(
        PersonalData,
        on_delete=models.CASCADE,
        related_name="wrong_quiz_answers",
    )
    session = models.ForeignKey(
        AdaptiveQuizSession,
        on_delete=models.CASCADE,
        related_name="wrong_answers",
        default="",
    )
    question = models.TextField(
        help_text="UThe quiz question",
    )
    submitted = models.CharField(
        help_text="What the student submitted (e.g. 'B' or 'True')."
    )
    correct = models.CharField(
        help_text="What the correct answer was."
    )
    distractors_with_rationale = models.JSONField(
        null=True,
        blank=True,
        help_text="[{distractor: str, rationale: str}, …]"
    )
    course = models.ForeignKey(
        Course,
        on_delete=models.PROTECT,
        help_text="The course this quiz belongs to."
    )
    reflection_prompt = models.TextField(
        null=True,
        blank=True,
        help_text="GPT-generated two-sentence reflection prompt"
    )
    id = models.UUIDField(default=uuid.uuid4, primary_key=True, editable=False)

    class Meta:
        verbose_name = "Wrong Quiz Answer"
        verbose_name_plural = "Wrong Quiz Answers"
        ordering = ["course"]

    def __str__(self):
        return self.question
    
    def as_json(self):
        """
        Return the minimum payload to feed to ChatGPT:
          { "question": "...", "submitted": "..." }
        """
        return {
            "question": self.question,
            "submitted": self.submitted
        }

