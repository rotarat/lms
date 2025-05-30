import json
from openai import OpenAI
import os
from dotenv import load_dotenv
from core.settings import DOTENV_PATH

load_dotenv(dotenv_path=DOTENV_PATH)
client = OpenAI(
        base_url="https://openrouter.ai/api/v1",
        api_key=os.getenv("OPENAI_API_KEY_1"),
    )

def fetch_quiz_questions(text, difficulty, questions):
    SCHEMA = {"questions": [{"question": "<string>","incorrect_answers": ["<string>", "<string>", "<string>"],"correct_answer": "<string>","explanation": "<string>"}]}
    PROMPT_TEMPLATE = """
        Text: {text}

        You are an expert at generating multiple-choice quizzes from the above text.
        Generate exactly {questions} different questions at difficulty level "{difficulty}".
        Do not include any Markdown, backticks, human-readable commentary or new line characters.
        Output must be *only* valid JSON matching this schema exactly:

        {schema}

        Begin now:
        """

    prompt = PROMPT_TEMPLATE.format(
        text=text,
        difficulty=difficulty,
        questions=questions,
        schema=json.dumps(SCHEMA, indent=2, ensure_ascii=False),
    )


    response = client.chat.completions.create(
        model="deepseek/deepseek-chat-v3-0324:free",
        messages=[
            {
                "role": "user",
                "content": prompt,
            },
        ],
        max_completion_tokens=10000,
        n = 1,
        temperature=0.3,
        frequency_penalty=0,
        presence_penalty=0,
    )

    print(response)
    content = response.choices[0].message.content.strip()

    data = json.loads(content)
    return data.get("questions", [])

def ask_openai(message):
    PROMPT_MESSAGE ="""
You are an expert teaching assistant in a modern learning management system. 
Your goal is to give students clear, step-by-step explanations, examples, and practical tips on any topic they ask about. 
Keep your answers friendly, detailed, and focused on helping students understand and apply concepts. 
Create a well-structured answer that can be wrapped in an HTML `div`. Please do not add any additional characters including new line ones.

Now provide a full answer to the question:
Question:
{message}
"""

    formatted_message = PROMPT_MESSAGE.format(message=message)

    response = client.chat.completions.create(
        model="deepseek/deepseek-chat-v3-0324:free",
        messages=[
            {
                "role": "user",
                "content": formatted_message,
            },
        ],
        max_completion_tokens=10000,
        n = 1,
        temperature=0.7,
    )

    answer = str(response.choices[0].message.content)

    return answer
