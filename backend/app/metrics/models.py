from pydantic import BaseModel
from datetime import datetime
from typing import Dict, List, Optional, Any

class QueryMetric(BaseModel):
    query: str
    answer: str
    model_name: str
    response_time_ms: int
    prompt_tokens: int
    completion_tokens: int
    total_tokens: int
    status: str
    sources_count: int
    timestamp: datetime
    user: str

class MetricsSummary(BaseModel):
    total_queries: int
    avg_response_time: float
    total_tokens_used: int
    success_rate: float
    queries_by_model: Dict[str, int]
    recent_queries: List[QueryMetric]
    timeseries: Optional[List[Dict[str, Any]]] = None
