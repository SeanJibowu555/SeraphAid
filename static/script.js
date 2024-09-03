const video = document.getElementById('webcam');

// Access the camera
navigator.mediaDevices.getUserMedia({ video: true })
    .then(stream => {
        video.srcObject = stream;
    })
    .catch(err => {
        console.error("Error accessing the camera: " + err);
    });

function analyzeFrame() {
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Convert canvas to blob and send to backend
    canvas.toBlob(blob => {
        const formData = new FormData();
        formData.append('image', blob, 'frame.png');

        fetch('/analyze', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            document.getElementById('people-count').innerText = `Number of People: ${data.people_count}`;
            document.getElementById('emotion-results').innerText = `Emotions: ${data.emotions}`;
            document.getElementById('identification-results').innerText = `Identifications: ${data.identifications}`;
        })
        .catch(error => {
            console.error('Error analyzing frame:', error);
        });
    });
}

// Call the analyzeFrame function at regular intervals
setInterval(analyzeFrame, 1000);  // every second
