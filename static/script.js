document.addEventListener('DOMContentLoaded', () => {
    const video = document.getElementById('webcam');
    const textBox = document.getElementById('text-box');

    // Get user media and display it on the video element
    navigator.mediaDevices.getUserMedia({ video: true })
        .then(stream => {
            video.srcObject = stream;
        })
        .catch(err => {
            console.error('Error accessing webcam: ', err);
        });

    // Function to capture an image from the video feed
    function captureImage() {
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.drawImage(video, 0, 0);

        return canvas.toDataURL('image/jpeg');
    }

    // Function to send the image to the backend for analysis
    function analyzeImage() {
        const dataUrl = captureImage();
        const formData = new FormData();
        formData.append('image', dataUrlToBlob(dataUrl), 'image.jpg');

        fetch('/analyze', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.emotion) {
                textBox.textContent = `Emotion: ${data.emotion}`;
            } else {
                textBox.textContent = 'Emotion: Undefined';
            }
        })
        .catch(error => {
            console.error('Error:', error);
            textBox.textContent = 'Error occurred';
        });
    }

    // Helper function to convert Data URL to Blob
    function dataUrlToBlob(dataUrl) {
        const [header, data] = dataUrl.split(',');
        const mime = header.match(/:(.*?);/)[1];
        const binary = atob(data);
        const array = [];
        for (let i = 0; i < binary.length; i++) {
            array.push(binary.charCodeAt(i));
        }
        return new Blob([new Uint8Array(array)], { type: mime });
    }

    // Start analysis periodically
    setInterval(analyzeImage, 5000); // Adjust the interval as needed
});
