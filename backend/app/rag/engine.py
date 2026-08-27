from app.rag.embeddings import get_embedding
from app.rag.llm import generate_answer
from app.config import settings

import time


def rag_query(question: str, user_role: str, top_k: int, chroma_manager) -> dict:
    start_time = time.time()

    # 1. Embed question
    query_embedding = get_embedding(question, task_type="retrieval_query")

    # 2. Query vectorstore — over-fetch to allow RBAC filtering without starving results
    overfetch_k = max(top_k * 5, top_k + 5)
    raw_results = chroma_manager.query(query_embedding, top_k=overfetch_k)

    # Post-filter by role
    filtered_docs = []
    filtered_metadatas = []

    if raw_results.get('documents') and len(raw_results['documents']) > 0:
        docs = raw_results['documents'][0]
        metas = raw_results['metadatas'][0]
        dists = (raw_results.get('distances') or [[]])[0]

        for i, (doc, meta) in enumerate(zip(docs, metas)):
            roles_raw = meta.get("access_roles") or ""
            roles = roles_raw.split(",") if isinstance(roles_raw, str) else list(roles_raw)
            if user_role == "admin" or user_role in roles or "all" in roles:
                filtered_docs.append(doc)
                filtered_metadatas.append(meta)
                if len(filtered_docs) == top_k:
                    break

    # 3. Build context
    context_parts = []
    sources = []
    import re

    for i, (doc, meta) in enumerate(zip(filtered_docs, filtered_metadatas)):
        clean_name = re.sub(r'^[0-9a-fA-F]{16}_', '', meta.get('filename', 'document.pdf'))
        page_number = meta.get('page_number', 1)
        context_parts.append(f"--- Document: {clean_name}, Page {page_number} ---\n{doc}")

        dist_val = None
        try:
            dist_val = dists[i] if i < len(dists) else None
        except Exception:
            dist_val = None

        score = None
        if dist_val is None:
            score = 0.0
        else:
            try:
                # Some vector stores return distance, others return similarity — clamp.
                score = max(0.0, min(1.0, 1.0 - float(dist_val)))
            except Exception:
                score = 0.0

        sources.append({
            "filename": clean_name,
            "page": page_number,
            "chunk_text": doc,
            "relevance_score": score
        })

    context_str = "\n\n".join(context_parts)

    # 4. Generate answer
    if not context_str.strip():
        llm_result = {
            "answer": "I don't have enough information in the available documents to answer this question.",
            "prompt_tokens": 0,
            "completion_tokens": 0,
            "total_tokens": 0,
            "model": settings.MODEL_NAME
        }
    else:
        llm_result = generate_answer(question, context_str, settings.MODEL_NAME)

    # 5. Format response
    response_time_ms = int((time.time() - start_time) * 1000)

    return {
        "answer": llm_result["answer"],
        "sources": sources,
        "metrics": {
            "response_time_ms": response_time_ms,
            "model": llm_result["model"],
            "prompt_tokens": llm_result["prompt_tokens"],
            "completion_tokens": llm_result["completion_tokens"],
            "total_tokens": llm_result["total_tokens"],
            "status": "success"
        }
    }
