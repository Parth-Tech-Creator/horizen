import json
import os
from datetime import datetime

BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(__file__)))
SNAPSHOT_PATH = os.path.join(BASE_DIR, "data", "growth_snapshots.json")
PROFILE_PATH = os.path.join(BASE_DIR, "data", "user_profiles.json")


def update_snapshot(user_id):

    with open(PROFILE_PATH) as f:
        users = json.load(f)

    user = next(u for u in users if u["user_id"] == user_id)

    traits = user["personality"]

    snapshot = {
        "date": datetime.now().strftime("%Y-%m-%d"),
        **traits
    }

    if os.path.exists(SNAPSHOT_PATH):
        with open(SNAPSHOT_PATH) as f:
            history = json.load(f)
    else:
        history = {}

    history.setdefault(user_id, []).append(snapshot)

    with open(SNAPSHOT_PATH, "w") as f:
        json.dump(history, f, indent=2)

    return history[user_id]