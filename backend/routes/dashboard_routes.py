from flask import Blueprint, request, jsonify

from ai.dashboard_engine import generate_dashboard

dashboard_bp = Blueprint("dashboard", __name__)
from ai.insight_engine import generate_insights
from flask import request, jsonify

@dashboard_bp.route("/insights", methods=["GET"])
def insights():

    user_id = request.args.get("user_id")

    result = generate_insights(user_id)

    return jsonify(result)
@dashboard_bp.route("/overview", methods=["GET"])
def overview():

    user_id = request.args.get("user_id")

    result = generate_dashboard(user_id)

    return jsonify(result)