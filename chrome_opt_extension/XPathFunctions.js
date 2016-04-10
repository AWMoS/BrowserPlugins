//Calclulates Xpath of all elements on the page in one shot!

var delimiterElms = "!@E@!";
var delimiterAttribs = "!@AV@!";
var delimiterAttribsType = "!@AT@!";
var delimiterActionAttrib = "!@DAA@!";
var eventsOnEl = ["onclick","ondblclick","ondrag","ondragend","ondragenter","ondragleave",
		  "ondragover","ondragstart","ondrop","onmousedown","onmousemove","onmouseout",
		  "onmouseover","onmouseup","onmousewheel","onscroll","onwheel","onchange"];
function findAllAttribs() {
	var allElms = document.getElementsByTagName('*');
	var allAttribs = "";
	//define attribs
	var curXpath, curType, curName, curTag, curMethod, nType, xpathParentForm, curSelected,handlerTypes;
	curXpath = curType = curName = "";
	for (ie = 0; ie <  allElms.length; ie++) {
		if (allAttribs != "")
			allAttribs = allAttribs + delimiterElms;
		//calculate attribs
		curXpath = getXPath(allElms[ie]);
		if (typeof curXpath == 'undefined' || curXpath == "" || curXpath == null)
			curXpath = "N/A";

		curType = allElms[ie].type;
		if (typeof curType == 'undefined' || curType == "" || curType == null)
			curType = "N/A";		
		curName = allElms[ie].name;
    		if (typeof curName == 'undefined' || curName == "")
		curName = "N/A";
		
		curTag = allElms[ie].tagName;

		curValue = getValue(allElms[ie]);
			
                curMethod = getMethod(allElms[ie]);

                nType     = getNodeType(allElms[ie]); 

                xpathParentForm = findXpathParentFormNode(allElms[ie]);

		curSelected = getSelected(allElms[ie]);
                
               handlerTypes = ElmHasEventHandler(allElms[ie], curXpath);
		//concatenate
		allAttribs = allAttribs + curXpath + delimiterAttribs + curType + delimiterAttribs + curName + delimiterAttribs + isLeaf(allElms[ie]) + delimiterAttribs + isVisible(allElms[ie]) +

			     delimiterAttribs + findElmentDescUsingXPath(curXpath) + delimiterAttribs + getActionableAttrib(allElms[ie]) + delimiterAttribs + curTag + delimiterAttribs + handlerTypes + delimiterAttribs + curValue + delimiterAttribs + curMethod + delimiterAttribs + nType + delimiterAttribs + xpathParentForm + delimiterAttribs + curSelected;

	}//next elemet
	return allAttribs;
}

function isLeaf(node) {
	return (node.childElementCount == 0);
}

/**
 * Calculates the XPath of an element.
 *   1. If the element has an unique 'id' this function will return it as its XPath.
 *   2. If the element has not an unique 'id' the function will check if it has an unique 'className' to be considered as its XPath.
 *   3. If none of (1) and (2) are true then, the function will search for the first parent which has either an unique 'id' or unique 'className'
 *      --- for determining the uniqueness of the 'id' and 'className' the function uses the localName of the element ---
 */
function getXPath(node)
{
	var allElements = document.getElementsByTagName('*'); 
	for (var pathToNode = []; (node != null && node.nodeType == 1); node = node.parentNode) 
	{ 
		if (node == document.body)
		{
			pathToNode.unshift('[body]'); 
			return pathToNode.join('/');
		}
		else
		{
			if (node.id.length > 0) 
			{ 
				var uniqueIdCounter = 0; 
				for (var i=0; i < allElements.length; i++) 
				{ 
					// We know that current node has an id.
					if (allElements[i].id != null && allElements[i].id == node.id)
					{
						if (allElements[i].localName.toLowerCase() == node.localName.toLowerCase())
							uniqueIdCounter++; 
					}
						
					// We will meet the 'node', itself, once.	
					if (uniqueIdCounter > 1) 
						break; 
				} 
				if ( uniqueIdCounter == 1) 
				{ 
					pathToNode.unshift(node.localName.toLowerCase() + '[id=' + node.id + ']'); 
					return pathToNode.join('/'); 
				} 
				else 
				{ 
					for (var i=1, sibling = node.previousSibling; sibling != null; sibling = sibling.previousSibling) 
					{ 
						if (sibling.localName == node.localName)  
							i++; 
					} 
						pathToNode.unshift(node.localName.toLowerCase() + '[' + i + ']'); 
				} 
			} 
			else if (node.className.length > 0) 
			{
				var uniqueClassCounter = 0; 
				for (var i=0; i < allElements.length; i++) 
				{ 
					// We know that current node has a class.
					if (allElements[i].className != null && allElements[i].className.toLowerCase() == node.className.toLowerCase())
					{
						if (allElements[i].localName.toLowerCase() == node.localName.toLowerCase())
							uniqueClassCounter++; 
					}
						
					// We will meet the 'node', itself, once.	
					if (uniqueClassCounter > 1) 
						break; 
				} 
				if ( uniqueClassCounter == 1) 
				{ 
					pathToNode.unshift(node.localName.toLowerCase() + '[class=' + node.className + ']'); 
					return pathToNode.join('/'); 
				}
				else 
				{ 
					for (var i=1, sibling = node.previousSibling; sibling != null; sibling = sibling.previousSibling) 
					{ 
						if (sibling.localName == node.localName)  
							i++; 
					} 
						pathToNode.unshift(node.localName.toLowerCase() + '[' + i + ']'); 
				}
			}
			else 
			{ 
				for (var i=1, sibling = node.previousSibling; sibling != null; sibling = sibling.previousSibling) 
				{ 
					if (sibling.localName == node.localName)  
						i++; 
				} 
					pathToNode.unshift(node.localName.toLowerCase() + '[' + i + ']'); 
			} 
		}
	}
	// If the function is not able to assign any XPath to the element.
	return null;
}


