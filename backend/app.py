from flask import Flask, jsonify
from flask_cors import CORS

from routes.media_routes import media_bp
from routes.chat_routes import chat_bp
from routes.recommender_route import recommender_bp
from routes.session_routes import session_bp
from routes.dashboard_routes import dashboard_bp
from routes.auth_routes import auth_bp

def create_app():
    app = Flask(__name__)

    # Enable CORS for React frontend
    CORS(app, origins=["http://localhost:5173"])

    app.register_blueprint(media_bp, url_prefix="/media")
    app.register_blueprint(chat_bp, url_prefix="/chat")
    app.register_blueprint(recommender_bp, url_prefix="/recommend")
    app.register_blueprint(session_bp, url_prefix="/session")
    app.register_blueprint(dashboard_bp, url_prefix="/dashboard")
    app.register_blueprint(auth_bp, url_prefix="/auth")

    @app.route("/")
    def home():
        return jsonify({
            "status": "Horizon Backend Running",
            "message": "Core server active"
        })

    @app.route("/health")
    def health():
        return jsonify({"server": "ok"})

    return app


if __name__ == "__main__":
    app = create_app()
    app.run(debug=True, port=5000)
