from flask import Flask, render_template, request, jsonify
import cv2
import numpy as np
import base64
from deepface import DeepFace
import io
import logging

app = Flask(__name__)

# Setup logging
logging.basicConfig(level=logging.INFO)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/rt-identification')
def rt_identification():
    return render_template('rt_identification.html')

@app.route('/analyze', methods=['POST'])
def analyze_emotion():
    try:
        data = request.json
        if 'image' not in data:
            return jsonify({'error': 'No image data provided'}), 400

        img_data = data['image']
        img_bytes = base64.b64decode(img_data)
        img_array = np.frombuffer(img_bytes, np.uint8)
        frame = cv2.imdecode(img_array, cv2.IMREAD_COLOR)

        if frame is None:
            return jsonify({'error': 'Error decoding image'}), 400

        # Resize the image for consistency
        height, width = frame.shape[:2]
        new_size = (640, 480)  # Resize dimensions (adjust as needed)
        frame_resized = cv2.resize(frame, new_size)
        
        # Convert to RGB
        frame_rgb = cv2.cvtColor(frame_resized, cv2.COLOR_BGR2RGB)
        
        # Save debug images (optional)
        debug_image_path = 'debug/frame_resized_debug.jpg'
        cv2.imwrite(debug_image_path, frame_resized)

        # Perform emotion analysis
        analysis = DeepFace.analyze(img_path=frame_rgb, actions=['emotion'])

        # Save analysis result for debugging (optional)
        debug_analysis_path = 'debug/analysis_debug.json'
        with open(debug_analysis_path, 'w') as f:
            import json
            json.dump(analysis, f, indent=4)

        return jsonify(analysis)
    except Exception as e:
        logging.error(f"Error analyzing emotion: {e}")
        return jsonify({'error': 'Internal server error'}), 500

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=8080, debug=True)




