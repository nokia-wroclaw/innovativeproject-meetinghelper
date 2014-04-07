document.addEventListener("backbutton", backKeyDown, true); 

function backKeyDown() { 
	// Call my back key code here.
	historyObj.back();
}