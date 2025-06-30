import json
from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import WrongQuizAnswer
from ai_assistant.services import ask_openai

@receiver(post_save, sender=WrongQuizAnswer)
def generate_reflection_for_wrong(sender, instance, created, **kwargs):
    # Only generate if newly created AND reflection_prompt is empty
    if not created or instance.reflection_prompt:
        return

    mcq_text = instance.question
    user_answer = instance.submitted
    correct = instance.correct

    PROMPT = """
      A student answered this multiple-choice question incorrectly:
      {mcq_text}
      They answered: {user_answer}
      Correct answer: {correct}

      1) Produce a two-sentence reflection prompt that asks the student to analyze why they got this wrong.
      2) Then ask one open-ended question that deepens their understanding of the concept.
      Answer in bulgarian to both 1) and 2).
      
      Return JSON:
      {{"reflection_prompt": "<string>"}}
    """

    formatted_prompt = PROMPT.format(mcq_text=mcq_text, user_answer=user_answer, correct=correct)

    try:
        response = ask_openai(formatted_prompt)
        parsed = json.loads(response)
        ref_text = parsed.get("reflection_prompt", "").strip()
    except Exception:
        ref_text = ""

    # Save back to the same WrongQuizAnswer row
    instance.reflection_prompt = ref_text
    instance.save(update_fields=["reflection_prompt"])
