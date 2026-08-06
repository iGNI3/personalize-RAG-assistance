import time
from app.rag.embeddings import get_embedding
from app.rag.llm import generate_answer
from app.config import settings

def rag_query(question: str, user_role: str, top_k: int, chroma_manager) -> dict:
    start_time = time.time()
    
    # 1. Embed question
    query_embedding = get_embedding(question, task_type="retrieval_query")
    
    # 2. Query vectorstore
    raw_results = chroma_manager.query(query_embedding, top_k=top_k)
    
    # Post-filter by role
    filtered_docs = []
    filtered_metadatas = []
    
    if raw_results['documents'] and len(raw_results['documents']) > 0:
        docs = raw_results['documents'][0]
        metas = raw_results['metadatas'][0]
        
        for doc, meta in zip(docs, metas):
            roles = meta.get("access_roles", "").split(",")
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
        context_parts.append(f"--- Document: {clean_name}, Page {meta['page_number']} ---\n{doc}")
        sources.append({
            "filename": clean_name,
            "page": meta['page_number'],
            "chunk_text": doc,
            "relevance_score": 0.0 # Could use distances if available
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
