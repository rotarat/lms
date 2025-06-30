import json
import os
import re
import uuid
import base64
import subprocess
import random
from pathlib import Path
from openai import OpenAI
from dotenv import load_dotenv
from core.settings import DOTENV_PATH, PLANTUML_JAR_PATH, MEDIA_ROOT

load_dotenv(dotenv_path=DOTENV_PATH)
client = OpenAI(
        base_url="https://openrouter.ai/api/v1",
        api_key=os.getenv("OPENAI_API_KEY_1"),
    )
def _clean_response(raw: str) -> str:
    """
    1) Remove any wrapping ``` or ```json fences
    2) Strip out all literal '\n' characters
    3) Trim whitespace
    """
    text = raw.strip()

    # 1. Remove ``` code fences (with optional "json" tag)
    if text.startswith("```") and text.endswith("```"):
        # drop the first/last fence
        inner = text[3:-3].lstrip()
        # if it starts with "json", drop that too
        if inner.lower().startswith("json"):
            inner = inner[4:].lstrip()
        text = inner

    # 2. Remove any leftover '\n' characters
    text = text.replace("\n", "")

    # 3. Final trim
    return text.strip()

def explain_diagram(diagram_file_base64):
    """
    Given a Path to a saved diagram image file, call GPT-4o in multimodal mode
    and return the textual explanation.
    """

    PROMPT="""
        Please explain the contents of the following diagram in Bulgarian:
    """

    completion = client.chat.completions.create(
        model="gpt-4o",
        messages=[
            {"role": "system", "content": "You are an expert at reading technical diagrams."},
            {"role": "user", 
             "content": [
                            {"type": "text", "text": PROMPT},
                            {"type": "image_url", 
                             "image_url": {
                                    "url": f"data:image/png;base64,{diagram_file_base64}"
                                }
                            }
                    ]},
        ],
    )
    explanation_text = completion.choices[0].message.content.strip()

    return explanation_text

def generate_diagram(text):
    """
    Given a textual description, call GPT-4o to generate a PlantUML block.
    Returns the raw GPT response (which should be a full @startuml ... @enduml block,
    followed by "Explanation:" lines).
    """

    PROMPT_TEMPLATE = """
        Generate only a valid PlantUML block (from @startuml through @enduml) for the following description:

        {text}

        After the UML block, provide a **Bulgarian explanation formatted in Markdown**.  
        For example:
        ```
        @startuml
          … PlantUML lines …
        @enduml

        Explanation:
        Това e диаграма, която показва …
        * Първата точка
        * Втора точка
        ```
        Do NOT output any raw text—only valid PlantUML lines and then Markdown.
    """

    prompt = PROMPT_TEMPLATE.format(
        text=text,
    )

    completion = client.chat.completions.create(
        model="gpt-4o",
        messages=[
            {"role": "system", "content": "You are a PlantUML expert. Output only valid PlantUML syntax."},
            {"role": "user", "content": prompt},
        ]
    )

    explanation = completion.choices[0].message.content.strip()

    return explanation

def fetch_quiz_questions(text, difficulty):
    SCHEMA = {"questions": [{"question": "<string>","correct_answer": "<string>","distractors_with_rationale": [{"distractor": "<string>", "rationale": "<string>" },{"distractor": "<string>", "rationale": "<string>" },{ "distractor": "<string>", "rationale": "<string>" }],"explanation": "<string>"}]}

    
    DISTRACTORS = """
        Distractors must be plausible and homogeneous in style (Haladyna et al. 2002; Tarrant et al. 2009). 
        Each wrong option should reflect a common misconception (Case & Swanson 2001). Construct distractors 
        that are close in length and complexity to the correct answer, omitting a critical attribute to sow learner uncertainty.
    """

    PROMPT_TEMPLATE = """
        Text: {text}

        Follow these guidelines:

        1. Based on the difficulty: “{difficulty}” create a MCQ question.
        2. Produce the correct answer and three distractors.  
        3. Each distractor must be: 
        • Plausible and parallel in style/length to the correct answer.  
        • Rooted in a common misconception about the topic.  
        4. For each distractor, also provide a two-sentence rationale explaining why that distractor might confuse learners and explanation why the right answer is correct.

        Do not include any Markdown, extra commentary—output or backticks. Create the questions in bulgarian language only.
        Return only valid JSON that matchies this schema exactly:

        {schema}

        {distractors}
    """

    prompt = PROMPT_TEMPLATE.format(
        text=text,
        difficulty=difficulty,
        schema=json.dumps(SCHEMA, indent=2, ensure_ascii=False),
        distractors=DISTRACTORS,

    )

    raw_response = client.chat.completions.create(
        model="gpt-4o",
        messages=[
            {"role": "system", "content": "You are an expert at generating research-backed multiple-choice quizzes."},
            {"role": "user", "content": prompt},
        ],
        n = 3,
        temperature=0.8,
        top_p=0.9,
        frequency_penalty=0.2,
        presence_penalty=0.2,
    )

    variants = []
    content = raw_response.choices
    for choice in content:
      try:
        data = json.loads(_clean_response(choice.message.content))
        variants.append(data.get("questions", []))
      except:
        continue
    
    return random.choice(variants) if variants else []

