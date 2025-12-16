import pickle
from sentence_transformers import SentenceTransformer
from pypdf import PdfReader

def ingest_pdf(path):
    reader = PdfReader(path)
    pages = []

    for i, page in enumerate(reader.pages):
        text = page.extract_text()
        if text:
            pages.append({"text": text, "meta": {"page": i}})

    model = SentenceTransformer("sentence-transformers/all-MiniLM-L6-v2")
    embeddings = model.encode([p["text"] for p in pages])

    store = {"chunks": pages, "embeddings": embeddings}

    with open("vector_index/store.pkl", "wb") as f:
        pickle.dump(store, f)
