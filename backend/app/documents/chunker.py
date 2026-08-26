import re


def _merge_splits(splits: list[str], sep: str, chunk_size: int, chunk_overlap: int) -> list[str]:
    """Greedily pack splits into chunks, carrying `chunk_overlap` chars into the next chunk."""
    chunks, current, total = [], [], 0
    sep_len = len(sep)

    for s in splits:
        addition = len(s) + (sep_len if current else 0)
        if total + addition > chunk_size and current:
            chunks.append(sep.join(current))
            # Carry a tail of the previous chunk forward as overlap.
            while current and total > chunk_overlap:
                removed = current.pop(0)
                total -= len(removed) + (sep_len if current else 0)
            total = sum(len(c) for c in current) + sep_len * max(len(current) - 1, 0)
            addition = len(s) + (sep_len if current else 0)
        current.append(s)
        total += addition

    if current:
        chunks.append(sep.join(current))
    return chunks


def chunk_text(text: str, chunk_size: int, chunk_overlap: int) -> list[str]:
    """Recursive character splitter: try coarse separators first, recurse into
    any piece that is still too large using the next-finer separator."""
    if chunk_overlap >= chunk_size:
        chunk_overlap = chunk_size // 5  # guard against a zero/negative step

    separators = ["\n\n", "\n", ". ", " ", ""]

    def _split(txt: str, seps: list[str]) -> list[str]:
        txt = txt.strip()
        if not txt:
            return []
        if len(txt) <= chunk_size:
            return [txt]

        if not seps:
            # Hard cut with overlap — the true last resort.
            step = max(chunk_size - chunk_overlap, 1)
            return [txt[i:i + chunk_size] for i in range(0, len(txt), step)]

        sep, rest = seps[0], seps[1:]
        pieces = list(txt) if sep == "" else txt.split(sep)

        merged = _merge_splits(pieces, sep, chunk_size, chunk_overlap)

        out = []
        for m in merged:
            if len(m) <= chunk_size:
                if m.strip():
                    out.append(m.strip())
            else:
                # THE FIX: recurse with the next-finer separator.
                out.extend(_split(m, rest))
        return out

    return _split(text, separators)


def create_chunks_with_metadata(pages, chunk_size, chunk_overlap, doc_id, filename):
    """Chunk across the whole document so sentences aren't severed at page breaks,
    while still recording which page each chunk started on."""
    # Build one continuous string, remembering where each page begins.
    offsets, buf = [], []
    cursor = 0
    for page in pages:
        raw = (page.get("text") or "")
        cleaned = re.sub(r"[ \t]+", " ", raw)
        cleaned = re.sub(r"\n{3,}", "\n\n", cleaned).strip()
        if not cleaned:
            continue
        offsets.append((cursor, page.get("page_number", 1)))
        buf.append(cleaned)
        cursor += len(cleaned) + 2  # the "\n\n" join
    full = "\n\n".join(buf)

    if not full.strip():
        return []

    def page_for(pos: int) -> int:
        pg = offsets[0][1] if offsets else 1
        for start, number in offsets:
            if start <= pos:
                pg = number
            else:
                break
        return pg

    all_chunks = []
    search_from = 0
    for idx, chunk in enumerate(chunk_text(full, chunk_size, chunk_overlap)):
        if not chunk.strip():
            continue
        pos = full.find(chunk[:60], search_from)
        if pos == -1:
            pos = search_from
        search_from = max(pos, search_from)
        all_chunks.append({
            "text": chunk,
            "doc_id": doc_id,
            "filename": filename,
            "page_number": page_for(pos),
            "chunk_index": idx,
        })
    return all_chunks
