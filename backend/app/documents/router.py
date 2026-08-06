from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File, Form, BackgroundTasks, Request
from app.documents.models import DocumentResponse, DocumentListResponse, DocumentMetadata
from app.documents.service import save_uploaded_file, process_document, list_documents, get_document, delete_document
from app.auth.dependencies import get_current_user, require_role
from app.auth.models import User
import aiofiles
import os
from app.config import settings

router = APIRouter()

@router.post("/upload", response_model=DocumentResponse)
async def upload_document(
    request: Request,
    background_tasks: BackgroundTasks,
    file: UploadFile = File(...),
    access_roles: str = Form("all"),
    current_user: User = Depends(get_current_user)
):
    ext = os.path.splitext(file.filename or "")[1].lower()
    allowed_types = [
        "application/pdf", 
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "application/octet-stream",
        "application/x-pdf",
        "application/msword"
    ]
    if ext not in [".pdf", ".docx"] and file.content_type not in allowed_types:
        raise HTTPException(status_code=400, detail="Only PDF and DOCX files are supported")
        
    # Save file to disk
    original_fname = file.filename
    temp_doc_id = os.urandom(8).hex()
    temp_filename = f"{temp_doc_id}_{original_fname}"
    file_path = os.path.join(settings.UPLOAD_DIR, temp_filename)
    
    async with aiofiles.open(file_path, 'wb') as out_file:
        content = await file.read()
        await out_file.write(content)
        
    roles = [role.strip() for role in access_roles.split(",")]
    
    metadata = save_uploaded_file(temp_filename, original_fname, file.content_type, current_user.username, roles)
    
    # Process in background
    background_tasks.add_task(process_document, metadata.id, request.app.state)
    
    return DocumentResponse(metadata=metadata, message="Document uploaded and processing started")

@router.get("", response_model=DocumentListResponse)
async def get_documents(current_user: User = Depends(get_current_user)):
    docs = list_documents(current_user.role)
    return DocumentListResponse(documents=docs, total=len(docs))

@router.get("/{doc_id}", response_model=DocumentMetadata)
async def get_single_document(doc_id: str, current_user: User = Depends(get_current_user)):
    doc = get_document(doc_id)
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")
        
    if current_user.role != "admin" and current_user.role not in doc.access_roles and "all" not in doc.access_roles:
        raise HTTPException(status_code=403, detail="Not authorized to access this document")
        
    return doc

@router.delete("/{doc_id}", status_code=status.HTTP_204_NO_CONTENT)
async def remove_document(request: Request, doc_id: str, current_user: User = Depends(require_role("admin"))):
    success = delete_document(doc_id, request.app.state)
    if not success:
        raise HTTPException(status_code=404, detail="Document not found")
