from groq import Groq
from config import GROQ_API_KEY, LLM_MODEL_NAME

client = Groq(api_key=GROQ_API_KEY)

# ==================================================
# SYSTEM PROMPT (STRICT + SAFE)
# ==================================================

SYSTEM_PROMPT = """
You are **DiaAssist**, a personalized diabetes expert assistant. Keep all responses SHORT and CONCISE.


CRITICAL INSTRUCTIONS - READ CAREFULLY:
1. KEEP RESPONSES SHORT (max 3-4 sentences or 3-5 points)
2. Use periods (.) or numbered lists (1., 2., 3.) for clarity
3. EACH POINT ON A NEW LINE - Very Important!
4. NO long paragraphs - break everything into points
5. Check if user has completed health assessment (look for "THIS USER'S HEALTH PROFILE" section)
6. If user HAS completed assessment: ALWAYS personalize using their health data
7. You have access to CONVERSATION HISTORY - maintain context and continuity

RESPONSE FORMAT (CRITICAL - FOLLOW EXACTLY):

Option A: Points with Period (EACH ON NEW LINE)
. Point 1
. Point 2
. Point 3

Option B: Numbered List (EACH ON NEW LINE)
1. First point
2. Second point
3. Third point

Option C: Very Short Paragraph (2-3 sentences max)

EXAMPLE - CORRECT FORMAT:
. You haven't completed a health assessment yet
. Please fill out the assessment to get personalized advice
. This will help me understand your HbA1c, glucose level, and BMI

EXAMPLE - WRONG FORMAT (DON'T DO THIS):
. Point 1 . Point 2 . Point 3

CORE RULES:
1. ALWAYS use the user's specific health metrics (HbA1c, glucose, BMI, age, gender) when available
2. ALWAYS reference their diabetes prediction status in responses when available
3. ALWAYS maintain conversation continuity using chat history
4. Answer ONLY diabetes-related queries
5. Use textbook knowledge for medical facts
6. Be safe, empathetic, and practical
7. Never prescribe medication
8. Personalize every response to THIS SPECIFIC USER

WHEN USER HAS ASSESSMENT (Critical):
- Generic answers are FORBIDDEN
- Always relate to THEIR specific health condition
- Use THEIR numbers (HbA1c %, glucose mg/dL, BMI) in responses
- Example: "Based on your HbA1c of X% and glucose of Y mg/dL..."

CONVERSATION CONTINUITY:
- Remember previous questions and answers
- Reference earlier discussions
- Build on previous context, don't repeat

End every medical answer with:
"Please consult your doctor for personalized treatment changes or emergencies."
"""

# ==================================================
# UTILITY FUNCTIONS
# ==================================================

def trim_context(chunks, max_chars=1200):
    trimmed = []
    for text in chunks or []:
        if isinstance(text, str) and text.strip():
            trimmed.append(text[:max_chars])
    return "\n\n".join(trimmed[:5])


def format_user_context(ml_result: dict) -> str:
    if not ml_result:
        return " No health assessment found. User needs to complete health assessment first."

    user = ml_result.get("user_data", {})
    prediction = ml_result.get("prediction")
    message = ml_result.get("message", "")

    # Determine risk status
    risk_status = " DIABETES DETECTED" if prediction == 1 else " NO DIABETES DETECTED"

    # Build comprehensive user context
    context = f"""
═══════════════════════════════════════════════════════════
THIS USER'S HEALTH PROFILE & ASSESSMENT
═══════════════════════════════════════════════════════════

  PREDICTION RESULT: {risk_status}
   Status: {message}

     PERSONAL INFORMATION:
   - Age: {user.get("age", "N/A")} years
   - Gender: {user.get("gender", "N/A")}

  KEY HEALTH METRICS:
   - HbA1c Level: {user.get("HbA1c_level", "N/A")}%
   - Blood Glucose: {user.get("blood_glucose_level", "N/A")} mg/dL
   - BMI: {user.get("bmi", "N/A")}

  HEALTH CONDITIONS:
   - Hypertension: {"Yes" if user.get("hypertension") == 1 else "No"}
   - Heart Disease: {"Yes" if user.get("heart_disease") == 1 else "No"}
   - Smoking: {user.get("smoking_history", "N/A")}

═══════════════════════════════════════════════════════════
✓ USE THIS DATA TO PERSONALIZE YOUR RESPONSE
✓ REFERENCE THEIR SPECIFIC NUMBERS IN YOUR ANSWER
═══════════════════════════════════════════════════════════
"""
    return context.strip()


def format_chat_history(chat_history: list) -> str:
    if not chat_history:
        return ""
    
    # Build history with clear formatting
    history = "═══════════════════════════════════════════════════════════\n"
    history += " CONVERSATION HISTORY (Context for this chat)\n"
    history += "═══════════════════════════════════════════════════════════\n\n"
    
    # Include last 10 messages for context
    for i, msg in enumerate(chat_history[-10:], 1):
        history += f"[Message {i}]\n"
        history += f"User asked: {msg['user']}\n"
        history += f"Assistant said: {msg['bot']}\n"
        history += f"---\n"
    
    history += "\n Use this history to understand the conversation flow and context\n"
    history += " Reference previous answers when relevant\n"
    history += "═══════════════════════════════════════════════════════════\n"
    
    return history


