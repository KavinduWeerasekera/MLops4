#flask
from flask import Flask, request, jsonify
import pickle
import numpy as np
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Load model
import joblib

with open("diabetes_model.pkl", "rb") as f:
    model = joblib.load(f)


@app.route("/predict", methods=["POST"])
def predict():
    data = request.get_json()
    features = np.array([[
        float(data["age"]), float(data["sex"]), float(data["bmi"]),
        float(data["bp"]), float(data["s1"]), float(data["s2"]),
        float(data["s3"]), float(data["s4"]), float(data["s5"]),
        float(data["s6"])
    ]])
    prediction = model.predict(features)[0]
    return jsonify({"prediction": round(prediction, 2)})
@app.route("/")
def home():
    return "Flask API is running"

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
