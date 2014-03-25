/**
 * Default callback.
 */
 var callback = function(message) {
	alert(message);
	console.log(message);
 };

/**
 * Webserver links.
 */
 var connectionLinks = {
	/**
	 * Initial page
	 */
	hello: '',

	/**
	 * Page to send file
	 */
	sendFile: 'sendFile',

	/**
	 * Page to show all files
	 */
	getPhotos: 'getPhotos',

	/**
	 * Get single photo
	 */
	getPhoto: 'user/'
};

/**
 * Webserver broadcast messages received by client.
 */
var webSocketBroadcast = {
	newPhoto: 'newPhoto'
};

/**
 * Webclient send events.
 */
var webSocketSend = {
	test: 'testWebSocket'
};