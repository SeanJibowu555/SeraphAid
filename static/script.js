document.addEventListener("DOMContentLoaded", function() {
    const webcamElement = document.getElementById('webcam');

    // Check if the webcam element is found
    if (webcamElement) {
        console.log("Webcam element found.");

        // Access the user's webcam
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            navigator.mediaDevices.getUserMedia({ video: true })
                .then(function(stream) {
                    // Assign the webcam stream to the video element's srcObject
                    webcamElement.srcObject = stream;
                    webcamElement.onloadedmetadata = function() {
                        webcamElement.play(); // Ensure the video plays automatically
                    };
                })
                .catch(function(error) {
                    console.error("Error accessing the webcam: ", error);
                });
        } else {
            console.error("getUserMedia not supported by this browser.");
        }
    } else {
        console.error("Webcam element not found.");
    }

    // Handle the 'Analyse' button click event
    const analyseButton = document.getElementById('analyseButton');
    if (analyseButton) {
        analyseButton.addEventListener('click', function() {
            alert("Analyse button clicked!");
        });
    }
});