/**
 * Finds the element of the DOM using its XPath if it has either Unique ID or Unique ClassName.
 */
function usingEitherUniqueIDorUniqueCLASSNAME(XPath)
{
	var element;
	var localNameOfCurrentNode = XPath.substring(0, XPath.indexOf("["));
	if (XPath.indexOf('id=') > -1)
	{
		var ID = XPath.substring(localNameOfCurrentNode.length + 4, XPath.indexOf("]"));
		var temporaryTargetElement = document.getElementById(ID);
		if (temporaryTargetElement != null && temporaryTargetElement.localName.toLowerCase() == localNameOfCurrentNode.toLowerCase())
			element = temporaryTargetElement;
		else
		{
			var allElementsWithThisLocalName = document.getElementsByTagName(localNameOfCurrentNode);
			for (var i=0; i<allElementsWithThisLocalName.length; i++)
			{
				if (allElementsWithThisLocalName[i].id != null && allElementsWithThisLocalName[i].id.toLowerCase() == ID.toLowerCase())
				{
					element = allElementsWithThisLocalName[i];
					break;
				}
			}
		}
	}
	else 
	{
		var ClassName = XPath.substring(localNameOfCurrentNode.length + 7, XPath.indexOf("]"));
		var temporaryTargetElement = document.getElementsByClassName(ClassName);
		if (temporaryTargetElement != null && temporaryTargetElement.length == 1 && temporaryTargetElement[0].localName.toLowerCase() == localNameOfCurrentNode.toLowerCase())
			element = temporaryTargetElement[0];
		else
		{
			var allElementsWithThisLocalName = document.getElementsByTagName(localNameOfCurrentNode);
			for (var i=0; i<allElementsWithThisLocalName.length; i++)
			{
				if (allElementsWithThisLocalName[i].className != null && allElementsWithThisLocalName[i].className.toLowerCase() == ClassName.toLowerCase())
				{
					element = allElementsWithThisLocalName[i];
					break;
				}
			}
		}
	}
	return element;
}


/**
 * Finds the element of the DOM using its XPath if it has a parent with an Unique ID.
 */
function usingParentWithUniqueID(XPath, piecesOfXPath)
{
	var targetParent;
	var localNameOfCurrentNode = XPath.substring(0, XPath.indexOf("["));
	var ID = XPath.substring(localNameOfCurrentNode.length + 4, XPath.indexOf("]"));
	var temporaryTargetElement = document.getElementById(ID);
	if (temporaryTargetElement != null && temporaryTargetElement.localName.toLowerCase() == localNameOfCurrentNode.toLowerCase())
		targetParent = temporaryTargetElement;
	else
	{
		var allElementsWithThisLocalName = document.getElementsByTagName(localNameOfCurrentNode);
		for (var i=0; i<allElementsWithThisLocalName.length; i++)
		{
			if (allElementsWithThisLocalName[i].id != null && allElementsWithThisLocalName[i].id.toLowerCase() == ID.toLowerCase())
			{
				targetParent = allElementsWithThisLocalName[i];
				break;
			}
		}
	}
	
	var counterLength = 1;
	for (var element=targetParent.children; (element != null && counterLength < piecesOfXPath.length); element=targetParent.children)
	{
		var counterChildren = 0;
		var localNameOfCurrentNode = piecesOfXPath[counterLength].substring(0, piecesOfXPath[counterLength].indexOf("["));
		var childNumber = piecesOfXPath[counterLength].substring(piecesOfXPath[counterLength].indexOf("[") + 1, piecesOfXPath[counterLength].indexOf("]"));
		for (var j=0; j<element.length; j++)
		{
			if (element[j].localName.toLowerCase() == localNameOfCurrentNode.toLowerCase())
			{
				counterChildren ++;
				if (counterChildren == childNumber)
				{
					targetParent = element[j];
					break;
				}
			}
		}
		counterLength++;
	}
	return targetParent;
}


