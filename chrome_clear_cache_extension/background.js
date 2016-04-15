chrome.commands.onCommand.addListener(function(command) {
  console.log('Command:', command);
  chrome.browsingData.removeCache({});
});

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab){
  if(tab.status === "complete"){ 
    if (tab.url.includes("chrome://cache")){
      chrome.browsingData.removeCache({});
    }
  }
});