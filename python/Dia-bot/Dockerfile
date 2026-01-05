# # =========================================================
# # STAGE 1 — BUILDER
# # =========================================================
# FROM python:3.12-slim AS builder

# WORKDIR /app

# # System dependencies
# RUN apt-get update && apt-get install -y --no-install-recommends \
#     git \
#     build-essential \
#     curl \
#     && rm -rf /var/lib/apt/lists/*

# # Install Python dependencies
# COPY requirements.txt .
# RUN pip install --no-cache-dir --prefix=/install -r requirements.txt


# # =========================================================
# # STAGE 2 — FINAL RUNTIME IMAGE
# # =========================================================
# FROM python:3.12-slim

# LABEL maintainer="DiaAssist Team"
# LABEL description="DiaAssist Diabetes Chatbot API"
# LABEL version="1.0.0"

# WORKDIR /app

# # ---------------------------------------------------------
# # Create non-root user
# # ---------------------------------------------------------
# RUN groupadd -r appuser && useradd -r -g appuser appuser

# # ---------------------------------------------------------
# # HARD-CODED ENV (NO SETUP REQUIRED FOR USERS)
# # ---------------------------------------------------------
# ENV PYTHONUNBUFFERED=1 \
#     GROQ_API_KEY=gsk_XXXXXXXXXXXXXXXXXXXXXXXXXXXX \
#     JWT_SECRET=mySuperSecretKeyForJwtWhichIsAtLeast32BytesLong \
#     JWT_ALGORITHM=HS256 \
#     HF_HOME=/app/.cache \
#     FASTEMBED_CACHE_PATH=/app/.cache/fastembed

# # ---------------------------------------------------------
# # Copy Python packages
# # ---------------------------------------------------------
# COPY --from=builder /install /usr/local

# # ---------------------------------------------------------
# # Copy application source
# # ---------------------------------------------------------
# COPY . .

# # ---------------------------------------------------------
# # Create required directories & permissions
# # ---------------------------------------------------------
# RUN mkdir -p \
#     /app/.cache/fastembed \
#     /app/vector_index \
#     /app/logs \
#     /app/data \
#     && chown -R appuser:appuser /app

# # ---------------------------------------------------------
# # Switch to non-root user
# # ---------------------------------------------------------
# USER appuser

# # ---------------------------------------------------------
# # Expose API port
# # ---------------------------------------------------------
# EXPOSE 8000

# # ---------------------------------------------------------
# # Start FastAPI app
# # ---------------------------------------------------------
# CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]

# =========================================================
# STAGE 1 — BUILDER
# =========================================================
# =========================================================
# STAGE 1 — BUILDER
# =========================================================
# =========================================================
# STAGE 1 — BUILDER
# =========================================================
# =========================================================
# STAGE 1 — BUILDER
# =========================================================
FROM python:3.12-slim AS builder

WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    curl \
    git \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir --prefix=/install -r requirements.txt


# =========================================================
# STAGE 2 — FINAL RUNTIME IMAGE
# =========================================================
FROM python:3.12-slim

LABEL maintainer="DiaAssist Team"
LABEL description="DiaAssist Diabetes Prediction & RAG Chatbot API"
LABEL version="1.0.0"

WORKDIR /app

# ✅ curl needed for HEALTHCHECK
RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
    && rm -rf /var/lib/apt/lists/*

RUN groupadd -r appuser && useradd -r -g appuser appuser

ENV PYTHONUNBUFFERED=1 \
    HF_HOME=/app/.cache \
    FASTEMBED_CACHE_PATH=/app/.cache/fastembed \
    HF_HUB_DISABLE_PROGRESS_BARS=1 \
    JWT_ALGORITHM=HS256

COPY --from=builder /install /usr/local
COPY . .

COPY models/xgboost_diabetes.pkl /app/models/



RUN mkdir -p \
    /app/.cache/fastembed \
    /app/vector_index \
    /app/logs \
    /app/data \
    && chown -R appuser:appuser /app

USER appuser

# Pre-download embedding model
RUN python - <<EOF
from fastembed import TextEmbedding
TextEmbedding("BAAI/bge-small-en-v1.5")
EOF

EXPOSE 8000

HEALTHCHECK --interval=30s --timeout=5s --start-period=30s \
  CMD curl -f http://localhost:8000/docs || exit 1

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
