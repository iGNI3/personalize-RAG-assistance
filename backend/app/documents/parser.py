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
                if text:
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
        # Using paragraphs as pages for simpler mapping
        text = "\n".join([para.text for para in doc.paragraphs])
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
    if file_type == 'application/pdf':
        return extract_text_from_pdf(file_path)
    elif file_type == 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
        return extract_text_from_docx(file_path)
    else:
        raise Exception(f"Unsupported file type: {file_type}")
