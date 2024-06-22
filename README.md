
# Screen Recorder Chrome Extension

## Overview
This is a simple Chrome extension for screen recording. It allows users to start and stop recording their screen directly from the browser.

## Project Structure
```
chrome-extension/
├── background.js
├── icons/
│   ├── alarm-clock.png
│   ├── convert_icons.py
│   ├── icon128.png
│   ├── icon16.png
│   ├── icon32.png
│   └── icon48.png
├── manifest.json
├── popup.html
├── popup.js
└── scripts/
    └── content.js
```

## Development Plan

### Next Steps
1. **Improve Video Player**
   - Enhance the styling and functionality of the video player displaying recorded videos.

2. **Remove Chrome "Stop Sharing"**
   - Implement a feature to remove the default Chrome "Stop Sharing" prompt.

3. **Add Popup UI**
   - Create `popup.html` with Start and Stop buttons.
   - Create `popup.js` to handle button events and communicate with `background.js`.

4. **Add Notifications**
   - Implement notification function in `background.js` to notify users of recording status.

5. **Link to Drive**
   - Integrate Google Drive API to upload recorded videos directly to the user's Drive.

6. **Improve HTML Page for Video Recordings**
   - Enhance the styling and functionality of the page displaying recorded videos.

7. **Add Video Editing Capabilities**
   - Integrate basic video editing features like trimming and cutting within the extension.

## Getting Started

### Prerequisites
- Chrome Browser
- Basic understanding of JavaScript and Chrome Extensions

### Installation
1. Clone the repository.
2. Open Chrome and navigate to `chrome://extensions/`.
3. Enable "Developer mode" in the top right corner.
4. Click "Load unpacked" and select the cloned repository folder.

### Usage
1. Click the extension icon in the toolbar.
2. Use the popup to start and stop recording.
3. The recorded video will open in a new tab upon stopping.

## Contributing
Feel free to fork this repository and submit pull requests. Any improvements and bug fixes are welcome.

## License
This project is licensed under the MIT License.
