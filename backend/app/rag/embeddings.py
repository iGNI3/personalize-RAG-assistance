import google.generativeai as genai
from app.config import settings

def init_embedding_model(api_key: str):
    if api_key:
        genai.configure(api_key=api_key)

def get_embedding(text: str, task_type: str = "retrieval_document") -> list[float]:
    result = genai.embed_content(
        model=settings.EMBEDDING_MODEL,
        content=text,
        task_type=task_type
    )
    return result['embedding']

def get_embeddings_batch(texts: list[str], task_type: str = "retrieval_document") -> list[list[float]]:
    if not texts:
        return []
    embeddings = []
    batch_size = 100
    for i in range(0, len(texts), batch_size):
        batch = texts[i:i+batch_size]
        result = genai.embed_content(
            model=settings.EMBEDDING_MODEL,
            content=batch,
            task_type=task_type
        )
        embeddings.extend(result['embedding'])
    return embeddings
