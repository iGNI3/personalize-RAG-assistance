from pydantic import BaseModel
from enum import Enum
from typing import List, Optional
from datetime import datetime

class DocumentStatus(str, Enum):
    processing = "processing"
    ready = "ready"
    error = "error"

class DocumentMetadata(BaseModel):
    id: str
    filename: str
    original_filename: str
    file_type: str
    upload_date: datetime
    uploader: str
    access_roles: List[str]
    status: DocumentStatus
    num_chunks: int = 0
    num_pages: int = 0
    file_size_bytes: int = 0
    error_message: Optional[str] = None

class DocumentResponse(BaseModel):
    metadata: DocumentMetadata
    message: str

class DocumentListResponse(BaseModel):
    documents: List[DocumentMetadata]
    total: int