/**
 * Finds the element of the DOM using its XPath if it has a parent with an Unique CLassName.
 */
function usingParentWithUniqueCLASSNAME(XPath, piecesOfXPath)
{
	var targetParent;
	var localNameOfCurrentNode = XPath.substring(0, XPath.indexOf("["));
	var ClassName = XPath.substring(localNameOfCurrentNode.length + 7, XPath.indexOf("]"));
	var temporaryTargetElement = document.getElementsByClassName(ClassName);
	if (temporaryTargetElement.length == 1 && temporaryTargetElement[0].localName.toLowerCase() == localNameOfCurrentNode.toLowerCase())
		targetParent = temporaryTargetElement[0];
	else
	{
		var allElementsWithThisLocalName = document.getElementsByTagName(localNameOfCurrentNode);
		for (var i=0; i<allElementsWithThisLocalName.length; i++)
		{
			if (allElementsWithThisLocalName[i].className != null && allElementsWithThisLocalName[i].className.toLowerCase() == ClassName.toLowerCase())
			{
				targetParent = allElementsWithThisLocalName[i];
				break;
			}
		}
	}
	
	var counterLength = 1;
	for (var element=targetParent.children; (element != null && counterLength < piecesOfXPath.length); element=targetParent.children)
	{
		var counterChildren = 0;
		var localNameOfCurrentNode = piecesOfXPath[counterLength].substring(0, piecesOfXPath[counterLength].indexOf("["));
		var childNumber = piecesOfXPath[counterLength].substring(piecesOfXPath[counterLength].indexOf("[") + 1, piecesOfXPath[counterLength].indexOf("]"));
		for (var j=0; j<element.length; j++)
		{
			if (element[j].localName.toLowerCase() == localNameOfCurrentNode.toLowerCase())
			{
				counterChildren ++;
				if (counterChildren == childNumber)
				{
					targetParent = element[j];
					break;
				}
			}
		}
		counterLength++;
	}
	return targetParent;
}


/**
 * Finds the element of the DOM using its XPath if it could not be referred using nothing Unique.
 */
function usingBodyAsRoot(piecesOfXPath)
{
	var targetParent = document.getElementsByTagName('body')[0];
	var counterLength = 1;
	for (var element=targetParent.children; (element!=null && counterLength<piecesOfXPath.length); element=targetParent.children)
	{
		var counterChildren = 0;
		var localNameOfCurrentNode = piecesOfXPath[counterLength].substring(0, piecesOfXPath[counterLength].indexOf("["));
		var childNumber = piecesOfXPath[counterLength].substring(piecesOfXPath[counterLength].indexOf("[") + 1, piecesOfXPath[counterLength].indexOf("]"));
		for (var j=0; j<element.length; j++)
		{
			if (element[j].localName.toLowerCase() == localNameOfCurrentNode.toLowerCase())
			{
				counterChildren ++;
				if (counterChildren == childNumber)
				{
					targetParent = element[j];
					break;
				}
			}
		}
		counterLength++;
	}
	return targetParent;
}


/**
 * Finds specific element using its given XPath.
 */
function findElementsUsingXPath(XPath)
{
	var piecesOfXPath = new Array();
	piecesOfXPath = XPath.split("/");
	var targetElement;
	if (piecesOfXPath.length == 1)
	{
		targetElement = usingEitherUniqueIDorUniqueCLASSNAME(piecesOfXPath[0]);
	}
	else
	{
		if (piecesOfXPath[0].indexOf('id=') > -1)
			targetElement = usingParentWithUniqueID(piecesOfXPath[0], piecesOfXPath);
		else if (piecesOfXPath[0].indexOf('class=') > -1)
			targetElement = usingParentWithUniqueCLASSNAME(piecesOfXPath[0], piecesOfXPath);
		else
			targetElement = usingBodyAsRoot(piecesOfXPath);
	}
	return targetElement;
}


function findElmentDesc(elm) {	
	var MAXDESC = 15;
	var Desc = elm.innerHTML;
	//2.2.1	
	if (Desc) {
		if (Desc.length > MAXDESC)
			Desc = Desc.substr(1,MAXDESC);
					 
		return Desc;
	}
	return "N/A";
}

