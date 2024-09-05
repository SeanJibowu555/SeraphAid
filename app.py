from flask import Flask, render_template, request, jsonify
import cv2
import numpy as np
import base64
import os
from deepface import DeepFace

app = Flask(__name__)

# Ensure the directory for saving debug images exists
if not os.path.exists('debug'):
    os.makedirs('debug')

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/analyze', methods=['POST'])
def analyze_emotion():
    try:
        # Retrieve the base64-encoded image data from the request
        data = request.json
        if 'image' not in data:
            return jsonify({'error': 'No image data provided'}), 400
        
        img_data = data['image']
        
        # Decode the base64 image data
        img_bytes = base64.b64decode(img_data)
        img_array = np.frombuffer(img_bytes, np.uint8)
        frame = cv2.imdecode(img_array, cv2.IMREAD_COLOR)

        if frame is None:
            return jsonify({'error': 'Error decoding image'}), 400

        # Save the frame for debugging
        debug_image_path = 'debug/frame_debug.jpg'
        cv2.imwrite(debug_image_path, frame)

        # Convert to RGB as required by DeepFace
        frame_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        
        # Perform emotion analysis
        analysis = DeepFace.analyze(img_path=frame_rgb, actions=['emotion'])
        
        return jsonify(analysis)
    except Exception as e:
        # Log the exception to the console for debugging
        print(f"Error analyzing emotion: {e}")
        return jsonify({'error': str(e)}), 500

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=8080, debug=True)

