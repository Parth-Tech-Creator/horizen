import json
import re
import os
from datetime import datetime
from ai.llm_client import generate_response

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA_PATH = os.path.join(BASE_DIR, "data")
MEDIA_PATH = os.path.join(BASE_DIR, "media")


def load_json(path):
    if not os.path.exists(path):
        return []

    with open(path, "r", encoding="utf-8") as f:
        try:
            return json.load(f)
        except:
            return []


def save_json(path, data):
    with open(path, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=4)


def clamp(value):
    return max(0.0, min(1.0, value))


def analyze_reflection(user_id, media_id, user_answer):

    users = load_json(os.path.join(DATA_PATH, "user_profiles.json"))
    logs = load_json(os.path.join(DATA_PATH, "reflection_logs.json"))
    media_list = load_json(os.path.join(MEDIA_PATH, "media_metadata.json"))

    user = next((u for u in users if u["user_id"] == user_id), None)
    media = next((m for m in media_list if m["id"] == media_id), None)

    if not user or not media:
        return {"error": "User or Media not found"}

    story_summary = media.get("reflection_summary", "")
    focus_traits = media.get("reflection_focus_traits", [])

    # ---------------- AI Prompt ----------------

    prompt = f"""
You are an emotional learning assistant helping a learner reflect on a story.

Story Summary:
{story_summary}

User Reflection:
{user_answer}

Focus Traits:
{focus_traits}

Your tasks:

1. Briefly acknowledge what the user noticed.
2. Offer another possible perspective about the characters or situation.
3. Encourage deeper thinking about emotions or intentions.

Then estimate reflection depth from 0 to 1.

Return JSON only in this format:

{{
 "ai_perspective": "...",
 "understanding_score": 0.0
}}
"""

    response = generate_response(prompt, model="qwen2.5:7b")

    cleaned = re.sub(r"```json|```", "", response).strip()

    try:
        parsed = json.loads(cleaned)
    except:
        return {
            "ai_perspective": "Sometimes stories can be interpreted in different ways. Think about how each character might feel and why they acted the way they did.",
            "understanding_score": 0.5
        }

    ai_text = parsed.get(
        "ai_perspective",
        "Another perspective could be that the characters may have misunderstood each other's intentions."
    )

    understanding = parsed.get("understanding_score", 0.5)

    understanding = clamp(float(understanding))

    # ---------------- Logging ----------------

    logs.append({
        "user_id": user_id,
        "media_id": media_id,
        "answer": user_answer,
        "understanding_score": understanding,
        "timestamp": datetime.now().isoformat()
    })

    save_json(os.path.join(DATA_PATH, "reflection_logs.json"), logs)

    return {
        "ai_perspective": ai_text,
        "understanding_score": understanding
    }