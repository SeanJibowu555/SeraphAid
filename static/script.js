document.addEventListener('DOMContentLoaded', function() {
    const video = document.getElementById('webcam');
    const textBox = document.getElementById('text-box');

    // Start video stream
    navigator.mediaDevices.getUserMedia({ video: true })
        .then(function(stream) {
            video.srcObject = stream;
            video.play();
        })
        .catch(function(err) {
            console.error("Error accessing camera: ", err);
            textBox.textContent = "Error accessing the webcam.";
        });

    // Function to capture image and send it to the server
    function captureAndAnalyze() {
        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        const ctx = canvas.getContext('2d');
        // Flip the canvas horizontally to get a mirror image
        ctx.translate(canvas.width, 0);
        ctx.scale(-1, 1);
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        const imageData = canvas.toDataURL('image/jpeg');
        const base64Image = imageData.split(',')[1];

        fetch('/analyze', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ image: base64Image })
        })
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                console.error("Error analyzing emotion: ", data.error);
                textBox.textContent = `Error: ${data.error}`;
            } else {
                console.log("Emotion analysis result: ", data);
                const emotion = data[0].dominant_emotion;
                textBox.textContent = `Detected Emotion: ${emotion}`;
            }
        })
        .catch(error => {
            console.error("Error in fetching result: ", error);
            textBox.textContent = "Error analyzing emotion.";
        });
    }

    // Check the current page and set up analysis if on RT Emotion Detection page
    if (document.body.classList.contains('emotion-detection')) {
        // Analyze image every 5 seconds (adjust the interval as needed)
        setInterval(captureAndAnalyze, 1500);
    } else {
        textBox.textContent = "RT Emotion Detection is not available on this page.";
    }
});
