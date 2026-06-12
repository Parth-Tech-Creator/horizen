import json
import os

from engine.recommender import recommend_next
from ai.llm_client import generate_response

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA_PATH = os.path.join(BASE_DIR, "data")
SESSION_CACHE_PATH = os.path.join(DATA_PATH, "session_cache.json")
MEDIA_PATH = os.path.join(BASE_DIR, "media")


def load_json(path):
    with open(path, "r", encoding="utf-8") as f:
        return json.load(f)

def load_session_cache():

    if not os.path.exists(SESSION_CACHE_PATH):
        return {}

    with open(SESSION_CACHE_PATH, "r", encoding="utf-8") as f:
        try:
            return json.load(f)
        except:
            return {}


def save_session_cache(data):

    with open(SESSION_CACHE_PATH, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=4)


def get_user(user_id):

    users = load_json(os.path.join(DATA_PATH, "user_profiles.json"))

    return next((u for u in users if u["user_id"] == user_id), None)


def generate_session(user_id):

    user = get_user(user_id)

    if not user:
        return {"error": "User not found"}

    # ---------- Recommendation ----------
    media = recommend_next(user_id)

    if "error" in media:
        return media

    weakest_traits = sorted(
        user["personality"].items(),
        key=lambda x: x[1]
    )

    focus_trait = weakest_traits[0][0]

    # ---------- AI Prompt ----------
    prompt = f"""
You are the AI guide for a reflective learning platform.

User weakest trait:
{focus_trait}

Story title:
{media['title']}

Story themes:
{media.get('tags', [])}

Story summary:
{media.get('reflection_summary','')}

Generate:

1. A short reflective quote for the session
2. A short message explaining the session focus
3. 5 reflection questions about the story

Return JSON only.

Format:

{{
 "quote": "...",
 "message": "...",
 "questions": ["q1","q2","q3","q4","q5"]
}}
"""

    response = generate_response(prompt, model="qwen2.5:7b")

    try:
        parsed = json.loads(response)
    except:
        return {"error": "LLM parsing failed", "raw": response}

    session_data = {
        "media": {
            "id": media["id"],
            "title": media["title"],
            "tags": media.get("tags", []),
            "video_file": f"{media['id']}.mp4",
            "description": media.get("reflection_summary", ""),
            "reason": media.get("reason", "")
        },
        "session_intro": {
            "quote": parsed["quote"],
            "focus_trait": focus_trait,
            "message": parsed["message"]
        },
        "reflection_questions": parsed["questions"]
    }

    cache = load_session_cache()
    cache[user_id] = session_data
    save_session_cache(cache)

    return session_data