// Wait until the page is fully loaded
const video = document.getElementById('webcam');
const textBox = document.getElementById('text-box');

// Access the webcam
navigator.mediaDevices.getUserMedia({ video: true })
    .then((stream) => {
        video.srcObject = stream;
    })
    .catch((err) => {
        console.error("Error accessing webcam: ", err);
    });

// Function to capture a frame from the webcam and send for emotion analysis
function captureFrame() {
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');

    // Flip the image back horizontally (mirror fix)
    ctx.translate(video.videoWidth, 0);
    ctx.scale(-1, 1);
    ctx.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);

    return canvas.toDataURL('image/jpeg'); // Captured frame data
}

// Analyze the frame periodically
setInterval(() => {
    const imgData = captureFrame();
    fetch('/analyze', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ image: imgData })
    })
    .then(response => response.json())
    .then(data => {
        if (data.emotion) {
            textBox.innerText = `Detected emotion: ${data.emotion}`;
        } else {
            textBox.innerText = 'Error analyzing emotion';
        }
    })
    .catch(err => {
        console.error("Error analyzing emotion: ", err);
    });
}, 5000); // Send frame every 5 seconds
