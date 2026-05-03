import os
from flask import Flask, jsonify, request, send_from_directory
from flask_cors import CORS
from routes.auth import auth_bp
from routes.patients import patients_bp
from routes.appointments import appointments_bp
from routes.doctors import doctors_bp
from routes.history import history_bp
from routes.mood import mood_bp
from routes.predict import predict_bp
from routes.messages import messages_bp

BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
FRONTEND_DIR = os.path.abspath(os.path.join(BASE_DIR, "frontend"))
DATA_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "data"))
UPLOADS_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "uploads"))
HF_TOKEN = os.getenv("HF_TOKEN")

os.makedirs(DATA_DIR, exist_ok=True)
os.makedirs(UPLOADS_DIR, exist_ok=True)

app = Flask(__name__, static_folder=FRONTEND_DIR, static_url_path="")
CORS(app)

app.register_blueprint(auth_bp)
app.register_blueprint(patients_bp)
app.register_blueprint(appointments_bp)
app.register_blueprint(doctors_bp)
app.register_blueprint(history_bp)
app.register_blueprint(mood_bp)
app.register_blueprint(predict_bp)
app.register_blueprint(messages_bp)


@app.post("/api/chat")
def chat():
    if not HF_TOKEN:
        return jsonify({"reply": "Chat service not configured."})

    payload = request.get_json(silent=True) or {}
    message = payload.get("message", "")
    return jsonify({"reply": "Chat service configured.", "message": message})


@app.get("/health")
def health():
    return jsonify({"status": "ok", "service": "Neurosense Care API"})


@app.get("/")
def serve_index():
    return send_from_directory(FRONTEND_DIR, "index.html")


@app.get("/<path:asset_path>")
def serve_frontend_asset(asset_path):
    return send_from_directory(FRONTEND_DIR, asset_path)


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=int(os.environ.get("PORT", 5000)))
