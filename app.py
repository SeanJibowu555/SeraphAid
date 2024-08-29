from flask import Flask, render_template, request, jsonify
import tensorflow as tf
from tensorflow.keras.models import load_model
import numpy as np
import cv2
from PIL import Image
import io
import os
import requests

app = Flask(__name__)

# URL to your model file on Google Drive
MODEL_URL = "https://github.com/SeanJibowu555/large-files-repo/raw/main/facialemotionmodel.h5"
MODEL_PATH = 'facialemotionmodel.h5'

def download_file(url, destination):
    if not os.path.exists(destination):
        print(f"Downloading {url} to {destination}")
        response = requests.get(url, stream=True)
        with open(destination, 'wb') as f:
            for chunk in response.iter_content(1024):
                f.write(chunk)
        print(f"Downloaded {destination}")

# Ensure the model file is downloaded before loading it
download_file(MODEL_URL, MODEL_PATH)

# Load the model
model = load_model(MODEL_PATH)

# Load the class labels
emotion_labels = ['Angry', 'Disgust', 'Fear', 'Happy', 'Sad', 'Surprise', 'Neutral']

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/detect-emotion', methods=['POST'])
def detect_emotion():
    # Get the image from the POST request
    if 'frame' not in request.files:
        return jsonify({'error': 'No frame provided'}), 400
    
    frame = request.files['frame'].read()
    image = Image.open(io.BytesIO(frame))
    image = np.array(image.convert('RGB'))

    # Preprocess the image
    gray = cv2.cvtColor(image, cv2.COLOR_RGB2GRAY)
    gray = cv2.resize(gray, (48, 48))
    gray = gray.astype('float32') / 255
    gray = np.expand_dims(gray, axis=0)
    gray = np.expand_dims(gray, axis=-1)

    # Predict emotion
    predictions = model.predict(np.expand_dims(gray, axis=0))
    emotion = emotion_labels[np.argmax(predictions)]

    return jsonify({'emotion': emotion})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001, debug=True)
