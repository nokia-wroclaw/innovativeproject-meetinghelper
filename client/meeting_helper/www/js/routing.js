/**
 * Script for switching contents
 */

// historyObj object
historyObj = {
	actualPage: undefined,

	pages: new Array(),

	setActualPage: function(page) {
		historyObj.actualPage = page;
	},

	addTohistoryObj: function() {
		if (historyObj.actualPage) {
			historyObj.pages.push(historyObj.actualPage);
		}
	},

	back: function() {
		if (historyObj.pages.length > 0) {
			var route = historyObj.pages.pop();
			if (route) {
				load(route, true);
			}
		}
	}
};

function load(what, ifhistoryObj) {
	/*if (historyObj.actualPage === "wall" && what !== "wall") {
		// when we were on wall and want to load other page
		window.location = 'index2.html';
	} else if (historyObj.actualPage !== "wall" && what === "wall") {
		// when we weren't on wall and want to load wall
		window.location = 'loadWall.html';
	}*/
	switch(what) {
		case "connection":
			$( "#content" ).load( "loadConnect.html" );
			break;
		case "login":
			$( "#content" ).load( "loadLogin.html" );
			break;
		case "rooms":
			$( "#content" ).load( "loadRooms.html" );
			break;
		case "registration":
			$( "#content" ).load( "loadRegistration.html" );
			break;
		case "wall":
			$( "#content" ).load( "loadWall.html" );
			break;
	}
	if (!ifhistoryObj) {
		historyObj.addTohistoryObj();
	}
	historyObj.setActualPage(what);
}