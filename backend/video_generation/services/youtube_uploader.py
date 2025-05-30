import os
import pickle
from pathlib import Path
from googleapiclient.discovery import build
from googleapiclient.http import MediaFileUpload
from google_auth_oauthlib.flow import InstalledAppFlow
from google.auth.transport.requests import Request
from dotenv import load_dotenv
from core.settings import DOTENV_PATH
from .slide import Slide

load_dotenv(dotenv_path=DOTENV_PATH)

# Only YouTube upload scope
SCOPES = ["https://www.googleapis.com/auth/youtube.upload"]
CLIENT_SECRET_PATH = os.getenv("YOUTUBE_CLIENT_SECRET")
TOKEN_CACHE_PATH = os.getenv("YOUTUBE_TOKEN_CACHE")

def authenticate_youtube():
    print(f"Authenticating to youtube...")
    creds = None

    if os.path.exists(TOKEN_CACHE_PATH):
        with open(TOKEN_CACHE_PATH, "rb") as token:
            creds = pickle.load(token)

    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            creds.refresh(Request())
        else:
            flow = InstalledAppFlow.from_client_secrets_file(CLIENT_SECRET_PATH, SCOPES)
            creds = flow.run_local_server(port=8080)

        Path(TOKEN_CACHE_PATH).parent.mkdir(parents=True, exist_ok=True)
        with open(TOKEN_CACHE_PATH, "wb") as token:
            pickle.dump(creds, token)

    return build("youtube", "v3", credentials=creds)


def format_timestamps(slides: list[Slide]) -> str:
    print(f"Formating timestamps...")
    def sec_to_hms(sec):
        mins, secs = divmod(int(sec), 60)
        hours, mins = divmod(mins, 60)
        return f"{hours:02}:{mins:02}:{secs:02}"

    lines = []
    for slide in slides:
        ts = sec_to_hms(slide.timestamp)
        label = slide.topic or f"Slide {slide.num_page}"
        lines.append(f"{ts} {label}")
    return "\n".join(lines)


def upload_video(
    video_path: Path,
    title: str,
    slides: list[Slide],
    tags=None,
    category="27",
    privacy="public"
) -> str:
    print(f"Video uploading started!")
    youtube = authenticate_youtube()

    description = format_timestamps(slides)

    request_body = {
        "snippet": {
            "title": title,
            "description": description,
            "tags": tags or [],
            "categoryId": category
        },
        "status": {
            "privacyStatus": privacy
        }
    }

    print(f"Video {title} is now uploading...")
    media = MediaFileUpload(str(video_path), chunksize=-1, resumable=True)

    request = youtube.videos().insert(
        part="snippet,status",
        body=request_body,
        media_body=media
    )

    response = request.execute()
    video_id = response.get("id")
    print(f"Video uploaded: https://www.youtube.com/watch?v={video_id}")
    return video_id