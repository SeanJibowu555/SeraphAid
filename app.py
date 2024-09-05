from flask import Flask, render_template, request, jsonify
import cv2
import numpy as np
from deepface import DeepFace
import os

app = Flask(__name__)

# Ensure the model is only downloaded once
weights_path = os.path.expanduser("~/.deepface/weights/facial_expression_model_weights.h5")
if not os.path.exists(weights_path):
    DeepFace.build_model('Emotion')  # This will download the model if not present

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/analyze', methods=['POST'])
def analyze():
    if 'image' not in request.files:
        return jsonify({'error': 'No image file provided'}), 400

    file = request.files['image']
    img = cv2.imdecode(np.frombuffer(file.read(), np.uint8), cv2.IMREAD_COLOR)

    if img is None:
        return jsonify({'emotion': 'No face detected'}), 200

    try:
        results = DeepFace.analyze(img, actions=['emotion'], enforce_detection=False)
        print("DeepFace results:", results)  # Debug print

        # Ensure the results contain 'dominant_emotion'
        if results and 'dominant_emotion' in results[0]:
            emotion = results[0]['dominant_emotion']
        else:
            emotion = 'Undefined'

        return jsonify({'emotion': emotion}), 200

    except Exception as e:
        print("Error:", e)
        return jsonify({'error': str(e)}), 500

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=8080, debug=True)
