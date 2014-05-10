/**
 * Script for switching contents
 */

var contains = function(bigger, fragment) {
	return bigger.indexOf(fragment) != -1;
};

// historyObj object
historyObj = {
	actualPage: undefined,

	pages: new Array(),

	setActualPage: function(page) {
		historyObj.actualPage = page;
	},

	addTohistoryObj: function(page) {
		if (page) {
			historyObj.pages.push(page);
		} else if (historyObj.actualPage && historyObj.actualPage !== "wall" && historyObj.actualPage !== "connecting") {
			historyObj.pages.push(historyObj.actualPage);
		}
	},

	back: function() {
		if (historyObj.pages.length > 0) {
			var route = historyObj.pages.pop();
			if (route) {
				load(route, true, true);
			}
		} else if (historyObj.pages.length === 0 && contains(window.location.href, "wall.html")) {
			load("rooms", true, true);
		}
	}
};

var routing = {
	memory: {},
	registerAction: function(type, action) {
		routing.memory[type] = action;
	},
	runAction: function(type) {
		if (routing.memory[type]) {
			routing.memory[type]();
		}
	}
};

function load(what, ifAction, ifhistoryObj) {
	if (what === "rooms" && contains(window.location.href, "wall.html")) {
		// when we were on wall and want to load rooms page
		window.location = 'index2.html';
	} else if (what === "wall" && !contains(window.location.href, "wall.html")) {
		// when we weren't on wall and want to load wall
		window.location = 'wall.html';
	}
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
		case "wallContent":
			$( "#content" ).load( "loadWallContent.html" );
			break;
		case "connecting":
			$( "#content" ).load( "loadWall.html" );
			break;
		case "users":
			$( "#content" ).load( "loadUsers.html" );
			break;
	}
	if (!ifhistoryObj) {
		historyObj.addTohistoryObj();
	}
	historyObj.setActualPage(what);

	if (ifAction) {
		routing.runAction(what);
	}
}