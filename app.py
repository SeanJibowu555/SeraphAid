from flask import Flask, request, jsonify
from deepface import DeepFace
import cv2
import numpy as np

app = Flask(__name__)

# Load pre-trained models
face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')

@app.route('/analyze', methods=['POST'])
def analyze():
    try:
        file = request.files['image']
        img = cv2.imdecode(np.frombuffer(file.read(), np.uint8), cv2.IMREAD_COLOR)
        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

        faces = face_cascade.detectMultiScale(gray, scaleFactor=1.1, minNeighbors=5, minSize=(30, 30))
        people_count = len(faces)
        emotions = []

        for (x, y, w, h) in faces:
            face = img[y:y+h, x:x+w]
            # Analyze emotions
            analysis = DeepFace.analyze(face, actions=['emotion'])
            
            # Emotion
            emotions.append(analysis[0]['dominant_emotion'])

        return jsonify({
            'people_count': people_count,
            'emotions': emotions
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8080, debug=True)

