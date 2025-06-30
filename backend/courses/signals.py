import io
import threading
from django.db.models.signals import post_save
from django.dispatch import receiver
from pypdf import PdfReader
from .models import Presentation, Exam
from ai_assistant.services import generate_audio_lecture
from .services import generate_personalized_exam_for_student

# A helper to extract plain text from a PDF file field
def extract_text_from_pdf(pdf_field_file) -> str:
    """
    Given a Django FileField (pointing to a PDF), return all its text.
    """
    # pdf_field_file may be a FieldFile; we can read it with PdfReader
    reader = PdfReader(io.BytesIO(pdf_field_file.read()))
    full_text = []
    for page in reader.pages:
        text = page.extract_text() or ""
        full_text.append(text)
    return "\n\n".join(full_text)


@receiver(post_save, sender=Presentation)
def generate_course_script_from_presentation(sender, instance: Presentation, created, **kwargs):
    """
    When a Presentation is created (i.e. teacher uploads a new PDF),
    automatically call ChatGPT to produce a 'lecture script' from its contents.
    Then save that script into the associated Course.script field.

    If the Presentation already existed but the PDF file changed,
    we also regenerate. (You can refine this logic if you only want it on creation.)
    """
    # Only trigger when a teacher‐owned presentation is saved (not when a student views it)
    # Assuming Presentation has a foreign key 'course'
    course = instance.course

    # Extract raw text from the PDF file
    try:
        pdf_file = instance.file  # adjust if your field name is different
        raw_text = extract_text_from_pdf(pdf_file)
    except Exception as e:
        # If PDF extraction fails, we skip generating a script
        return

    if not raw_text.strip():
        return  # no content to summarize

    course.script = generate_audio_lecture(raw_text)
    course.save(update_fields=["script"])

@receiver(post_save, sender=Exam)
def on_exam_created(sender, instance: Exam, created, **kwargs):
    """
    When a new Exam is created by a teacher:
      - For each enrolled student in that course, spin off a background thread
        to call generate_personalized_exam_for_student(...)
    """
    if not created:
        return

    print("Starting personal exam creation...")

    course = instance.course
    difficulty = instance.difficulty
    key_concepts = instance.key_concepts
    num_questions = instance.num_questions

    # Fetch all enrolled students (Profile instances)
    enrolled_students = course.enrolled_profiles.all()

    # For each student, launch a background thread (daemon=True)
    for student_profile in enrolled_students:
        threading.Thread(
            target=generate_personalized_exam_for_student,
            args=(instance, student_profile, difficulty, key_concepts, num_questions),
            daemon=True
        ).start()