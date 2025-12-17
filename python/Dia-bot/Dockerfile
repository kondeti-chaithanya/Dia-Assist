# -----------------------------
# STAGE 1 — BUILDER
# -----------------------------
FROM python:3.12-slim AS builder

WORKDIR /app

# Install minimal system deps required for fastembed + numpy
RUN apt-get update && apt-get install -y --no-install-recommends \
    git build-essential \
    && rm -rf /var/lib/apt/lists/*

# Install dependencies into /install
COPY requirements.txt .
RUN pip install --no-cache-dir --prefix=/install -r requirements.txt


# -----------------------------
# STAGE 2 — FINAL RUNTIME IMAGE
# -----------------------------
FROM python:3.12-slim

WORKDIR /app

# Copy installed packages from builder
COPY --from=builder /install /usr/local

# Copy backend source code + data folder + vector index folder
COPY . .

# Ensure vector_index folder exists (if empty)
RUN mkdir -p vector_index

# Expose API port
EXPOSE 8000

# Start FastAPI
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
