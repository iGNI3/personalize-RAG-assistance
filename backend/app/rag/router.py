from fastapi import APIRouter, Depends, Request
from pydantic import BaseModel
from typing import List, Dict, Any
from app.rag.engine import rag_query
from app.auth.dependencies import get_current_user
from app.auth.models import User, UserRole
from app.config import settings
from app.metrics.service import add_metric
from app.metrics.models import QueryMetric
from datetime import datetime

router = APIRouter()

class QueryRequest(BaseModel):
    question: str

class QueryResponse(BaseModel):
    answer: str
    sources: List[Dict[str, Any]]
    metrics: Dict[str, Any]

@router.post("", response_model=QueryResponse)
async def query_endpoint(
    request: Request,
    payload: QueryRequest,
    current_user: User = Depends(get_current_user)
):
    chroma_manager = request.app.state.chroma_manager
    role_val = current_user.role.value if hasattr(current_user.role, "value") else current_user.role
    
    result = rag_query(
        question=payload.question,
        user_role=role_val,
        top_k=settings.TOP_K,
        chroma_manager=chroma_manager
    )
    
    # Record metric only for non-guest users
    is_guest = getattr(current_user, "is_guest", False) or role_val == "guest"
    metrics_data = result["metrics"]
    
    if not is_guest:
        metric = QueryMetric(
            query=payload.question,
            answer=result["answer"],
            model_name=metrics_data["model"],
            response_time_ms=metrics_data["response_time_ms"],
            prompt_tokens=metrics_data["prompt_tokens"],
            completion_tokens=metrics_data["completion_tokens"],
            total_tokens=metrics_data["total_tokens"],
            status=metrics_data["status"],
            sources_count=len(result["sources"]),
            timestamp=datetime.utcnow(),
            user=current_user.username
        )
        add_metric(metric)
    
    return QueryResponse(
        answer=result["answer"],
        sources=result["sources"],
        metrics=metrics_data
    )
