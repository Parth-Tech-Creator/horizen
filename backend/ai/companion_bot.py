import json
import os
from datetime import datetime
from ai.llm_client import generate_response

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

DATA_DIR    = os.path.join(BASE_DIR, "data")
MEMORY_FILE = os.path.join(DATA_DIR, "companion_memory.json")
CHAT_FILE   = os.path.join(DATA_DIR, "companion_chat_history.json")

# Ensure data directory exists so file writes never crash on missing folder
os.makedirs(DATA_DIR, exist_ok=True)

# -----------------------------
# Load memory
# -----------------------------
def load_user_memory(user_id):

    try:
        with open(MEMORY_FILE, "r", encoding="utf-8") as f:
            users = json.load(f)

        for user in users:
            if user["user_id"] == user_id:
                return user.get("companion_memory", {})

    except Exception as e:
        print("Memory error:", e)

    return {}


# -----------------------------
# Save memory
# -----------------------------
def save_user_memory(user_id, memory):

    try:
        with open(MEMORY_FILE, "r", encoding="utf-8") as f:
            users = json.load(f)

    except:
        users = []

    user_found = False

    for user in users:

        if user["user_id"] == user_id:
            user["companion_memory"] = memory
            user_found = True
            break  # stop after first match — prevents duplicate updates

    if not user_found:

        users.append({
            "user_id": user_id,
            "companion_memory": memory
        })

    with open(MEMORY_FILE, "w", encoding="utf-8") as f:
        json.dump(users, f, indent=2)


# -----------------------------
# Extract emotional summary
# -----------------------------
def extract_memory_update(message):

    prompt = f"""
Summarize this message for emotional memory.

User message:
{message}

Return JSON:
{{
 "emotion": "...",
 "topic": "...",
 "summary": "short memory sentence"
}}
"""

    response = generate_response(prompt, model="llama3.1:8b")

    try:
        # LLMs often wrap JSON in markdown fences — strip them before parsing
        clean = response.strip()
        if clean.startswith("```"):
            clean = clean.split("```")[1]          # grab content between fences
            if clean.startswith("json"):
                clean = clean[4:]                  # strip the 'json' language tag
        return json.loads(clean.strip())
    except:
        return {
            "emotion": "unknown",
            "topic": "general",
            "summary": message[:80]
        }


# -----------------------------
# Companion Chat
# -----------------------------
def companion_chat(user_id, message):

    memory = load_user_memory(user_id)

    previous_summary = memory.get("summary", "")
    last_emotion = memory.get("last_emotion", "")

    prompt = f"""
You are Horizon's friendly emotional companion.

Previous user summary:
{previous_summary}

Last known emotion:
{last_emotion}

User message:
{message}

Respond warmly and ask thoughtful follow-up questions.
"""

    response = generate_response(prompt, model="llama3.1:8b")

    # -------- update memory --------

    update = extract_memory_update(message)

    new_memory = {
        "summary": update["summary"],
        "last_emotion": update["emotion"],
        "topic": update["topic"],
        "last_checkin": str(datetime.now().date())
    }

    save_user_memory(user_id, new_memory)

    return {
        "response": response,
        "memory_update": new_memory
    }