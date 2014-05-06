/**
 * Default callback.
 */
 var callback = function(message) {
	//alert(message);
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
	uploadFile: 'materials/sendFile',

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
		note: 'note/',
		user: 'user/',
		rooms: {
			all: 'meetings/list',
			data: 'meetings/data'
		}
	},

	post: {
		mac: 'sendMac',
		login: 'login',
		register: 'register',
		rooms: {
			create: 'meetings/create/',
			join: 'meetings/join/'
		},
		sendNote: 'sendNote'
	}
};

var connectionAnswers = {
	ping: 'PONG'
};

/**
 * Webserver broadcast messages received by client.
 */
var webSocketBroadcast = {
	enterRoom: 'joined',
	newMaterial: 'newMaterial',
	newPhoto: 'newPhoto',
	newUser: 'newUser',
	newComment: 'newComment',
	usersOnline: 'usersOnline'
};

/**
 * Webclient send events.
 */
var webSocketSend = {
	test: 'testWebSocket',
	connectedUsers: 'users/online',
	enterMeeting: 'meetings/enterMeeting'
};