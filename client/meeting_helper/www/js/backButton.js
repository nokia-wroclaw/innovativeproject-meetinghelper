document.addEventListener("backbutton", backKeyDown, true); 

function backKeyDown() { 
	// Call my back key code here.
	if (pageHistory.length > 0) {
		var route = pageHistory.pop();
		if (route) {
			load(route, true);
		}
	}
}