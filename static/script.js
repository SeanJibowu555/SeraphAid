// script.js

const video = document.getElementById('webcam');
const textBox = document.getElementById('text-box');

// Start video stream
navigator.mediaDevices.getUserMedia({ video: true })
  .then(stream => {
    video.srcObject = stream;
    video.play();
    processVideo();
  })
  .catch(err => {
    console.error("Error accessing the webcam: ", err);
  });

// Function to capture video frames and send them to the server
function processVideo() {
  if (video.readyState === video.HAVE_ENOUGH_DATA) {
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const context = canvas.getContext('2d');
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    canvas.toBlob(blob => {
      const formData = new FormData();
      formData.append('image', blob, 'frame.jpg');

      fetch('/analyze', {
        method: 'POST',
        body: formData
      })
      .then(response => response.json())
      .then(data => {
        textBox.textContent = `Emotion: ${data.emotion}`;
      })
      .catch(error => console.error('Error:', error));

    }, 'image/jpeg');

    // Process the next frame
    setTimeout(processVideo, 1000); // Adjust interval as needed
  } else {
    // Retry after a short delay if video not ready
    setTimeout(processVideo, 100);
  }
}
