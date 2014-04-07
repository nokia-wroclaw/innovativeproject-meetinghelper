/**
 * Script for switching contents
 */

// Memory of previous pages
var actualPage;
var pageHistory = new Array();

function load(what, ifHistory) {
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
	if (!ifHistory) {
		if (actualPage) {
			pageHistory.push(actualPage);
		}
	}
	actualPage = what;
}