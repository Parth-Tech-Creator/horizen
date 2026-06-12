from engine.recommender import recommend_next
from ai.session_engine import get_user

import json
import random
import os


# ─────────────────────────────────────────
# Resolve backend/data path dynamically
# ─────────────────────────────────────────
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
QUOTES_PATH = os.path.join(BASE_DIR, "data", "quotes_cache.json")


def get_cached_quote(trait):

    # Check if file exists
    if not os.path.exists(QUOTES_PATH):
        print("Quote file not found:", QUOTES_PATH)
        return "Growth begins with a new perspective."

    # Load quote database
    with open(QUOTES_PATH, "r", encoding="utf-8") as f:
        quotes = json.load(f)

    # Try trait quotes
    trait_quotes = quotes.get(trait, [])

    # Fallback to general quotes
    if not trait_quotes:
        trait_quotes = quotes.get("general", [])

    # Final fallback
    if not trait_quotes:
        return "Every story helps us grow."

    # Pick random quote
    return random.choice(trait_quotes)


def generate_dashboard(user_id):

    user = get_user(user_id)

    if not user:
        return {"error": "User not found"}

    media = recommend_next(user_id)

    weakest = sorted(
        user["personality"].items(),
        key=lambda x: x[1]
    )

    focus_trait = weakest[0][0]

    quote = get_cached_quote(focus_trait)

    return {
        "daily_quote": quote.strip(),
        "daily_focus_trait": focus_trait,
        "recommended_video": {
            "title": media.get("title"),
            "reason": media.get("reason")
        }
    }