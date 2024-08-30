document.addEventListener('DOMContentLoaded', async function() {
    const video = document.getElementById('webcam');

    try {
        // Check if the device has front-facing or back-facing camera
        const constraints = {
            video: {
                facingMode: "user", // "user" for front camera, "environment" for back camera
                width: { ideal: 640 },
                height: { ideal: 480 }
            }
        };

        // Try to access the webcam with the specified constraints
        const stream = await navigator.mediaDevices.getUserMedia(constraints);

        // Set the video element's source to the webcam stream
        video.srcObject = stream;

        // Flip the video horizontally using CSS
        video.style.transform = "scaleX(-1)";
    } catch (err) {
        console.error('Error accessing the webcam:', err);
        alert('Could not access the webcam. Please ensure you have granted permission.');
    }
});
