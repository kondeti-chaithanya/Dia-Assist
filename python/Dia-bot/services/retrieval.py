import os
import pickle
import numpy as np
from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity

model = SentenceTransformer("sentence-transformers/all-MiniLM-L6-v2")

INDEX = None  # Will be loaded lazily after ingestion


def load_index():
    global INDEX

    if INDEX is None:
        if not os.path.exists("vector_index/store.pkl"):
            raise FileNotFoundError(
                "Vector index store.pkl not found. Run ingestion first."
            )

        with open("vector_index/store.pkl", "rb") as f:
            INDEX = pickle.load(f)

    return INDEX


def hybrid_search(query: str, top_k: int = 5):
    """
    Returns top_k relevant chunks from the ingested PDF.
    """

    index = load_index()

    embeddings = index["embeddings"]
    chunks = index["chunks"]

    q_vec = model.encode([query])
    scores = cosine_similarity(q_vec, embeddings)[0]

    top_idx = np.argsort(scores)[::-1][:top_k]

    results = [chunks[i] for i in top_idx]
    return results
