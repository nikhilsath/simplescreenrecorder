let stream = null;

chrome.runtime.onInstalled.addListener(() => {
  chrome.action.setBadgeText({
    text: "OFF",
  });
  console.log("Extension installed and badge text set to OFF");
});

chrome.action.onClicked.addListener(async (tab) => {
  console.log("Action button clicked. Tab URL:", tab.url);

  // Retrieve the action badge to check if the extension is 'ON' or 'OFF'
  const prevState = await chrome.action.getBadgeText({ tabId: tab.id });
  console.log("Previous badge state:", prevState);
  
  // Next state will always be the opposite
  const nextState = prevState === 'ON' ? 'OFF' : 'ON';
  console.log("Next badge state:", nextState);

  // Set the action badge to the next state
  await chrome.action.setBadgeText({
    tabId: tab.id,
    text: nextState,
  });
  console.log("Badge text set to:", nextState);

  if (nextState === "ON") {
    // Insert the CSS file when the user turns the extension on
    try {
      await chrome.scripting.insertCSS({
        files: ["focus-mode.css"],
        target: { tabId: tab.id },
      });
      console.log("CSS inserted successfully");

      // Trigger the desktop capture API
      chrome.desktopCapture.chooseDesktopMedia(["tab", "window", "screen"], tab, (streamId) => {
        if (streamId) {
          console.log("Stream ID:", streamId);
          
          // Ensure the content script is loaded before sending a message
          chrome.scripting.executeScript({
            target: { tabId: tab.id },
            files: ["scripts/content.js"] // Correct path to content.js
          }).then(() => {
            chrome.tabs.sendMessage(tab.id, { action: "start-capture", streamId });
          }).catch(err => console.error("Failed to execute script:", err));
        } else {
          console.log("User canceled the media picker");
        }
      });
    } catch (error) {
      console.error("Failed to insert CSS:", error);
    }
  } else {
    // Remove the CSS file when the user turns the extension off
    try {
      await chrome.scripting.removeCSS({
        files: ["focus-mode.css"],
        target: { tabId: tab.id },
      });
      console.log("CSS removed successfully");

      // Send message to content script to stop capture
      chrome.scripting.executeScript({
        target: { tabId: tab.id },
        files: ["scripts/content.js"] // Correct path to content.js
      }).then(() => {
        chrome.tabs.sendMessage(tab.id, { action: "stop-capture" });
      }).catch(err => console.error("Failed to execute script:", err));
    } catch (error) {
      console.error("Failed to remove CSS:", error);
    }
  }
});
