import json
import os

BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(__file__)))
PROFILE_PATH = os.path.join(BASE_DIR, "data", "user_profiles.json")


def analyze_traits(user_id):

    with open(PROFILE_PATH) as f:
        users = json.load(f)

    user = next(u for u in users if u["user_id"] == user_id)

    traits = user["personality"]

    trait_list = [
        {"trait": k, "score": round(v * 100)}
        for k, v in traits.items()
    ]

    sorted_traits = sorted(trait_list, key=lambda x: x["score"])

    return {
        "all_traits": sorted_traits[::-1],
        "strong_traits": sorted_traits[-3:],
        "weak_traits": sorted_traits[:3]
    }