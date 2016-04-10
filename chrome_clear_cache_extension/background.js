chrome.commands.onCommand.addListener(function(command) {
  console.log('Command:', command);
  var millisecondsPerWeek = 1000 * 60 * 60 * 24 * 7;
  var oneWeekAgo = (new Date()).getTime() - millisecondsPerWeek;
  chrome.browsingData.removeCache({"since": oneWeekAgo});
});