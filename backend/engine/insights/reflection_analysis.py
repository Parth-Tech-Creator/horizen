import json
import os

BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(__file__)))
REFLECTION_PATH = os.path.join(BASE_DIR, "data", "reflection_logs.json")


def analyze_reflections(user_id):

    with open(REFLECTION_PATH) as f:
        logs = json.load(f)

    user_logs = [l for l in logs if l["user_id"] == user_id]

    if not user_logs:
        return {"reflection_score": 0}

    avg = sum(l["understanding_score"] for l in user_logs) / len(user_logs)

    return {
        "reflection_score": round(avg, 2),
        "reflection_count": len(user_logs)
    }