import json

PROFILE_FILE = "backend/data/user_profiles.json"


def update_trait(user_id, trait, value):

    with open(PROFILE_FILE, "r") as f:
        users = json.load(f)

    for user in users:

        if user["user_id"] == user_id:

            trait_data = user["personality"][trait]

            # update score
            trait_data["score"] += value

            # add to history
            trait_data["history"].append(trait_data["score"])

            # limit history
            if len(trait_data["history"]) > 10:
                trait_data["history"].pop(0)

            # compute trend
            if trait_data["history"][-1] > trait_data["history"][0]:
                trait_data["trend"] = "improving"
            else:
                trait_data["trend"] = "stable"

    with open(PROFILE_FILE, "w") as f:
        json.dump(users, f, indent=4)