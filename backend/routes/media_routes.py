import os
from flask import Blueprint, send_from_directory, jsonify

media_bp = Blueprint("media", __name__)

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
VIDEO_FOLDER = os.path.join(BASE_DIR, "media", "videos")


@media_bp.route("/list", methods=["GET"])
def list_videos():
    try:
        if not os.path.exists(VIDEO_FOLDER):
            return jsonify({"error": "Videos folder not found"}), 404

        videos = sorted([f for f in os.listdir(VIDEO_FOLDER) if f.endswith(".mp4")])

        return jsonify({
            "total_videos": len(videos),
            "videos": videos
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@media_bp.route("/videos/<filename>", methods=["GET"])
def serve_video(filename):
    try:
        return send_from_directory(VIDEO_FOLDER, filename)
    except FileNotFoundError:
        return jsonify({"error": "Video not found"}), 404