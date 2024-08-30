from flask import Flask, render_template, Response, jsonify
import cv2
import numpy as np
from tensorflow.keras.models import load_model

app = Flask(__name__)

# Load the model
model = load_model('models/facialemotionmodel.h5')

# Define the emotion dictionary
emotion_dict = {
    0: 'Angry', 1: 'Disgust', 2: 'Fear', 3: 'Happy',
    4: 'Neutral', 5: 'Sad', 6: 'Surprise'
}

@app.route('/')
def index():
    return render_template('index.html')

def analyze_frame(frame):
    gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
    resized_frame = cv2.resize(gray, (48, 48))
    normalized_frame = resized_frame / 255.0
    reshaped_frame = np.reshape(normalized_frame, (1, 48, 48, 1))
    prediction = model.predict(reshaped_frame)
    max_index = int(np.argmax(prediction))
    return emotion_dict[max_index]

@app.route('/analyze', methods=['POST'])
def analyze():
    cap = cv2.VideoCapture(0)
    success, frame = cap.read()
    cap.release()
    if success:
        mood = analyze_frame(frame)
        return jsonify({'mood': mood})
    else:
        return jsonify({'mood': 'Error: Could not access the webcam'})

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=8080, debug=True)
