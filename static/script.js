document.addEventListener("DOMContentLoaded", function() {
    const webcamElement = document.getElementById('webcam');

    // Access the user's webcam
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia({ video: true })
            .then(function(stream) {
                // Assign the webcam stream to the video element's srcObject
                webcamElement.srcObject = stream;
                webcamElement.play(); // Ensure the video plays
            })
            .catch(function(error) {
                console.error("Error accessing the webcam: ", error);
            });
    } else {
        console.error("getUserMedia not supported by this browser.");
    }

    // Handle the 'Analyse' button click event
    const analyseButton = document.getElementById('analyseButton');
    analyseButton.addEventListener('click', function() {
        alert("Analyse button clicked!");
    });
});
