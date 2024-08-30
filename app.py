from flask import Flask, render_template, request, jsonify
import cv2
import numpy as np
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing.image import img_to_array

app = Flask(__name__)

# Load the pre-trained model
model = load_model('models/facialemotionmodel.h5')

# Define emotion labels (modify if different)
emotion_labels = ['Angry', 'Disgust', 'Fear', 'Happy', 'Sad', 'Surprise', 'Neutral']

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/analyze', methods=['POST'])
def analyze():
    if 'image' not in request.files:
        return jsonify({'error': 'No image file provided'}), 400
    
    file = request.files['image']
    img = cv2.imdecode(np.frombuffer(file.read(), np.uint8), cv2.IMREAD_COLOR)
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')
    faces = face_cascade.detectMultiScale(gray, scaleFactor=1.1, minNeighbors=5, minSize=(30, 30))

    if len(faces) == 0:
        return jsonify({'emotion': 'No face detected'}), 200

    # Assuming only one face per image for simplicity
    (x, y, w, h) = faces[0]
    face = gray[y:y+h, x:x+w]
    face = cv2.resize(face, (48, 48))
    face = img_to_array(face)
    face = np.expand_dims(face, axis=0)
    face /= 255.0
    
    emotion_probs = model.predict(face)
    max_index = np.argmax(emotion_probs[0])
    emotion = emotion_labels[max_index]

    return jsonify({'emotion': emotion}), 200

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=8080, debug=True)
