document.addEventListener('DOMContentLoaded', () => {
    const analyzeButton = document.getElementById('analyzeButton');
    const video = document.getElementById('webcam');
    
    analyzeButton.addEventListener('click', () => {
        alert('Analyze button clicked!');
    });

    // Access the webcam
    navigator.mediaDevices.getUserMedia({ video: true })
        .then(stream => {
            video.srcObject = stream;
        })
        .catch(error => {
            console.error('Error accessing webcam: ', error);
        });
});
