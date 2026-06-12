import json
import random
from datetime import datetime, timedelta
import os

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA_PATH = os.path.join(BASE_DIR, "data")
MEDIA_PATH = os.path.join(BASE_DIR, "media")

LOCK_DURATION_HOURS = 1
SOFT_PENALTY_MULTIPLIER = 0.6
INTENSITY_PENALTY_MULTIPLIER = 0.7


def load_json(path):
    with open(path, "r", encoding="utf-8") as f:
        return json.load(f)


def save_json(path, data):
    with open(path, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2)


def is_locked(last_session_time):
    if not last_session_time:
        return False

    last_time = datetime.fromisoformat(last_session_time)
    return datetime.now() - last_time < timedelta(hours=LOCK_DURATION_HOURS)


def recommend_next(user_id):

    # Load data
    users = load_json(os.path.join(DATA_PATH, "user_profiles.json"))
    history_data = load_json(os.path.join(DATA_PATH, "watched_history.json"))
    age_config = load_json(os.path.join(DATA_PATH, "age_config.json"))
    media_list = load_json(os.path.join(MEDIA_PATH, "media_metadata.json"))

    # Find user
    user = next((u for u in users if u["user_id"] == user_id), None)
    if not user:
        return {"error": "User not found"}

    if is_locked(user["last_session_time"]):
        return {"locked": True, "message": "Session locked. Come back later."}

    personality = user["personality"]
    age_group = user["age_group"]

    # Get watch history
    history = next((h for h in history_data if h["user_id"] == user_id), None)
    if not history:
        return {"error": "History not found"}

    recent_ids = [m["id"] for m in history["recent_media"]]
    last_intensity = history["last_intensity"]
    last_primary_trait = history["last_primary_trait"]

    # Age config
    age_group_config = age_config[age_group]
    priority_weights = age_group_config["priority_traits"]
    background_weights = age_group_config["background_traits"]
    hard_block = age_group_config["content_rules"]["hard_block"]
    soft_penalty = age_group_config["content_rules"]["soft_penalty"]

    # Find weakest traits
    sorted_traits = sorted(personality.items(), key=lambda x: x[1])
    weakest_trait = sorted_traits[0][0]
    second_trait = sorted_traits[1][0]
    third_trait = sorted_traits[2][0]

    secondary_trait = random.choice([second_trait, third_trait])

    best_score = -1
    best_media = None

    for media in media_list:

        # Age compatibility
        if media["age_group"] != age_group:
            if not (age_group == "teen" and media["age_group"] == "child"):
                continue

        # Avoid repetition
        if media["id"] in recent_ids:
            continue

        # Hard block content
        if any(tag in hard_block for tag in media.get("tags", [])):
            continue

        media_traits = media.get("traits", {})

        score = 0

        # Weakest trait priority
        weak_value = media_traits.get(weakest_trait, 0)
        score += weak_value * 1.5

        # Secondary trait
        secondary_value = media_traits.get(secondary_trait, 0)
        score += secondary_value * 1.0

        # Age weighting
        for trait, value in media_traits.items():
            if trait in priority_weights:
                score += value * priority_weights[trait]
            elif trait in background_weights:
                score += value * background_weights[trait]

        # Soft penalty
        if any(tag in soft_penalty for tag in media.get("tags", [])):
            score *= SOFT_PENALTY_MULTIPLIER

        # Avoid same trait twice
        if weakest_trait == last_primary_trait:
            score *= 0.8

        # Intensity balance
        if last_intensity is not None:
            if last_intensity > 0.7 and media["intensity"] > 0.7:
                score *= INTENSITY_PENALTY_MULTIPLIER

        if score > best_score:
            best_score = score
            best_media = media

    # Fallback if nothing selected
    if not best_media:
        best_media = media_list[0]
        best_media["recommended_traits"] = ["general_growth"]
        best_media["reason"] = "Fallback recommendation"

    # Update history
    history["recent_media"].append({
        "id": best_media["id"],
        "intensity": best_media["intensity"],
        "traits_targeted": [weakest_trait, secondary_trait]
    })

    if len(history["recent_media"]) > 5:
        history["recent_media"].pop(0)

    history["last_intensity"] = best_media["intensity"]
    history["last_primary_trait"] = weakest_trait

    save_json(os.path.join(DATA_PATH, "watched_history.json"), history_data)

    best_media["recommended_traits"] = [weakest_trait, secondary_trait]
    best_media["reason"] = f"Selected to strengthen {weakest_trait} and support {secondary_trait}."

    return best_media