# ==================================================
# INTENT & DOMAIN CHECKS
# ==================================================

def is_greeting(question: str) -> bool:
    greetings = ["hi", "hello", "hey", "good morning", "good evening", "namaste"]
    q = question.lower().strip()
    return any(g in q for g in greetings)


def is_identity_question(question: str) -> bool:
    identity = ["who are you", "what are you", "introduce yourself"]
    q = question.lower()
    return any(i in q for i in identity)


def is_emergency(question: str) -> bool:
    emergencies = [
        "unconscious", "collapsed", "seizure", "confused",
        "vomiting", "fruity breath", "very low sugar", "ambulance"
    ]
    q = question.lower()
    return any(e in q for e in emergencies)


def is_off_topic(question: str) -> bool:
    off_topic = [
        "politics", "movie", "song", "cricket", "football",
        "weather", "news", "joke", "technology", "finance"
    ]
    q = question.lower()
    return any(o in q for o in off_topic)


def is_diabetes_related(question: str) -> bool:
    keywords = [
        "diabetes", "diabetic", "blood sugar", "glucose", "hba1c",
        "insulin", "prediabetes", "type 1", "type 2",
        "diet", "food", "exercise", "bmi", "weight",
        "hypertension", "cholesterol", "smoking", "alcohol",
        "symptoms", "management", "control", "risk",
        "neuropathy", "retinopathy", "nephropathy",
        "hypoglycemia", "hyperglycemia",
        "fasting sugar", "postprandial", "ogtt",
        "my glucose", "my hba1c", "my bmi", "my age",
        "health status", "health assessment", "my health",
        "glucose level", "blood pressure", "heart disease"
         # Core diabetes terms
    "diabetes", "diabetic", "prediabetes",
    "type 1", "type 2",
    "blood sugar", "blood glucose", "glucose",
    "hba1c", "insulin",

    # Lab & measurements
    "fasting sugar", "postprandial", "pp sugar", "fbs",
    "ogtt", "glucose level",
    "my glucose", "my hba1c", "my bmi", "my age",

    # Diet & food
    "diet", "food", "meal", "nutrition",
    "rice", "roti", "chapati", "bread",
    "fruits", "banana", "apple","chicken"
    "vegetables", "salad",
    "sugar", "sweets", "chocolate",
    "junk food", "fast food",
    "non veg", "chicken", "fish", "egg",
    "oil", "fried food",
    "milk", "curd", "yogurt",
    "alcohol", "beer", "whisky",

    # Exercise & physical activity
    "exercise", "workout", "walking", "brisk walk",
    "running", "jogging", "cycling",
    "gym", "yoga", "pranayama",
    "stretching", "physical activity",
    "daily activity", "steps", "sedentary",

    # Weight & body
    "bmi", "weight", "weight gain", "weight loss",
    "obesity", "overweight", "fat",

    # Lifestyle & habits
    "smoking", "tobacco",
    "sleep", "sleeping", "insomnia",
    "routine", "daily routine",
    "lifestyle", "habits",

    # Emotions & mental health
    "stress", "anxiety", "depression",
    "tension", "mental health",
    "emotional eating", "mood",

    # Health conditions
    "hypertension", "blood pressure",
    "cholesterol", "heart disease",
    "bp", "thyroid",

    # Symptoms & complications
    "symptoms", "risk",
    "frequent urination", "thirst",
    "fatigue", "tiredness",
    "hypoglycemia", "low sugar",
    "hyperglycemia", "high sugar",
    "neuropathy", "retinopathy", "nephropathy",

    # Management & control
    "management", "control",
    "prevention", "monitoring",
    "sugar control", "diabetes control",

    
    ]
    q = question.lower()
    return any(k in q for k in keywords)


#  KEY FIX: CONTEXT-AWARE FOLLOW-UP SUPPORT
def previous_context_is_diabetes(chat_history: list) -> bool:
    if not chat_history:
        return False
    for msg in chat_history[-3:]:
        if is_diabetes_related(msg.get("user", "")):
            return True
    return False


FOLLOW_UP_INTENTS = [
    "what should i do",
    "what next",
    "how to manage",
    "how to control",
    "any advice",
    "what changes",
    "precautions"
]


def is_follow_up_intent(question: str) -> bool:
    q = question.lower()
    return any(i in q for i in FOLLOW_UP_INTENTS)


# ==================================================
# MAIN RESPONSE GENERATOR
# ==================================================

