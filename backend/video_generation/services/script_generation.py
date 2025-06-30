import os
import fitz
import base64
import asyncio
import json
import re
from pathlib import Path
from openai import OpenAI
from dotenv import load_dotenv
from core.settings import DOTENV_PATH
from .slide import Slide

load_dotenv(dotenv_path=DOTENV_PATH)

client = OpenAI(
    base_url="https://openrouter.ai/api/v1",
    api_key=os.getenv("OPENAI_API_KEY_1"),
)

CONCURRENCY_LIMIT = 6

PICTURES_DIR = Path("video_generation/services/test_slides/pictures")

def save_slide_image(pdf_path, page_number, output_dir=PICTURES_DIR):
    doc = fitz.open(str(pdf_path))
    page = doc.load_page(page_number)
    pix = page.get_pixmap(dpi=200)

    output_path = f"{output_dir}/slide_{page_number+1}.png"
    pix.save(output_path)
    return output_path

def convert_slide_to_base64(pdf_path, page_number):
    doc = fitz.open(pdf_path)
    page = doc.load_page(page_number)
    pix = page.get_pixmap(dpi=200)
    return base64.b64encode(pix.tobytes("png")).decode("utf-8")


def create_prompt(page_num):
    return f"""
        Слайд {page_num + 1} от лекцията.

        Върни единствено JSON обект във формат:
        {{"topic": "кратко заглавие на слайда","script": "обяснение на български"}}

        Не добавяй никакви други символи.
        Не преписвай текста и не се повтаряй. 

        Разбери основната концепция, ключовите думи, които я подкрепят, и смисъла на визуалното съдържание.
        Създай ясно и образователно обяснение за студенти, което звучи структурирано и натурално за образователен клип.
        Включи естествен преразказ на всички части от диаграмата (ако присъства). 
    """


def call_gpt(prompt, base64_image, course_title):
    try:
        response = client.chat.completions.create(
            model="gpt-4o",
            messages=[
                {
                    "role": "system",
                    "content": f"Ти си експерт по {course_title} и пишеш педагогическо прецизни скриптове за образователни видеа на български език."
                },
                {
                    "role": "user",
                    "content": [
                        {"type": "text", "text": prompt},
                        {"type": "image_url", "image_url": {
                            "url": f"data:image/png;base64,{base64_image}"
                        }}
                    ]
                }
            ],
            max_tokens=2000,
            temperature=0.7
        )
        return response.choices[0].message.content
    except Exception as e:
        print(f"GPT error: {e}")
        return None


async def analyze_slide_async(pdf_path, page_number, sem, course_title):
    async with sem:
        print(f"Processing slide {page_number + 1}..")
        # 1) render & save the slide to a PNG so we have a real file path
        output_image_path = await asyncio.to_thread(save_slide_image, pdf_path, page_number)
        base64_img        = await asyncio.to_thread(convert_slide_to_base64, pdf_path, page_number)
        prompt = create_prompt(page_number)
        raw_output = await asyncio.to_thread(call_gpt, prompt, base64_img, course_title)

        if not raw_output:
            return Slide(
              num_page=page_number + 1,
              image_path=Path(output_image_path),
              script="Error while generating",
              topic=""
            )

        # Save for review
        with open(f"video_generation/services/test_slides/gpt_slide_{page_number + 1}.txt", "w", encoding="utf-8") as f:
            f.write(raw_output)

        cleaned = raw_output.strip()
        if cleaned.startswith("```") and cleaned.endswith("```"):
            inner = cleaned[3:-3].strip()
            if inner.lower().startswith("json"):
                inner = inner[4:].strip()
            cleaned = inner
        m = re.search(r'\{.*\}', cleaned, flags=re.DOTALL)
        json_str = m.group(0) if m else cleaned
        try:
            parsed = json.loads(json_str)
            topic  = parsed.get("topic", "").strip()
            script = parsed.get("script", "").strip()
        except Exception as e:
            print(f"JSON parsing error on slide {page_number + 1}: {e}")
            topic  = ""
            script = cleaned

        # finally, return a Slide with a real image_path
        return Slide(
            num_page=page_number + 1,
            image_path=Path(output_image_path),
            script=script,
            topic=topic
        )


async def generate_slide_scripts_async(pdf_path: Path, course_title: str) -> list[Slide]:
    doc = fitz.open(str(pdf_path))
    sem = asyncio.Semaphore(CONCURRENCY_LIMIT)

    tasks = [
        analyze_slide_async(pdf_path, i, sem, course_title)
        for i in range(len(doc))
    ]

    return await asyncio.gather(*tasks)


def generate_slide_scripts(pdf_path: Path, course_title: str):
    return asyncio.run(generate_slide_scripts_async(pdf_path, course_title))