def ask_openai(message):
    PROMPT_MESSAGE ="""
        You are an expert teaching assistant in a modern learning management system. 
        Your goal is to give students clear, step-by-step explanations, examples, and practical tips on any topic they ask about. 
        Keep your answers friendly, detailed, and focused on helping students understand and apply concepts. 
       **Provide your answer in Markdown format**—use headings, bullet lists, code blocks, etc. Do **not** use any HTML tags. Please do not add any additional characters including new line ones.

        Now provide a full answer to the question:
        {message}
    """

    formatted_message = PROMPT_MESSAGE.format(message=message)

    response = client.chat.completions.create(
        model="gpt-4o",
        messages=[
            {"role": "system", "content": "You are an expert at generating research-backed multiple-choice quizzes."},
            {"role": "user", "content": formatted_message},
        ],
        n = 1,
        temperature=0.7,
    )

    answer = str(response.choices[0].message.content)

    return answer

def generate_or_explain_diagram(text, image_file, action: str):
    """
    Depending on `action`, do one of:
      - "diagram":   Generate a PlantUML diagram from `text`. Return (filename, None).
      - "explanation": Explain the uploaded image. Return (None, explanation_text).

    Results:
      - If action == "diagram":  
          Returns ("diagram_<uuid>.png", None).  
          Also writes:
            MEDIA_ROOT/diagrams/diagram_<uuid>.puml
            MEDIA_ROOT/diagrams/diagram_<uuid>.png

      - If action == "explanation":  
          Returns (None, "<text explanation>").  
          Does not write any PNG (or may optionally delete the temp upload).

    Raises Exception on error.
    """
    
    unique_id = uuid.uuid4().hex[:8]
    filename_base = f"diagram_{unique_id}"

    # ─── ACTION: EXPLANATION ────────────────────────────────────────────────────────
    if action.lower() == "explanation":
        if image_file is None:
            raise Exception("To get an explanation, please upload an image.")

       # 1) Read the image bytes
        image_bytes = image_file.read()
        # 2) Base64‐encode
        image_b64 = base64.b64encode(image_bytes).decode("utf-8")

        try:
            explanation_text = explain_diagram(image_b64)
        except Exception as e:
            raise Exception(f"Failed to get explanation from GPT-4o: {e}")

        return None, explanation_text

    # ─── ACTION: DIAGRAM ───────────────────────────────────────────────────────────
    elif action.lower() == "diagram":
        if not text:
            raise Exception("No text prompt provided for diagram generation.")

        # 1) Call GPT-4o to produce the PlantUML + Bulgarian explanation in one response
        try:
            raw_response = generate_diagram(text)
        except Exception as e:
            raise Exception(f"Failed to call GPT-4o for diagram: {e}")

        # 2) Find the last occurrence of "@enduml" (case-insensitive)
        lower_resp = raw_response.lower()
        enduml_index = lower_resp.rfind("@enduml")
        if enduml_index == -1:
            raise Exception("GPT did not return a valid @startuml ... @enduml block.")

        # 3) Split the response into UML block and explanation
        uml_block = raw_response[:enduml_index + len("@enduml")].strip()
        explanation_part = raw_response[enduml_index + len("@enduml"):].strip()

        # 4) If explanation_part starts with "Explanation:", remove that prefix
        segments = re.split('Explanation:', explanation_part)
        explanation_text = segments[-1].strip()

        # c) Write the .puml file under MEDIA_ROOT/diagrams
        diagrams_dir = Path(MEDIA_ROOT) / "diagrams"
        puml_filename = f"{filename_base}.puml"
        puml_path = MEDIA_ROOT / puml_filename
        with open(puml_path, "w", encoding="utf-8") as f:
            f.write(uml_block)

        # d) Render the PlantUML → PNG using plantuml.jar
        if not PLANTUML_JAR_PATH.exists():
            raise Exception(f"plantuml.jar not found at {PLANTUML_JAR_PATH}")

        try:
            subprocess.run(
                [
                    "java",
                    "-DPLANTUML_DEFAULT_DPI=1800",
                    "-jar",
                    str(PLANTUML_JAR_PATH),
                    "-tpng",
                    str(puml_path),
                    "-o", str(diagrams_dir)
                ],
                check=True
            )
        except subprocess.CalledProcessError as e:
            raise Exception(f"PlantUML rendering failed: {e}")

        # e) Verify the PNG file exists
        png_filename = f"{filename_base}.png"
        png_path = diagrams_dir / png_filename
        if not png_path.exists():
            raise Exception(f"Expected PNG not found at {png_path}")

        return png_filename, explanation_text

    # ─── INVALID ACTION ──────────────────────────────────────────────────────────────
    else:
        raise Exception(f"Invalid action: {action!r}. Must be 'diagram' or 'explanation'.")

