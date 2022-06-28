chrome.action.onClicked.addListener(function(tab) {
  chrome.tabs.create({
    url: chrome.runtime.getURL("index.html")
  },() => {
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
      console.log(request)
    });
  });
});
