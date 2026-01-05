def split_text(pages, chunk_size=400, overlap=50):
    chunks = []

    for p in pages:
        words = p["text"].split()
        i = 0

        while i < len(words):
            chunk_words = words[i:i + chunk_size]
            chunk_text = " ".join(chunk_words)

            chunks.append({
                "text": chunk_text,
                "meta": {"page": p["page"]}
            })

            i += chunk_size - overlap

    return chunks
