from flask import Blueprint, request, jsonify
import json
import os

auth_bp = Blueprint("auth", __name__)

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
USERS_PATH = os.path.join(BASE_DIR, "data", "login_users.json")


def load_users():
    if not os.path.exists(USERS_PATH):
        return {"users": []}

    with open(USERS_PATH, "r") as f:
        return json.load(f)


@auth_bp.route("/login", methods=["POST"])
def login():

    data = request.json

    email = data.get("email")
    phone = data.get("phone")
    password = data.get("password")

    db = load_users()

    for user in db["users"]:

        if (
            (email and user["email"] == email) or
            (phone and user["phone"] == phone)
        ) and user["password"] == password:

            return jsonify({
                "success": True,
                "user_id": user["user_id"]
            })

    return jsonify({
        "success": False,
        "message": "Invalid credentials"
    })