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
		ping: 'ping',
		photos: 'getPhotos',

		/**
		 * Get single photo
		 */
		photo: 'user/',
		user: 'user/',
		rooms: {
			all: 'rooms/list',
			create: 'rooms/create',
			join: 'rooms/join',
			data: 'rooms/data'
		}
	},

	post: {
		mac: 'sendMac',
		login: 'login',
		register: 'register',
		rooms: {
			create: 'rooms/create/' // /room_name -> OK
		}
	}
};

/**
 * Webserver broadcast messages received by client.
 */
var webSocketBroadcast = {
	newPhoto: 'newPhoto',
	newUser: 'newUser',
	newMessage: 'newMessage',
	newComment: 'newComment'
};

/**
 * Webclient send events.
 */
var webSocketSend = {
	test: 'testWebSocket',
	enterRoom: 'enterRoom'
};