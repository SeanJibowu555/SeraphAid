document.addEventListener('DOMContentLoaded', function() {
    const video = document.getElementById('webcam');
    const infoText = document.getElementById('info-text');
    const analyzeButton = document.getElementById('analyseButton');

    const constraints = {
        video: {
            facingMode: "user",
            width: { ideal: 640 },
            height: { ideal: 480 }
        }
    };

    navigator.mediaDevices.getUserMedia(constraints)
        .then((stream) => {
            video.srcObject = stream;
            infoText.textContent = "Webcam is active. Click Analyze to detect mood.";
        })
        .catch((err) => {
            console.error('Error accessing the webcam:', err);
            infoText.textContent = "Could not access the webcam. Please ensure you have granted permission.";
        });

    analyzeButton.addEventListener('click', function() {
        fetch('/analyze', {
            method: 'POST'
        })
        .then(response => response.json())
        .then(data => {
            infoText.textContent = "Detected mood: " + data.mood;
        })
        .catch(error => {
            console.error('Error:', error);
            infoText.textContent = "Error analyzing mood.";
        });
    });
});
