chrome.runtime.onMessage.addListener(
  function makeClicks(link, sender, sendResponse) {
    $(document).ready(function(){
      $(link)[0].click();
    });
  });