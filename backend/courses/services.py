import json
from ai_assistant.models import WrongQuizAnswer
from profiles.models import PersonalData
from courses.models import StudentExam
from ai_assistant.services import generate_personalized_exam

def generate_personalized_exam_for_student(exam, student_profile, difficulty, key_concepts, num_questions):
    """
    Called in a background thread once an Exam is created.
    1) Get low-grade project reasonings from PersonalData.graded_projects (grade<4.0)
    2) Get all wrong quiz questions (texts only) from WrongQuizAnswer
    3) Get course.script (JSON) from exam.course.script
    4) Build prompt + call ChatGPT
    5) Parse response → JSON list of MCQs
    6) Save a new StudentExam with questions=that_list
    """

    print("Gathering student personal information...")

    # 1) Get the student’s PersonalData
    try:
        personal_data = student_profile.personal_data
    except PersonalData.DoesNotExist:
        # If they have no PersonalData, we cannot gather graded_projects
        return

    low_projects = [
        item for item in student_profile.projects.all()
        if item.course == exam.course and item.grade < 4.0
    ]
    # Extract just the reasonings
    low_project_reasonings = [
       item.reason
        for item in low_projects
    ]

    # 2) Fetch all WrongQuizAnswer objects for this student & course
    wrong_qas = WrongQuizAnswer.objects.filter(
        personal_data=personal_data,
        course=exam.course
    )
    wrong_quiz_questions = [wqa.as_json() for wqa in wrong_qas]

    course_script = exam.course.script or {}

    response = generate_personalized_exam(
        difficulty=difficulty,
        key_concepts=key_concepts,
        num_questions=num_questions,
        project_reasonings=low_project_reasonings,
        wrong_quiz_questions=wrong_quiz_questions,
        course_script=course_script
    )
    
    try:
        questions_list = json.loads(response)
        if not isinstance(questions_list, list):
            raise ValueError("Expected a JSON array of questions")
    except Exception:
        print(questions_list)
        return

    StudentExam.objects.create(
        exam=exam,
        student=student_profile,
        questions=questions_list,
        answers={},
        status='READY',
        duration=exam.duration_seconds,
        submitted_at=None,
        started_at=None
    )

    print("Student exam created!")
