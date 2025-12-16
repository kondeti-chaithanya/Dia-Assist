from groq import Groq
from config import GROQ_API_KEY, LLM_MODEL_NAME

client = Groq(api_key=GROQ_API_KEY)

# ------------------------- SYSTEM PROMPT -------------------------

SYSTEM_PROMPT = """
You are DIA ASSIST — a friendly, safe, and personalized diabetes-focused RAG chatbot.

Rules:
1. Always answer in 4–5 short bullet points.
2. No long paragraphs unless user specifically requests.
3. Use textbook context first, then combine with LLM reasoning.
4. If the context does NOT contain the answer, give a safe diabetes-related answer in bullet points.
5. If the question is NOT about diabetes, reply exactly:
   "I am Dia Assist. Please ask diabetes-related questions."
6. Never show page numbers, citations, or textbook excerpts.
7. Tone must remain supportive, simple, and medically safe.
8. If unsure say:
   "I cannot find this in the textbook, so I will generate a safe and personalized answer."

9. For blood sugar ranges, always use:
   - Fasting diabetes: ≥126 mg/dL (7.0 mmol/L)
   - Post-meal diabetes: ≥200 mg/dL (11.1 mmol/L)
   - Prediabetes fasting: 100–125 mg/dL
   - Normal fasting: 70–99 mg/dL
10. Never invent new ranges. Use only these values.

Output format rules:
- ONLY 4–5 bullet points.
- No numbering.
- No paragraphs.
"""


# ----------------------- Helper: Clean Bullets -----------------------

def clean_bullet_points(raw_text: str) -> list:
    """Converts LLM output into clean 4–5 bullet points."""
    lines = [
        line.lstrip("-•*1234567890. ").strip()
        for line in raw_text.split("\n")
        if line.strip()
    ]

    if len(lines) > 5:
        lines = lines[:5]

    return lines


# ----------------------- Helper: Trim Context -----------------------

def trim_context(chunks, max_chars=700):
    """
    Trim large PDF chunks to avoid '413 Request Too Large' Groq errors.
    Limits each chunk to ~700 characters and sends only top 3 chunks.
    """
    trimmed = []

    for c in chunks:
        text = c["text"].strip()

        if len(text) > max_chars:
            text = text[:max_chars] + "..."

        trimmed.append(text)

    return "\n\n".join(trimmed[:3])  # send only top 3 chunks


# ----------------------- Main LLM Generation Function -----------------------

def generate_llm_answer(question: str, retrieved_chunks: list):
    """
    Generate final diabetes-safe bullet point answers using LLM + retrieved context.
    Returns: list of 4–5 bullet points.
    """

    # FIX: Prevent too large prompts
    context = trim_context(retrieved_chunks)

    # Build final user prompt
    user_prompt = (
        f"Context:\n{context}\n\n"
        f"Question: {question}\n"
        f"Provide the final answer strictly in 4–5 short bullet points."
    )

    response = client.chat.completions.create(
        model=LLM_MODEL_NAME,
        messages=[
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": user_prompt}
        ],
        temperature=0.2,
    )

    raw_output = response.choices[0].message.content

    bullets = clean_bullet_points(raw_output)

    # Fallback for safety
    if not bullets:
        bullets = [
            "I cannot find this in the textbook.",
            "I will generate a safe diabetes-related explanation.",
            "Maintain a balanced diet low in sugar and refined carbohydrates.",
            "Include whole grains, vegetables, lean protein, and healthy fats.",
            "Ask again if you want more details."
        ]

    return bullets