def generate_open_ended_questions(script):

    SCHEMA = {"questions": ["<question1>", "<question2>"]}
    INQUIRY_PROMPT = """
        Based on the following video lecture transcript, generate two open-ended, inquiry-based learning assessment questions in Bulgarian. 
        They must stimulate analysis, synthesis, and application.
        Avoid factual recall. Encourage deep thinking, ambiguity, and reflection.

        Transcript:
        {script}

        Output must be *only* valid JSON matching this schema exactly:
        {schema}
    """

    prompt = INQUIRY_PROMPT.format(script=script, schema=SCHEMA)
    response = client.chat.completions.create(
        model="gpt-4",
        messages=[
            {"role": "system", "content": "You are an expert educator who follows Inquiry-Based Learning principles."},
            {"role": "user", "content": prompt}
        ],
        temperature=0.7
    )

    return response.choices[0].message.content

def generate_audio_lecture(raw_text):
    prompt = f"""
        Вие сте експерт в областта на образованието, добре запознат с Теорията за когнитивното натоварване (Sweller, 1994) и конструктивното подравняване (Biggs & Tang, 2011). 
        Създайте лекция-стил скрипт, обобщаващ следното съдържание на PDF. Структурирайте скрипта по начин, който:

        1. Намалява екстранейното когнитивно натоварване (т.е. премахнете ненужни детайли).
        2. Постепенно изгражда вътрешното натоварване (започнете с основни концепции, след това преминете към по-сложни).
        3. Осигурява зареждащо когнитивно натоварване, като свързва всяка секция с ясни учебни цели.

        Поддържа конструктивно подравняване, като изрично посочва как всяка част подкрепя поставените учебни резултати.
        Използвайте прост език, кратки абзаци и маркирани списъци, където е уместно. Ето текста на PDF:
        {raw_text[:3000]} # изпращайте само първите 3000 знака, за да остане в рамките на ограниченията на токените; можете да коригирате
        Създайте финален скрипт, който може да се прочете на глас като лекция с продължителност 5-10 минути на български език. 
    """
    response = client.chat.completions.create(
        model="gpt-4",
        messages=[
            {"role": "system", "content": "You are a helpful assistant specialized in educational design."},
            {"role": "user", "content": prompt}
        ],
        temperature=0.7,
        max_completion_tokens=3000,
    )

    return response.choices[0].message.content.strip()

def generate_personalized_exam(difficulty, key_concepts, num_questions, project_reasonings, wrong_quiz_questions, course_script):
    """
    Build a single-string prompt for ChatGPT that:
      - Minimizes extraneous cognitive load
      - Uses key_concepts
      - Uses low_project_reasonings & wrong_quiz_questions
      - Embeds the course.script (summary) context
      - Specifies number of MCQs and the “Effective Distractor”
        approach so ChatGPT returns exactly that JSON array.
    """

    print("Ai generating the exam...")

    schema = [{"question": "<question text, aligned to key concepts>","choices": ["Option A", "Option B", "Option C", "Option D"],"correct_index": "<0-3 integer>"},]

    PROMPT = """
        Produce exam questions that minimize extraneous load, build intrinsic load progressively and focus germane load on the stated learning objectives.
        Course script/summary (for context): 
        {CS_JSON}

        Exam difficulty: {DIFFICULTY}
        Key concepts (to cover): {KEY_CONCEPTS}
        Number of questions: {QUESTIONS}

        Student's performance data:
        1) Low-grade project reasonings (grade < 4.0): 
        {P_JSON}

        2) Wrong quiz questions (only question text):
        {WQ_JSON}

        Using “Effective Distractor Generation” (Haladyna & Downing, 1989), generate exactly {QUESTIONS} MCQs. 
        Output must be *only* valid JSON matching this schema exactly:
        {SCHEMA}
    """

    p_json = json.dumps(project_reasonings, ensure_ascii=False)
    cs_json = json.dumps(course_script, ensure_ascii=False)

    prompt = PROMPT.format(CS_JSON=cs_json, 
                           DIFFICULTY=difficulty, 
                           KEY_CONCEPTS=key_concepts, 
                           QUESTIONS=num_questions, 
                           P_JSON=p_json, 
                           WQ_JSON=wrong_quiz_questions, 
                           SCHEMA=schema
    )

    try:
        response = client.chat.completions.create(
            model="gpt-4",
            messages=[
                {"role": "system", "content": "You are an expert at generating multiple-choice exams that are pedagogically aligned with Cognitive Load Theory (Sweller, 1994) and Constructive Alignment (Biggs & Tang, 2011)."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.7,
        )
    except Exception as e:
        return

    return response.choices[0].message.content.strip()
