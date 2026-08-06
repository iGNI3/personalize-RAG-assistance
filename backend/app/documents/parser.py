import PyPDF2
from docx import Document
import os


def extract_text_from_pdf(file_path: str) -> list[dict]:
    pages = []
    try:
        with open(file_path, 'rb') as file:
            reader = PyPDF2.PdfReader(file)
            for i, page in enumerate(reader.pages):
                text = page.extract_text()
                if text and text.strip():
                    pages.append({
                        "text": text,
                        "page_number": i + 1,
                        "source": file_path
                    })
    except Exception as e:
        raise Exception(f"Failed to parse PDF: {str(e)}")
    return pages


def extract_text_from_docx(file_path: str) -> list[dict]:
    pages = []
    try:
        doc = Document(file_path)
        text = "\n".join([para.text for para in doc.paragraphs if para.text.strip()])
        if text:
            pages.append({
                "text": text,
                "page_number": 1,
                "source": file_path
            })
    except Exception as e:
        raise Exception(f"Failed to parse DOCX: {str(e)}")
    return pages


def extract_text(file_path: str, file_type: str) -> list[dict]:
    """Parse a document by file extension first, fall back to MIME type."""
    ext = os.path.splitext(file_path)[1].lower()

    if ext == ".pdf" or "pdf" in file_type:
        return extract_text_from_pdf(file_path)
    elif ext == ".docx" or "wordprocessingml" in file_type or "msword" in file_type:
        return extract_text_from_docx(file_path)
    else:
        # Final fallback: try PDF first, then DOCX
        try:
            return extract_text_from_pdf(file_path)
        except Exception:
            return extract_text_from_docx(file_path)
