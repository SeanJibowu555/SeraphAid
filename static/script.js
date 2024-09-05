// Wait until the page is fully loaded
window.addEventListener('DOMContentLoaded', () => {
    const video = document.getElementById('webcam');
    const textBox = document.getElementById('text-box');

    // Access webcam stream
    function startWebcam() {
        if (navigator.mediaDevices.getUserMedia) {
            navigator.mediaDevices.getUserMedia({ video: true })
                .then((stream) => {
                    video.srcObject = stream;
                })
                .catch((error) => {
                    console.error('Webcam access error:', error);
                    textBox.innerHTML = "Error accessing the webcam.";
                });
        } else {
            textBox.innerHTML = "Webcam not supported in this browser.";
        }
    }

    // Capture a frame from the video stream and send it for analysis
    function captureFrame() {
        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const context = canvas.getContext('2d');
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        // Convert canvas image to blob and send to backend
        canvas.toBlob((blob) => {
            const formData = new FormData();
            formData.append('image', blob, 'frame.jpg');

            // Send frame to backend for analysis
            fetch('/analyze', {
                method: 'POST',
                body: formData,
            })
            .then(response => response.json())
            .then(data => {
                if (data.emotion) {
                    textBox.innerHTML = `Detected Emotion: <strong>${data.emotion}</strong>`;
                } else {
                    textBox.innerHTML = "No emotion detected.";
                }
            })
            .catch((error) => {
                console.error('Error in emotion analysis:', error);
                textBox.innerHTML = "Error analyzing emotion.";
            });
        }, 'image/jpeg');
    }

    // Continuously capture frames for analysis every 2 seconds
    function startAnalyzing() {
        setInterval(captureFrame, 2000); // Analyze every 2 seconds
    }

    // Initialize webcam and start capturing frames
    startWebcam();
    startAnalyzing();
});
