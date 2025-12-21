# -----------------------------
# STAGE 1 — BUILDER
# -----------------------------
FROM python:3.12-slim AS builder

WORKDIR /app

# Install system dependencies required for building Python packages
RUN apt-get update && apt-get install -y --no-install-recommends \
    git \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements and install into a custom directory
COPY requirements.txt .
RUN pip install --no-cache-dir --prefix=/install -r requirements.txt


# -----------------------------
# STAGE 2 — FINAL RUNTIME IMAGE
# -----------------------------
FROM python:3.12-slim

WORKDIR /app

# Copy only installed Python packages from builder
COPY --from=builder /install /usr/local

# Copy application source code
COPY . .

# Ensure vector index directory exists
RUN mkdir -p vector_index

# Expose FastAPI port
EXPOSE 8000

# Run FastAPI app
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