/**
* Find element's description using Xpath
*/
function findElmentDescUsingXPath(XPath) {
	var MAXDESC = 30;
	if (XPath == null)
		return "N/A";
	//1. Try to find element using xpath
	//2.1 if not successfull, return Xpath
	//2.2 if successfull
	//2.2.1 if element has inner return it
	//2.2.2 otherwise, return Xpath
	
	//1.
	var elm = findElementsUsingXPath(XPath);	
	//2.1
	if (!elm) {
		return XPath;
	}
	//2.2
	else {
			var text = elm.textContent;         
			text = text.trim();         
			text = text.replace(/\r?\n/g, "-");            
			text = text.replace(/\s/g, '');            
			text  = elm.tagName + "_" + text;  
 	 		if (text.length > MAXDESC) 			
				text = text.substr(1,MAXDESC)+"..."; 	
			return text;     

	}//else : we have good element!
}


/**
* Find whether the element is visible or not
*/
//Finds style property of an element
function findStyle(elm, prop) {
	var style = window.getComputedStyle(elm, null);
	var propval = style.getPropertyValue(prop);
	return propval;
}

//Whether element 'elm' and all its successors are visible
function isVisibleUptoRoot(elm) {
	var visibility = findStyle(elm, "visibility");
    if (visibility == "hidden") return false;
    if (elm.parentNode.style) {
        return isVisibleUptoRoot(elm.parentNode);
    }
    return true;
		
}

//Whether element 'elm' and all its successors are displayed
function isDisplayedUptoRoot(elm) {
	var display = findStyle(elm, "display");
    if (display == "none") return false;
    if (elm.parentNode.style) {
        return isDisplayedUptoRoot(elm.parentNode);
    }
    return true;
}

//Whether element is hidden input
function isHiddenInput(elm) {
	 if (elm.tagName) {
			var tagName = new String(elm.tagName).toLowerCase();
			if (tagName == "input") {
				if (elm.type) {
					var elmType = new String(elm.type).toLowerCase();
					if (elmType == "hidden") {
						return true;
					}
				}
			}
		}
	return false;
}

//Check visibility of element
function isVisible(elm) {
	if (!isHiddenInput(elm) && isVisibleUptoRoot(elm) && isDisplayedUptoRoot(elm))
		return true;
	else
		return false;
}

//finds actionable attribute of the elements
function getActionableAttrib(node) {  
  href = node.getAttribute("href");   
  _onclick = node.getAttribute("onclick");
  if (href) return "href" + delimiterActionAttrib + href;   
  if (_onclick) return "onclick" + delimiterActionAttrib + _onclick;   
  return "N/A";    
}


//checks whether the element has an event handler or not
function ElmHasEventHandler(el, xpath){
	//check explicitly attached handlers
	var handlerstypes = "";
	for (evi = 0; evi < eventsOnEl.length; evi++)
		if (typeof el[eventsOnEl[evi]] == 'function') {			
			handlerstypes = handlerstypes + "_" + eventsOnEl[evi];
		}	
	//checks it's xpath
	 for(var i = 0; i < _eventListeners.length; i++){
     		var obj = _eventListeners[i];
     		var curXPath = obj.xpath;
		if(xpath === curXPath)
		       handlerstypes = handlerstypes + obj.type + delimiterAttribsType;		
  	}

	//check hrefs!
	if (el.tagName == 'A')
		handlerstypes = handlerstypes + 'click';


	if (handlerstypes == "")
		return "N/A";
	return handlerstypes;
}

//returns the value of the element
function getValue(elm) {
    var val = elm.value;
    if (typeof val == 'undefined' || val == null)
        return 'N/A';
    return val;
}

//returns the method attrib
function getMethod(el) { 
	var meth = el.method;   
	if (meth)     
		return meth;   
	return "N/A"; 
}

// returns the nodeType attribute
function getNodeType(el){
var nty = el.nodeType;   
	if (nty)     
	   return nty;   
	return "N/A"; 
}

//returns XPATH of parent node FORM of an element or N/A
function findXpathParentFormNode(el) {  
  cur = el;   
  while (cur !== null && cur.tagName !== "FORM") {     
    cur = cur.parentNode;   
  }   
  var xpathParentForm = "N/A";
  if (cur != null) {
	var curXpath = getXPath(cur);
	if (typeof curXpath != 'undefined' && curXpath != "" && curXpath != null)
		xpathParentForm = curXpath;
  }

  return xpathParentForm; 
}

//returns whther an element is selected(checked?)
// returns the nodeType attribute
function getSelected(el){
var issel = el.checked;   
	if (typeof issel != 'undefined' && issel != null)     
	   return issel;   
	return false; 
}

