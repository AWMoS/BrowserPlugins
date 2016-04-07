/**
 * Communication with background script.
 */
chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
    this[message.function](message.functionArgs);
});

 /**
 * Click Action 
 * 
 * @param {String} xpath
 */

function actionClick(args){
    var elem = document.evaluate(args[0], document, null, XPathResult.ANY_TYPE, null).iterateNext();
    elem.click();
};

/**
 * Field Filling Action
 * 
 * @param {String} xpath, value
 */

function actionFieldFilling(args){
};