import os
from flask import Blueprint, jsonify, request
from engine.recommender import recommend_next

recommender_bp = Blueprint("recommender", __name__)


@recommender_bp.route("/next", methods=["GET"])
def next_recommendation():

    user_id = request.args.get("user_id")

    if not user_id:
        return jsonify({"error": "user_id required"}), 400

    result = recommend_next(user_id)

    if "error" in result:
        return jsonify(result), 404

    if "locked" in result:
        return jsonify(result), 403

    return jsonify({
        "recommended": result,
        "reason": "Chosen based on weakest personality traits and learning balance."
    })