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
  var elem = findElementsUsingXPath(args[0]);
  
  if(elem.type === "checkbox" || elem.type === "radio"){
    elem.checked = args[2];
  }else{
    elem.value = args[1];
  }
};
