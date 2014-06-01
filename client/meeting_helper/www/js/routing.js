/**
 * Script for switching contents
 */
	/**
	 * @function routing.contains
	 * checks if current URL is the same
	 * @param {function} bigger
	 * current URL
	 * @param {function} fragment
	 * defines page to check if is the same
	 */
var contains = function(bigger, fragment) {
	return bigger.indexOf(fragment) != -1;
};

	 /**
	* Defines current navigation between sites
	*/
historyObj = {
	actualPage: undefined,

	pages: new Array(),
	
	/**
	 * @function setActualPage
	 * sets actual page if different than current
	 * @param {function} page
	 * page to be set as current
	 * @param {function} ifhistoryObj
	 * checks if page was used before
	 */
	setActualPage: function(page, ifhistoryObj) {
		if (!ifhistoryObj && historyObj.actualPage !== page) {
			historyObj.addTohistoryObj();
		}
		historyObj.actualPage = page;
	},
	/**
	 * @function addTohistoryObj
	 * adds page to historyObj
	 * @param {function} page
	 * page to be added to historyObj
	 */
	addTohistoryObj: function(page) {
		if (page) {
			historyObj.pages.push(page);
		} else if (historyObj.actualPage && historyObj.actualPage !== "wall" && historyObj.actualPage !== "connection" && historyObj.actualPage !== "connecting") {
			historyObj.pages.push(historyObj.actualPage);
		}
	},
	/**
	 * @function back
	 * navigates user to earlier page, if window contains index2.html then exits
	 */
	back: function() {
		if (historyObj.pages.length > 0) {
			var route = historyObj.pages.pop();
			if (route) {
				load(route, true, true);
			}
		} else if (historyObj.pages.length === 0 && contains(window.location.href, "wall.html")) {
			load("rooms", true, true);
		} else if (historyObj.pages.length === 0 && contains(window.location.href, "index2.html")) {
			devices.action.exit();
		}
	}
};
	/**
	* Reacts when action is made by user
	*/
var routing = {
	memory: {},
	/**
	 * @function registerAction
	 * registers actions made by user
	 * @param {function} action
	 * action made by user
	 */
	registerAction: function(type, action, delay) {
		routing.memory[type] = {};
		routing.memory[type].action = action;
		routing.memory[type].delay = delay;
	},
	/**
	 * @function runAction
	 * runs action made by user
	 * @param {function} type
	 * type - current action
	 */
	runAction: function(type) {
		if (routing.memory[type].action) {
			if (routing.memory[type].delay) {
				setTimeout(function() {
					routing.memory[type].action();
				}, routing.memory[type].delay);
			} else {
				routing.memory[type].action();
			}
		}
	}
};
	/**
	 * @function load
	 * loads content that is set to current user action
	 * @param {function} what
	 * defines current user case
	 * @param {function} ifAction
	 * checks if user had made an action
	 * @param {function} ifhistoryObj
	 * checks if page was used before
	 */
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
		case "qrCode":
			$( "#content" ).load( "loadQrCode.html" );
			break;
		case "addNote":
			$( "#content" ).load( "loadNote.html" );
			break;
		case "photo":
			$( "#content" ).load( "loadPhoto.html" );
			break;
	}
	historyObj.setActualPage(what, ifhistoryObj);

	if (ifAction) {
		routing.runAction(what);
	}
}