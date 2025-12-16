import faiss
import numpy as np
import os
import pickle

INDEX_PATH = "vector_index/faiss.index"
STORE_PATH = "vector_index/store.pkl"

class VectorStore:
    def __init__(self, dim=384):
        self.dim = dim

        if os.path.exists(INDEX_PATH):
            self.index = faiss.read_index(INDEX_PATH)
            with open(STORE_PATH, "rb") as f:
                data = pickle.load(f)
                self.texts = data["texts"]
                self.metadatas = data["metadatas"]
        else:
            self.index = faiss.IndexFlatL2(dim)
            self.texts = []
            self.metadatas = []

    def add(self, embeddings, texts, metadatas):
        embeddings = np.array(embeddings).astype("float32")
        self.index.add(embeddings)
        self.texts.extend(texts)
        self.metadatas.extend(metadatas)
        self._save()

    def search(self, query_embedding, k=5):
        query = np.array([query_embedding]).astype("float32")
        distances, indices = self.index.search(query, k)

        results = []
        for idx in indices[0]:
            results.append({
                "text": self.texts[idx],
                "meta": self.metadatas[idx]
            })

        return results

    def _save(self):
        faiss.write_index(self.index, INDEX_PATH)
        with open(STORE_PATH, "wb") as f:
            pickle.dump({
                "texts": self.texts,
                "metadatas": self.metadatas
            }, f)

vector_db = VectorStore()
