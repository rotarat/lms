# debug_pdf.py

import magic                  # from python-magic-bin
from pdf2image import convert_from_path
import pytesseract
from pytesseract import Output

def pdf_file_to_images_path(pdf_path, dpi=200):
    """
    Read a PDF from disk and return a list of PIL.Image,
    one per page.
    """
    # magic just to verify it's PDF
    mime = magic.from_file(pdf_path, mime=True)
    if mime != "application/pdf":
        raise ValueError(f"Not a PDF: {pdf_path} ({mime})")
    # convert each page to image
    images = convert_from_path(pdf_path, dpi=dpi)
    return images

def classify_pdf_content(input_pdf_path: str, output_txt_path: str):
    """
    Runs OCR on each page, heuristically labels each text block
    as 'diagram' (small/short) vs 'paragraph' (large/long) and
    writes out to an .txt file.
    """
    images = pdf_file_to_images_path(input_pdf_path)

    with open(output_txt_path, "w", encoding="utf-8") as out:
        for page_num, img in enumerate(images, start=1):
            out.write(f"\n\n=== Page {page_num} ===\n")
            # run Tesseract layout OCR
            data = pytesseract.image_to_data(
                img, lang="bul", output_type=Output.DICT
            )
            n = len(data["text"])
            for i in range(n):
                txt = data["text"][i].strip()
                if not txt:
                    continue
                w = data["width"][i]
                h = data["height"][i]
                # simple heuristic:
                #   if very short or small box → diagram label
                #   else → paragraph
                word_count = len(txt.split())
                area = w * h
                if word_count <= 2 and area < 3000:
                    kind = "diagram"
                else:
                    kind = "paragraph"
                out.write(f"[{kind:9}] {txt}\n")
