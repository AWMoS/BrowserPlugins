/**
 * List of actions to execute.
 */

var actions = [];

/**
 * Current ajax state. If < 0 response pending.
 */

var webRequestState = 0;

/**
 * Current status of window.
 */

var windowLoaded = true;

/**
 * Execute log of browser actions.
 */
chrome.commands.onCommand.addListener(function(command) {
  console.log('Command:', command);
  $.getJSON("ActionQueue.json", function(json) {
    actions = json; 
    chrome.tabs.query({currentWindow: true, active : true},function(tabs){
      safeState(parseActions, tabs[0].id);
    });
  });
});

/**
 * Handle content script communication.
 *
 * @param tabId, functionName
 */

function sendAction(tabId, action){
  chrome.tabs.sendMessage(tabId, action, function(response) {
    console.log(response);
    safeState(parseActions, tabId);
  });
}

// chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab){
//   if(tab.status === "complete" && actions.length>0){
//     parseActions(tabId, actions);
//   }
// });

/**
 * Browser action parser.
 *
 */

function parseActions(tabId){
  var nextAction = actions.shift();
  if((nextAction !== undefined)){
    if(nextAction.description.includes("CLICK")){
      var action = {
        "function": "actionClick",
        "functionArgs": [
          nextAction.Xpath
        ]
      }
      sendAction(tabId, action);
    }else if(nextAction.description.includes("LOAD")){
      clearCache();
      chrome.tabs.update(tabId, {url: nextAction.URL}, function(tab){
        safeState(parseActions, tabId);
      });
    }else if(nextAction.description.includes("FIELD")){
      var action = {
        "function": "actionFieldFilling",
        "functionArgs": [
          nextAction.Xpath
        ]
      }
      sendAction(tabId, action);
    }
  }else{
    chrome.tabs.executeScript(tabId, {code: 'alert("Chrome Extension - Finished executing current actions.");'});
  }
};

/**
 * Block until safe. 
 */

function safeState(callback,tabId){
  setTimeout(function(){
    if(!isSafe()){
      setTimeout(function(){
        safeState(callback,tabId);
      },10);
    }else{
      callback(tabId);
    }
  },225);
}

/**
 * Check that page is in a safe execution state. 
 */

function isSafe(){
  return ((webRequestState > -1) && (windowLoaded));
}

/**
 * Clear chrome cache from date. 
 *
 */

function clearCache(){
  chrome.browsingData.removeCache({});
};

/**
 * Web navigation listeners record 
 * request state of window loaded.
 */

chrome.webNavigation.onBeforeNavigate.addListener(function(info){ 
    console.log("Window navigating.");
    windowLoaded = false;
});

chrome.webNavigation.onCompleted.addListener(function(info){ 
    console.log("Window Loaded.");
    windowLoaded = true;
}); 
  
/**
 * Web request listeners record 
 * request state in the webRequestState variable.
 * 
 * Stable state when webRequestState > -1.
 *
 */

chrome.webRequest.onBeforeRequest.addListener(function(info){ 
    console.log(info.type + " - request sent: " + info.url);
    webRequestState = webRequestState - 1;
  },
  {
    urls: ["<all_urls>"], 
    types: ["main_frame", "sub_frame", "stylesheet", "script", "image", "object", "xmlhttprequest", "other"]
});
chrome.webRequest.onCompleted.addListener(function(info){ 
    console.log(info.type + " - success: " + info.url);
    webRequestState = webRequestState + 1;
    if (webRequestState>0) { webRequestState = 0};
  },
  {
    urls: ["<all_urls>"], 
    types: ["main_frame", "sub_frame", "stylesheet", "script", "image", "object", "xmlhttprequest", "other"]
});
chrome.webRequest.onErrorOccurred.addListener(function(info){ 
    console.log(info.type + " - error: " + info.url);
    webRequestState = webRequestState + 1;
    if (webRequestState>0) { webRequestState = 0};
  },
  {
    urls: ["<all_urls>"], 
    types: ["main_frame", "sub_frame", "stylesheet", "script", "image", "object", "xmlhttprequest", "other"]
});