/**
 * Current status of tab (to check window is loaded).
 */

var tabStatus;

/**
 * List of actions to execute.
 */

var actions;

/**
 * Flag to allow for replay of actions.
 */

var replayActions = false;

/**
 * Current ajax state. If < 0 response pending.
 */

var ajaxState;

/**
 * Deffered object to maintain ajax safe state.
 */

var deferredSafe = $.Deferred();

/**
 * Execute log of browser actions.
 */

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab){
  tabStatus = changeInfo.status;
  if(tabStatus === "complete"){
    if (tab.url.includes("https://en.wikipedia.org/wiki/Main_Page")){
      $.getJSON("log.json", function(json) {
        actions = json.acts;
        replayActions = true;
        clearCache();
        parseActions(tabId, actions, 0);
      });
    }else if(replayActions){
      parseActions(tabId, actions);
    }
  }
});

/**
 * Handle content script communication.
 *
 * @param tabId, functionName
 */

function sendAction(tabId, action){
  chrome.tabs.sendMessage(tabId, action);
}


/**
 * Browser action parser.
 *
 */

function parseActions(tabId, action, counter){
  parseActions.counter = parseActions.counter || counter;

  if(parseActions.counter < actions.length){
    if(actions[parseActions.counter].description.includes("CLICK")){
      var action = {
        "function": "actionClick",
        "functionArgs": [
          actions[parseActions.counter].Xpath
        ]
      }
      parseActions.counter++;
      $.when(deferredSafe.promise()).done(function(){
        sendAction(tabId, action);
      });
    }else if(actions[parseActions.counter].description.includes("LOAD")){
      // var action = {
      //   "function": "actionClick",
      //   "functionArgs": [
      //     actions[parseActions.counter].Xpath
      //   ]
      // }
      // sendAction(tabId, action);
      // parseActions.counter++;
    }
  }else{
    alert("Actions finished executing.");
    parseActions.counter = undefined;
    replayActions = false;
    deferredSafe = $.Deferred();
  }
};

/**
 * Check that page is in a stable ajax state. 
 */

function safeAjaxState(){
  if(ajaxState>-1){
    deferredSafe.resolve();
  }
};

/**
 * Clear chrome cache from date. 
 * 
 * Default date is set to 1 week prior to call.
 *
 */

function clearCache(){
  var millisecondsPerWeek = 1000 * 60 * 60 * 24 * 7;
  var oneWeekAgo = (new Date()).getTime() - millisecondsPerWeek;
  chrome.browsingData.removeCache({"since": oneWeekAgo});
};

/**
 * Ajax listener functions record current
 * ajax request state in the ajaxState variable.
 * 
 * State stable ajax state when ajaxState > -1.
 *
 */

chrome.webRequest.onBeforeRequest.addListener(function(info){ 
    console.log("Ajax - request sent: " + info.url);
    ajaxState = (ajaxState - 1) || 0;
  },
  {
    urls: ["<all_urls>"], 
    types: ["xmlhttprequest"]
});
chrome.webRequest.onCompleted.addListener(function(info){ 
    console.log("Ajax - successful response: " + info.url);
    ajaxState = (ajaxState + 1) || 0;
    safeAjaxState();
  },
  {
    urls: ["<all_urls>"], 
    types: ["xmlhttprequest"]
});
chrome.webRequest.onErrorOccurred.addListener(function(info){ 
    console.log("Ajax - error: " + info.url);
    ajaxState = (ajaxState + 1) || 0;
    safeAjaxState();
  },
  {
    urls: ["<all_urls>"], 
    types: ["xmlhttprequest"]
});