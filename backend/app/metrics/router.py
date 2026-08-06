from fastapi import APIRouter, Depends
from typing import List
from app.metrics.models import QueryMetric, MetricsSummary
from app.metrics.service import get_all_metrics, get_summary
from app.auth.dependencies import get_current_user

router = APIRouter()

@router.get("", response_model=List[QueryMetric])
async def list_metrics(current_user = Depends(get_current_user)):
    return get_all_metrics()

@router.get("/summary", response_model=MetricsSummary)
async def get_metrics_summary(current_user = Depends(get_current_user)):
    return get_summary()
