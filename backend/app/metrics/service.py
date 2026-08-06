from app.metrics.models import QueryMetric, MetricsSummary
from typing import List
from datetime import datetime, timedelta
from app.db import get_db_connection

def add_metric(metric: QueryMetric) -> None:
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute(
        """INSERT INTO query_metrics 
        (query, answer, model_name, response_time_ms, prompt_tokens, completion_tokens, total_tokens, status, sources_count, timestamp, user_username)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)""",
        (metric.query, metric.answer, metric.model_name, float(metric.response_time_ms), metric.prompt_tokens, metric.completion_tokens, metric.total_tokens, metric.status, metric.sources_count, metric.timestamp.isoformat(), metric.user)
    )
    conn.commit()
    conn.close()

def get_all_metrics() -> List[QueryMetric]:
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM query_metrics ORDER BY timestamp DESC")
    rows = cursor.fetchall()
    conn.close()
    metrics = []
    for r in rows:
        metrics.append(QueryMetric(
            query=r["query"],
            answer=r["answer"],
            model_name=r["model_name"],
            response_time_ms=int(r["response_time_ms"]),
            prompt_tokens=r["prompt_tokens"],
            completion_tokens=r["completion_tokens"],
            total_tokens=r["total_tokens"],
            status=r["status"],
            sources_count=r["sources_count"],
            timestamp=datetime.fromisoformat(r["timestamp"]) if isinstance(r["timestamp"], str) else r["timestamp"],
            user=r["user_username"] or "unknown"
        ))
    return metrics

def get_summary() -> MetricsSummary:
    all_metrics = get_all_metrics()
    now = datetime.now()
    timeseries = []
    for i in range(6, -1, -1):
        day = (now - timedelta(days=i)).date()
        day_str = day.strftime("%a (%b %d)")
        day_metrics = [m for m in all_metrics if m.timestamp.date() == day]
        count = len(day_metrics)
        avg_time = sum(m.response_time_ms for m in day_metrics) / count if count > 0 else 0
        timeseries.append({"name": day_str, "responseTime": round(avg_time), "queries": count})

    total = len(all_metrics)
    if total == 0:
        return MetricsSummary(
            total_queries=0,
            avg_response_time=0.0,
            total_tokens_used=0,
            success_rate=0.0,
            queries_by_model={},
            recent_queries=[],
            timeseries=timeseries
        )
        
    total_time = sum(m.response_time_ms for m in all_metrics)
    total_tokens = sum(m.total_tokens for m in all_metrics)
    successful = sum(1 for m in all_metrics if m.status == "success")
    
    models = {}
    for m in all_metrics:
        models[m.model_name] = models.get(m.model_name, 0) + 1
        
    recent = all_metrics[:10]
    
    return MetricsSummary(
        total_queries=total,
        avg_response_time=total_time / total,
        total_tokens_used=total_tokens,
        success_rate=(successful / total) * 100,
        queries_by_model=models,
        recent_queries=recent,
        timeseries=timeseries
    )
