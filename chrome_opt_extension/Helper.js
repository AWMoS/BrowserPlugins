	//clicks on the target element by dispatching event
	function ClickOnElement(targetElement) {
			var event = document.createEvent("MouseEvents");
			event.initMouseEvent("click", true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
			targetElement.dispatchEvent(event);
	}
	
	//change on the target element by dispatching event
	function ChangeOnElement(targetElement) {
		var event = document.createEvent("MouseEvents");
		event.initMouseEvent("change", false, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
			targetElement.dispatchEvent(event);
	
	}
	
	function executeChangeEvent(targetElement){
	  targetElement.onchange();
	}

	//Helper function to find hash of any string
	function hashCode(s) {
	  var hash = 0, i, chr, len;
	  if (s.length == 0) return hash;
	  for (i = 0, len = s.length; i < len; i++) {
	    chr   = s.charCodeAt(i);
	    hash  = ((hash << 5) - hash) + chr;
	    hash |= 0; // Convert to 32bit integer
	  }
	  return hash;
	};
	//returns hash of the DOM
	function DomID() {
		var dom = document.body.innerHTML;
		return hashCode(dom);
	}

	/**
 * Decodes all encoded values.
 */
function decodeValue(value)
{
	var decodedValue;	
	
	var piecesOfCurrentValue = value.split('+');
	var currentValue;
	if (piecesOfCurrentValue.length == 1)
		currentValue = piecesOfCurrentValue;
	else
		currentValue = piecesOfCurrentValue.join('%20');
	decodedValue = decodeURIComponent(currentValue);		
return decodedValue;
}

//returns the DOM of the current page
function DOM() {
	return document.body.innerHTML;
}

function setBackgroundColor(targetElement){
targetElement.style.backgroundColor = "brown"; 
}
