
chrome.action.onClicked.addListener(function(tab) {
  chrome.tabs.create({
    // Just use the full URL if you need to open an external page
    url: chrome.runtime.getURL("index.html")
  },() => {
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
      console.log(request)
    });
  });

});
