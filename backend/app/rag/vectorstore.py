import chromadb
from typing import List, Dict, Any, Optional

class ChromaManager:
    def __init__(self, persist_dir: str):
        self.client = chromadb.PersistentClient(path=persist_dir)
        self.collection = self.client.get_or_create_collection(name="rag_documents")

    def add_documents(self, chunks: List[Dict[str, Any]], embeddings: List[List[float]]) -> None:
        if not chunks:
            return
            
        ids = [f"{c['doc_id']}_{c['chunk_index']}" for c in chunks]
        texts = [c['text'] for c in chunks]
        
        # Prepare metadata, converting lists to strings since Chroma expects strings/ints/floats
        metadatas = []
        for c in chunks:
            metadatas.append({
                "doc_id": c["doc_id"],
                "filename": c["filename"],
                "page_number": c["page_number"],
                "chunk_index": c["chunk_index"],
                "access_roles": c.get("access_roles", "")
            })
            
        self.collection.add(
            ids=ids,
            embeddings=embeddings,
            documents=texts,
            metadatas=metadatas
        )

    def query(self, query_embedding: List[float], top_k: int, role_filter: Optional[List[str]] = None) -> Dict[str, Any]:
        count = self.collection.count()
        if count == 0:
            return {"documents": [[]], "metadatas": [[]], "distances": [[]]}
            
        n_res = min(top_k * 2, count)
        results = self.collection.query(
            query_embeddings=[query_embedding],
            n_results=n_res
        )
        return results

    def delete_by_doc_id(self, doc_id: str) -> None:
        self.collection.delete(
            where={"doc_id": doc_id}
        )

    def get_collection_stats(self) -> Dict[str, Any]:
        return {
            "count": self.collection.count()
        }
