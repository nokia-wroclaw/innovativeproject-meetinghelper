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
	uploadFile: 'sendFile',

	/**
	 * Page to show all files
	 */
 	get: {
		photos: 'getPhotos',

		/**
		 * Get single photo
		 */
		photo: 'user/',
		rooms: 'getRooms',
		roomData: 'getRoomData'
	},

	post: {
		mac: 'sendMac',
		login: 'login',
		register: 'register'
	}
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