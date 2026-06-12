import json

PROFILE_FILE = "backend/data/user_profiles.json"


def get_age_group(user_id):

    with open(PROFILE_FILE, "r") as f:
        users = json.load(f)

    for user in users:
        if user["user_id"] == user_id:
            return user.get("age_group", "teen")

    return "teen"