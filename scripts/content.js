(() => {
  let stream = null;
  let mediaRecorder = null;
  let recordedChunks = [];

  // Listen for messages from the background script
  chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
    if (message.action === "start-capture") {
      const { streamId } = message;
      console.log("Starting capture with streamId:", streamId);

      // Check if getUserMedia is supported
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        console.error("getUserMedia not supported on your browser.");
        return;
      }

      try {
        // Define the constraints for capturing the stream
        const constraints = {
          audio: false,
          video: {
            mandatory: {
              chromeMediaSource: 'desktop',
              chromeMediaSourceId: streamId,
            }
          }
        };
        console.log("Using constraints:", constraints);

        // Log current state before attempting to get the user media stream
        console.log("Before getUserMedia - Stream ID:", streamId);
        console.log("navigator.mediaDevices:", navigator.mediaDevices);
        console.log("navigator.mediaDevices.getUserMedia:", navigator.mediaDevices.getUserMedia);

        // Attempt to get the user media stream
        stream = await navigator.mediaDevices.getUserMedia(constraints);
        console.log("Stream captured:", stream);

        // Initialize MediaRecorder with the captured stream
        mediaRecorder = new MediaRecorder(stream);
        mediaRecorder.ondataavailable = (event) => {
          if (event.data.size > 0) {
            recordedChunks.push(event.data);
          }
        };
        mediaRecorder.start();
        console.log("MediaRecorder started");

      } catch (error) {
        console.error("Error capturing stream:", error);
        console.log("navigator:", navigator);
        console.log("navigator.mediaDevices:", navigator.mediaDevices);
        console.log("Stream ID:", streamId);
        // Additional state information
        console.log("MediaRecorder state:", mediaRecorder?.state);
        console.log("Stream active:", stream?.active);
        console.log("Stream tracks:", stream?.getTracks());
      }
    } else if (message.action === "stop-capture") {
      if (mediaRecorder) {
        mediaRecorder.stop();
        mediaRecorder.onstop = () => {
          const blob = new Blob(recordedChunks, { type: 'video/webm' });
          const url = URL.createObjectURL(blob);

          // HTML template for the new page
          const htmlTemplate = `
          <!DOCTYPE html>
          <html lang="en">
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Recorded Video</title>
            <style>
              body {
                font-family: Arial, sans-serif;
                background-color: #f4f4f4;
                margin: 0;
                padding: 20px;
                text-align: center;
              }
              .container {
                max-width: 800px;
                margin: auto;
                background: white;
                padding: 20px;
                border-radius: 8px;
                box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
              }
              video {
                width: 100%;
                height: auto;
                border: 1px solid #ccc;
                border-radius: 4px;
              }
              .download-link {
                display: block;
                margin-top: 10px;
                color: #007bff;
                text-decoration: none;
              }
              .download-link:hover {
                text-decoration: underline;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <h1>Your Recorded Video</h1>
              <video controls autoplay>
                <source id="video-source" src="${url}" type="video/webm">
                Your browser does not support the video tag.
              </video>
              <a id="download-link" class="download-link" href="${url}" download="recording.webm">Download Video</a>
            </div>
          </body>
          </html>
          `;

          // Open a new tab and write the HTML template into it
          const newTab = window.open();
          newTab.document.write(htmlTemplate);
          newTab.document.close();
          console.log("MediaRecorder stopped and video opened in new tab");
        };
      }
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
        console.log("Stream stopped");
        stream = null;
      }
    }
  });
})();
