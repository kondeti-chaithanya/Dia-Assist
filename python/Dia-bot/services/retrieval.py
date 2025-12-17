import os
import pickle
import numpy as np
from fastembed import TextEmbedding

# Load FastEmbed MiniLM model (small + accurate)
embedder = TextEmbedding(model_name="sentence-transformers/all-MiniLM-L6-v2")

INDEX = None  # Cached vector index


def load_index():
    """
    Load the stored PDF embeddings once.
    """
    global INDEX

    store_path = "vector_index/store.pkl"

    if INDEX is None:
        if not os.path.exists(store_path):
            raise FileNotFoundError(" vector_index/store.pkl not found. Run ingestion first.")

        with open(store_path, "rb") as f:
            INDEX = pickle.load(f)

    return INDEX


def hybrid_search(query: str, top_k: int = 5):
    """
    Vector search using FastEmbed + cosine similarity.
    Returns top_k most relevant PDF chunks.
    """

    index = load_index()
    embeddings = np.array(index["embeddings"])  # (N, 384)
    chunks = index["chunks"]  # original text segments

    # --- Embed query ---
    q_vec = list(embedder.embed([query]))[0]
    q_vec = np.array(q_vec)

    # --- Cosine similarity ---
    scores = np.dot(embeddings, q_vec) / (
        np.linalg.norm(embeddings, axis=1) * np.linalg.norm(q_vec)
    )

    # --- Pick top K results ---
    top_idx = np.argsort(scores)[::-1][:top_k]

    return [chunks[i] for i in top_idx]
