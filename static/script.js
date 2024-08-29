// script.js
document.addEventListener('DOMContentLoaded', () => {
    const webcamElement = document.getElementById('webcam');

    if (!webcamElement) {
        console.error('Webcam element not found.');
        return;
    }

    navigator.mediaDevices.getUserMedia({ video: true })
        .then(stream => {
            webcamElement.srcObject = stream;
        })
        .catch(error => {
            console.error('Error accessing the webcam:', error);
        });
});
