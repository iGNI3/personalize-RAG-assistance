import re

def chunk_text(text: str, chunk_size: int, chunk_overlap: int) -> list[str]:
    # Very simple recursive character text splitter imitation
    separators = ["\n\n", "\n", ". ", " ", ""]
    
    def split_text(txt, current_separators):
        if len(txt) <= chunk_size:
            return [txt]
            
        if not current_separators:
            return [txt[i:i+chunk_size] for i in range(0, len(txt), chunk_size - chunk_overlap)]
            
        sep = current_separators[0]
        if sep == "":
            splits = list(txt)
        else:
            splits = txt.split(sep)
            
        final_chunks = []
        current_chunk = []
        current_length = 0
        
        for s in splits:
            if current_length + len(s) + (len(sep) if current_length > 0 else 0) > chunk_size:
                if current_chunk:
                    final_chunks.append(sep.join(current_chunk))
                current_chunk = [s]
                current_length = len(s)
            else:
                if current_chunk:
                    current_length += len(sep)
                current_chunk.append(s)
                current_length += len(s)
                
        if current_chunk:
            final_chunks.append(sep.join(current_chunk))
            
        return final_chunks

    return split_text(text, separators)

def create_chunks_with_metadata(pages: list[dict], chunk_size: int, chunk_overlap: int, doc_id: str, filename: str) -> list[dict]:
    all_chunks = []
    chunk_index = 0
    for page in pages:
        text_chunks = chunk_text(page["text"], chunk_size, chunk_overlap)
        for chunk in text_chunks:
            if chunk.strip():
                all_chunks.append({
                    "text": chunk,
                    "doc_id": doc_id,
                    "filename": filename,
                    "page_number": page.get("page_number", 1),
                    "chunk_index": chunk_index
                })
                chunk_index += 1
    return all_chunks
