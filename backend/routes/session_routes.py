from flask import Blueprint, request, jsonify

from ai.session_engine import generate_session

session_bp = Blueprint("session", __name__)


@session_bp.route("/start", methods=["POST"])
def start_session():

    data = request.json

    user_id = data.get("user_id")

    result = generate_session(user_id)

    return jsonify(result)