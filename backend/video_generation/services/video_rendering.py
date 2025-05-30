import base64
import os
from pathlib import Path
from moviepy import ImageClip, AudioFileClip, concatenate_videoclips
from .slide import Slide
from PIL import Image, ImageDraw, ImageFont
import tempfile

# Constants
DELAY_BEFORE_AUDIO = 0.5
DELAY_AFTER_AUDIO = 0.7
TITLE_DURATION = 3.5
OUTRO_DURATION = 5.0

INTRO_TEMPLATE_IMAGE_PATH = "video_generation/assets/intro_card_template.png"
OUTRO_IMAGE_PATH = "video_generation/assets/outro_card.png"

COURSE_BOX = (100, 260, 1180, 330)
TITLE_BOX = (100, 340, 1180, 410)
FONT_PATH = "video_generation/assets/video_font.ttf"
FONT_COLOR = (237, 58, 116)

temp_file_paths=[]

# --- TEXT RENDERING LOGIC ---

def fit_text(draw, text, box, font_path, initial_size):
    max_width = box[2] - box[0]
    max_height = box[3] - box[1]
    size = initial_size

    while size > 10:
        font = ImageFont.truetype(font_path, size)
        tw, th = draw.textbbox((0, 0), text, font=font)[2:]
        if tw <= max_width and th <= max_height:
            x = box[0] + (max_width - tw) / 2
            y = box[1] + (max_height - th) / 2
            return font, (x, y)
        size -= 1

    font = ImageFont.truetype(font_path, size)
    return font, (box[0], box[1])

def draw_intro_text(image_path, font_path, course_text, video_title):
    """
    Draws the course title and video title onto the intro template and saves it.
    """
    img = Image.open(image_path).convert("RGBA")
    draw = ImageDraw.Draw(img)

    course_font, (cx, cy) = fit_text(draw, course_text, COURSE_BOX, font_path, 64)
    title_font, (tx, ty) = fit_text(draw, video_title, TITLE_BOX, font_path, 48)

    draw.text((cx, cy), course_text, font=course_font, fill=FONT_COLOR)
    draw.text((tx, ty), video_title, font=title_font, fill=FONT_COLOR)

    with tempfile.NamedTemporaryFile(suffix=".png", delete=False) as tmp_intro_img:
        img.convert("RGB").save(tmp_intro_img.name)
        temp_file_paths.append(tmp_intro_img.name)
        intro_image_path = Path(tmp_intro_img.name)

    return intro_image_path

# --- MOVIEPY CLIP CREATION ---

def create_title_clip(course_name: str, video_title: str, duration=TITLE_DURATION) -> ImageClip:
    intro_image_path = draw_intro_text(
        image_path=INTRO_TEMPLATE_IMAGE_PATH,
        font_path=FONT_PATH,
        course_text=course_name,
        video_title=video_title
    )
    return ImageClip(intro_image_path).with_duration(duration)

def slide_to_clip(slide: Slide) -> tuple[ImageClip, str]:
    if not slide.audio_path or not Path(slide.audio_path).exists():
        raise ValueError(f"Slide {slide.num_page} missing audio")

    audio = AudioFileClip(slide.audio_path)
    total_duration = DELAY_BEFORE_AUDIO + audio.duration + DELAY_AFTER_AUDIO

    return ImageClip(img=slide.image_path, duration=total_duration).with_audio(audio.with_start(DELAY_BEFORE_AUDIO))

def render_full_video(course_name: str, video_title: str, slides: list[Slide], output_path: str):
    print(f"Rendering video with {len(slides)} slides...")
    current_time = 0.0
    clips = []

    title_clip = create_title_clip(course_name, video_title)
    current_time = TITLE_DURATION
    clips.append(title_clip)

    for slide in slides:
        try:
            clip = slide_to_clip(slide)

            if slide.num_page is 1:
                slide.timestamp = current_time
            else:
                slide.timestamp = current_time

            current_time += clip.duration

            clips.append(clip)
        except Exception as e:
            print(f"Missed slide {slide.num_page}: {e}")

    if not clips:
        raise RuntimeError("No valid slides for rendering.")

    outro_clip = ImageClip(OUTRO_IMAGE_PATH).with_duration(OUTRO_DURATION)
    current_time += OUTRO_DURATION
    clips.append(outro_clip)

    final_video = concatenate_videoclips(clips, method='compose')
    final_video.duration = current_time
    final_video.write_videofile(output_path, fps=24)

    for tmp_f_path in temp_file_paths:
        try:
            os.remove(tmp_f_path)
        except OSError:
            pass
