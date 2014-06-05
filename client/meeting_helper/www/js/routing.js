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

	pagesRunAction: new Array(),
	
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
	addTohistoryObj: function(page, ifRun) {
		if (ifRun === undefined) {
			ifRun = true;
		}
		if (page) {
			historyObj.pages.push(page);
			historyObj.pagesRunAction.push(ifRun);
		} else if (historyObj.actualPage && historyObj.actualPage !== "wall" && historyObj.actualPage !== "connection" && historyObj.actualPage !== "connecting") {
			historyObj.pages.push(historyObj.actualPage);
			historyObj.pagesRunAction.push(ifRun);
		}
	},
	/**
	 * @function back
	 * navigates user to earlier page, if window contains index2.html then exits
	 */
	back: function() {
		if (historyObj.pages.length > 0) {
			var route = historyObj.pages.pop();
			var ifRunAction = historyObj.pagesRunAction.pop();
			if (route) {
				load(route, ifRunAction, true);
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
	registerAction: function(type, action, delay, id) {
		if (!routing.memory[type]) {
			routing.memory[type] = {};
		}
		if (id) {
			routing.memory[type][id] = {};
			routing.memory[type][id].action = action;
			routing.memory[type][id].delay = delay;
		} else {
			routing.memory[type].deflt = {};
			routing.memory[type].deflt.action = action;
			routing.memory[type].deflt.delay = delay;
		}
	},

	/**
	 * @function runAction
	 * runs action made by user
	 * @param {function} type
	 * type - current action
	 */
	runAction: function(type, id) {
		if (id) {
			if (routing.memory[type] && routing.memory[type][id] && routing.memory[type][id].action) {
				if (routing.memory[type][id].delay) {
					setTimeout(function() {
						routing.memory[type][id].action();
					}, routing.memory[type][id].delay);
				} else {
					routing.memory[type][id].action();
				}
			}
		} else {
			if (routing.memory[type] && routing.memory[type].deflt && routing.memory[type].deflt.action) {
				if (routing.memory[type].deflt.delay) {
					setTimeout(function() {
						routing.memory[type].deflt.action();
					}, routing.memory[type].deflt.delay);
				} else {
					routing.memory[type].deflt.action();
				}
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
	 * checks if user had made an action or is action id
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
		case "about":
			$( "#content" ).load( "loadAbout.html" );
			break;	
	}
	historyObj.setActualPage(what, ifhistoryObj);

	if (ifAction === true) {
		routing.runAction(what);
	} else if (ifAction) {
		routing.runAction(what, ifAction);
	}
}