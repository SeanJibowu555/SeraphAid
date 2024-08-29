const video = document.getElementById('video');
const startButton = document.getElementById('startButton');
const stopButton = document.getElementById('stopButton');
const generateReport = document.getElementById('generateReport');

let streaming = false;

// Start Video Stream
startButton.addEventListener('click', () => {
    navigator.mediaDevices.getUserMedia({ video: true })
        .then(stream => {
            video.srcObject = stream;
            streaming = true;
            detectEmotions();
        })
        .catch(err => console.error("Error accessing camera: ", err));
});

// Stop Video Stream
stopButton.addEventListener('click', () => {
    if (video.srcObject) {
        video.srcObject.getTracks().forEach(track => track.stop());
        streaming = false;
    }
});

// Function to Capture and Send Video Frames
function detectEmotions() {
    if (!streaming) return;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const context = canvas.getContext('2d');
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    canvas.toBlob(blob => {
        const formData = new FormData();
        formData.append('frame', blob, 'frame.png');
        fetch('/detect-emotion', { method: 'POST', body: formData })
            .then(response => response.json())
            .then(data => {
                console.log('Emotions detected:', data);
                if (streaming) requestAnimationFrame(detectEmotions);
            })
            .catch(err => console.error("Error detecting emotions: ", err));
    });
}
