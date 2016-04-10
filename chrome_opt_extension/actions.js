/**
 * Communication with background script.
 */
chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {  
  this[message.function](message.functionArgs);
  sendResponse({function: message.function});
});

 /**
 * Click Action 
 * 
 * @param {Object} args
 */

function actionClick(args){
  var elem = findElementsUsingXPath(args[0]);
  elem.click();
};

/**
 * Field Filling Action
 * 
 * @param {Object} args
 */

function actionFieldFilling(args){
  var actions = args;
  for(var action of actions){
    elem = document.getElementById(action.id);
    
    if(elem.type === "checkbox" || elem.type === "radio"){
      elem.checked = JSON.parse(action.value.toLowerCase());
    }else{
      elem.value = action.value;
    }
  }
};
