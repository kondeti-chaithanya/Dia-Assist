# import pickle
# from pypdf import PdfReader
# from fastembed import TextEmbedding


# def ingest_pdf(path: str):
#     reader = PdfReader(path)
#     chunks = []

#     for i, page in enumerate(reader.pages):
#         try:
#             text = page.extract_text()
#         except Exception as e:
#             print(f" Could not extract page {i}: {e}")
#             continue

#         if text and text.strip():
#             chunks.append(text)
#         else:
#             print(f" Skipped empty page {i}")

#     if not chunks:
#         raise ValueError(" No readable text found in PDF")

#     print(" Generating embeddings using FastEmbed...")

#     embedder = TextEmbedding(
#         model_name="sentence-transformers/all-MiniLM-L6-v2"
#     )

#     embeddings = list(embedder.embed(chunks))

#     store = {
#         "chunks": chunks,
#         "embeddings": embeddings
#     }

#     # ----------------------------
#     # Save vector index safely
#     # ----------------------------
#     os.makedirs("vector_index", exist_ok=True)

#     with open("vector_index/store.pkl", "wb") as f:
#         pickle.dump(store, f)

#     print(" PDF ingestion completed successfully!")

import os
import pickle
import logging
from pypdf import PdfReader
from fastembed import TextEmbedding

logger = logging.getLogger(__name__)


def ingest_pdf(path: str):
    if not os.path.exists(path):
        logger.warning(f"PDF not found at {path}. Skipping ingestion.")
        return

    reader = PdfReader(path)
    chunks = []

    for i, page in enumerate(reader.pages):
        try:
            text = page.extract_text()
        except Exception as e:
            logger.warning(f"Could not extract page {i}: {e}")
            continue

        if text and text.strip():
            chunks.append(text)
        else:
            logger.info(f"Skipped empty page {i}")

    #  CRITICAL FIX: NEVER crash the app
    if not chunks:
        logger.warning("No readable text found in PDF. Skipping ingestion.")
        return

    logger.info("Generating embeddings using FastEmbed...")

    embedder = TextEmbedding(
        model_name="sentence-transformers/all-MiniLM-L6-v2"
    )

    embeddings = list(embedder.embed(chunks))

    store = {
        "chunks": chunks,
        "embeddings": embeddings
    }

    # Save vector index safely
    os.makedirs("vector_index", exist_ok=True)

    with open("vector_index/store.pkl", "wb") as f:
        pickle.dump(store, f)

    logger.info("PDF ingestion completed successfully!")
