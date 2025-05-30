from pathlib import Path

class Slide:
    def __init__(
        self,
        num_page: int,
        image_path: Path,
        script: str,
        topic: str,
    ):
        self.num_page = num_page
        self.image_path = image_path
        self.script = script
        self.topic = topic
        self.audio_path = ""
        self.timestamp = 0.0
