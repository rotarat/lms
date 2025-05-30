import os
from pathlib import Path
from dotenv import load_dotenv
from elevenlabs.client import ElevenLabs
from elevenlabs import VoiceSettings
from .slide import Slide
from core.settings import DOTENV_PATH
import asyncio

load_dotenv(dotenv_path=DOTENV_PATH)

client = ElevenLabs(api_key=os.getenv("ELEVENLABS_API_KEY"))

VOICE_NAME = "Milena"
MODEL = "eleven_flash_v2_5"
VOICE_SETTINGS = VoiceSettings(
    stability=0.6,
    similarity_boost=0.85,
    style=0.1,
    use_speaker_boost=True
)

# Directory where audio files will be saved for debugging
OUTPUT_DIR = "video_generation/services/test_slides/audio"


def synthesize_slide_audio(slide: Slide, output_dir: Path = OUTPUT_DIR) -> None:
    """
    Generate speech for a given Slide object and update its audio path.

    Args:
        slide (Slide): A Slide object containing .script
        output_dir (Path): Directory where audio files are saved

    Result:
        slide.audio_path will be set to the saved .mp3 file path
    """
    if not slide.script:
        raise ValueError(f"Slide {slide.num_page} has no script to synthesize.")

    # Build the Path object for the .mp3 file
    audio_path = Path(f"{output_dir}/slide_{slide.num_page}.mp3")
    print(f"Generating audio for slide {slide.num_page}...")

    try:
        # Stream generate returns an iterator of byte chunks
        ssml_script = f"<speak><prosody rate='93%'>{slide.script}</prosody></speak>"
        audio_chunks = client.generate(
            text=ssml_script,
            model=MODEL,
            voice=VOICE_NAME,
            voice_settings=VOICE_SETTINGS
        )
        # Combine chunks into full bytes
        audio_bytes = b"".join(audio_chunks)

        # Save for debug
        audio_path.write_bytes(audio_bytes)
        slide.audio_path = str(audio_path)
        print(f"Audio saved: {audio_path}")

    except Exception as e:
        print(f"Error while generating audio for slide {slide.num_page}: {e}")
        slide.audio_path = None


async def synthesize_speech_async(slides: list[Slide]) -> None:
    """
    Generate speech audio for all slides concurrently by offloading each to a thread.
    """
    tasks = [
        asyncio.to_thread(synthesize_slide_audio, slide)
        for slide in slides
    ]
    await asyncio.gather(*tasks)


def synthesize_speech(slides: list[Slide]) -> None:
    """
    Synchronous wrapper around synthesize_speech_async, for use in sync contexts.

    Args:
        slides (list[Slide]): List of Slide objects to process.
    """
    return asyncio.run(synthesize_speech_async(slides))

