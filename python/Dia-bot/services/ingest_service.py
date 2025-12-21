import pickle
from pypdf import PdfReader
from fastembed import TextEmbedding


def ingest_pdf(path):
    reader = PdfReader(path)
    pages = []

    for i, page in enumerate(reader.pages):
        try:
            text = page.extract_text()
        except Exception as e:
            print(f" Warning: Could not extract text from page {i}: {e}")
            text = None

        if text and text.strip():
            pages.append({"text": text, "meta": {"page": i}})
        else:
            print(f" Skipped empty or unreadable page {i}")

    if not pages:
        raise ValueError(" No readable pages found in PDF!")

    print(" Generating embeddings using FastEmbed...")

    model = TextEmbedding()
    texts = [p["text"] for p in pages]

    # FastEmbed returns a generator → convert to list
    embeddings = list(model.embed(texts))

    store = {
        "chunks": pages,
        "embeddings": embeddings
    }

    with open("vector_index/store.pkl", "wb") as f:
        pickle.dump(store, f)

    print(" PDF ingestion completed successfully!")
