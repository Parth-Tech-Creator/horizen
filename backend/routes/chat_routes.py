from flask import Blueprint, request, jsonify

from ai.companion_bot import companion_chat
from ai.reflection_bot import analyze_reflection

chat_bp = Blueprint("chat", __name__)


@chat_bp.route("/reflection", methods=["POST"])
def reflection():

    data = request.json

    user_id = data.get("user_id")
    media_id = data.get("media_id")
    answer = data.get("answer")

    result = analyze_reflection(user_id, media_id, answer)

    return jsonify(result)


@chat_bp.route("/companion", methods=["POST"])
def companion():

    try:
        data = request.json

        user_id = data.get("user_id")
        message = data.get("message")

        result = companion_chat(user_id, message)

        return jsonify(result)

    except Exception as e:
        print("COMPANION ERROR:", e)
        return jsonify({"error": str(e)}), 500