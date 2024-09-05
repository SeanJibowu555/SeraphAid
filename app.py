from flask import Flask, render_template, request, jsonify
import cv2
import numpy as np
import base64
from deepface import DeepFace
import logging

app = Flask(__name__)

# Setup logging
logging.basicConfig(level=logging.INFO)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/analyze', methods=['POST'])
def analyze_emotion():
    try:
        data = request.json
        
        if 'image' not in data:
            logging.error("No image data provided")
            return jsonify({'error': 'No image data provided'}), 400

        img_data = data['image']
        img_bytes = base64.b64decode(img_data)
        img_array = np.frombuffer(img_bytes, np.uint8)
        frame = cv2.imdecode(img_array, cv2.IMREAD_COLOR)

        if frame is None:
            logging.error("Error decoding image")
            return jsonify({'error': 'Error decoding image'}), 400

        # Log the shape of the image for debugging
        logging.info(f"Image shape: {frame.shape}")

        # Resize the image for consistency
        new_size = (640, 480)
        frame_resized = cv2.resize(frame, new_size)

        # Convert to RGB
        frame_rgb = cv2.cvtColor(frame_resized, cv2.COLOR_BGR2RGB)

        # Log that analysis is starting
        logging.info("Starting emotion analysis with DeepFace")

        # Perform emotion analysis with enforce_detection set to False for tilted faces
        analysis = DeepFace.analyze(img_path=frame_rgb, actions=['emotion'], enforce_detection=False)

        # Log the analysis result for debugging
        logging.info(f"Analysis result: {analysis}")

        return jsonify(analysis)
    
    except Exception as e:
        logging.error(f"Error analyzing emotion: {e}")
        return jsonify({'error': 'Internal server error'}), 500

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=8080, debug=True)
