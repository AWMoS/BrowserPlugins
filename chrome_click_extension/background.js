chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab){
  if(tab.status === "complete"){ 
    if (tab.url.includes("https://en.wikipedia.org/wiki/Main_Page")){
      sendLinks(tabId,0);
    }else if(sendLinks.counter < clickSequence.length + 1){
      sendLinks(tabId);
    }
  }
});

var clickSequence = [
  "#n-contents > a",
  "#portal > tbody > tr:nth-child(2) > td > p:nth-child(7) > a:nth-child(1)",
  "#mw-content-text > p:nth-child(15) > a:nth-child(3)",
  "#mw-content-text > p:nth-child(72) > a:nth-child(3)",
  "#mw-content-text > p:nth-child(34) > a:nth-child(1)",
  "#mw-content-text > p:nth-child(14) > a:nth-child(7)",
  "#mw-content-text > p:nth-child(26) > a.mw-redirect",
  "#mw-content-text > table.infobox.vcard > tbody > tr:nth-child(6) > td > div > ul > li:nth-child(2) > a",
  "#mw-content-text > div.hatnote.outlinearticle > a",
  "#mw-content-text > table.vertical-navbox.nowraplinks.plainlist > tbody > tr:nth-child(9) > td > div > ul > li:nth-child(14) > a"
];

function sendLinks(tabId, counter) {
  sendLinks.timer = sendLinks.timer || Date.now();
  sendLinks.counter = sendLinks.counter || counter;
  if(sendLinks.counter < clickSequence.length){
    chrome.tabs.sendMessage(tabId, clickSequence[sendLinks.counter]);
    sendLinks.counter++;
  }else{
    var endTime = Date.now();
    alert("Total run time: " + (endTime - sendLinks.timer) + "ms");
    sendLinks.timer = sendLinks.counter = undefined;
  }
};