def generate_llm_answer(
    question: str,
    retrieved_chunks: list,
    ml_result: dict = None,
    chat_history: list = None
):
    question = question.strip()
    chat_history = chat_history or []

    # FIRST MESSAGE - ONLY if NO chat history
    # if len(chat_history) == 0:
    #     return "Hello! I'm DiaAssist, your diabetes care assistant. How can I help you today?"

    # EMERGENCY
    if is_emergency(question):
        return (
            "This sounds like a diabetes-related emergency. "
            "Please seek immediate medical help or call emergency services. "
            "Please consult your doctor for personalized treatment changes or emergencies."
        )

    # IDENTITY
    if is_identity_question(question):
        return "I'm DiaAssist, your diabetes care assistant."

    # GREETING
    if is_greeting(question):
        return "Hello! I'm DiaAssist, your diabetes care assistant. How can I help you with your diabetes care today?"

    # OFF-TOPIC CHECK
    if is_off_topic(question):
        return "I am DiaAssist. Please ask questions related to diabetes."

    # DOMAIN FILTER WITH CONTEXT-AWARENESS
    #  KEY FIX: ALLOW FOLLOW-UP QUESTIONS IF THERE'S DIABETES CONTEXT
    contextual_diabetes = previous_context_is_diabetes(chat_history)
    is_follow_up = is_follow_up_intent(question)
    is_directly_diabetes = is_diabetes_related(question)
    has_assessment = ml_result is not None  # ← NEW: Check if user has completed assessment

    # If user HAS completed health assessment: ALWAYS answer diabetes-related questions with personalization
    if has_assessment and is_directly_diabetes:
        # Proceed with personalized response
        pass
    # If there's chat history with diabetes context AND it's a follow-up intent, ALWAYS continue
    elif len(chat_history) > 0 and contextual_diabetes and is_follow_up:
        # Continue conversation without blocking
        pass
    # Otherwise, check if the question itself is diabetes-related
    elif not is_directly_diabetes and not contextual_diabetes:
        return "I am DiaAssist. Please ask questions related to diabetes."

    # CONTEXT PREP
    textbook_context = trim_context(retrieved_chunks)
    user_context = format_user_context(ml_result)
    history_context = format_chat_history(chat_history)

    # NEW: When user HAS assessment, force personalization in prompt
    personalization_emphasis = ""
    if has_assessment:
        personalization_emphasis = """
  IMPORTANT: User has completed a health assessment.
   EVERY response MUST include their personal health data.
   Do NOT give generic explanations - personalize everything to THEIR metrics.
"""

    user_prompt = f"""
{history_context}

{user_context}

TEXTBOOK REFERENCE:
{textbook_context}

QUESTION FROM USER:
{question}

═══════════════════════════════════════════════════════════
 RESPONSE FORMAT & REQUIREMENTS 
═══════════════════════════════════════════════════════════
{personalization_emphasis}


  
CRITICAL RULES (MUST FOLLOW):
1. MAXIMUM 5 POINTS ONLY
2. USE NUMBERED POINTS ONLY (1., 2., 3.)
3. EACH POINT ON A NEW LINE
4. NO DOT (.) BULLET FORMAT
5. NO LONG PARAGRAPHS
6. SHORT, CLEAR, MEDICAL SAFE ANSWERS

YES / NO QUESTIONS (MANDATORY):
- If user asks a direct question (can I / do I / should I):
  → First line MUST be: Yes. OR No.
  → Then give reasons in numbered points

   WRONG (DON'T DO THIS):
    Point 1 . Point 2 . Point 3

1. CONVERSATION CONTINUITY (IF APPLICABLE):
    If user asked about this before, acknowledge: "As discussed earlier..."
    Build on previous context, don't repeat the same answer

2. PERSONALIZATION (REQUIRED FOR ALL RESPONSES):
    Use their HbA1c value, glucose level, and BMI if available
   Reference their prediction status (Diabetes Detected / No Diabetes)
   Tailor advice to THEIR specific condition

3. ANSWER REQUIREMENTS:
    If Diabetes Detected: Give management strategies
    If No Diabetes Detected: Give prevention strategies
    Use only relevant information, discard unnecessary details
    Be practical and actionable

4. FORBIDDEN:
    Long paragraphs - use periods instead
    Repeating yourself - consolidate points
    Generic definitions - always personalize
    More than 5 points
    Asking to complete assessment if already completed

5. CLOSING:
   . Always end with: "Please consult your doctor for personalized treatment changes or emergencies."

═══════════════════════════════════════════════════════════
EXAMPLE RESPONSE FORMAT:

Instead of: "Diabetes is a metabolic disorder characterized by high blood sugar levels..."

Write:
 Your HbA1c of X% indicates [status]
 Normal glucose: 70-99 mg/dL after fasting
 Your glucose level of Y mg/dL is [classification]
 Action: Monitor levels daily

Please consult your doctor for personalized treatment changes or emergencies.

═══════════════════════════════════════════════════════════
"""

    try:
        response = client.chat.completions.create(
            model=LLM_MODEL_NAME,
            messages=[
                {"role": "system", "content": SYSTEM_PROMPT},
                {"role": "user", "content": user_prompt}
            ],
            temperature=0.1,  # Lower temperature for stricter instruction following
            max_tokens=250  # Reduced from 400 to encourage conciseness
        )

        return response.choices[0].message.content.strip()

    except Exception as e:
        print("Groq Error:", e)
        return "I am currently unable to respond. Please try again shortly."
