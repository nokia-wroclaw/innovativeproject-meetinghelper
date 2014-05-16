var me = {
	id: undefined,
	selectedRoomToEnter: undefined,
	enteredRoom: undefined
};

/**
 * Function from which we demand respond, recall,
 * giving them as parameters functions which need to be recalled
 * after receiving expected data.
 */
var main = {
	/**
	 * @function main.userCallback
	 * Types way of sending action callback to user.
	 * By now it's an alert, but allows easy change.
	 */
	userCallback: function(message) {
		alert(message);
	},

	/**
	 * @function main.takePicture
	 * Take picture then send it to the server and present on a wall
	 * @param {Number} quality
	 * Quality of photos is in range [1, 100].
	 */
	takePicture: function(quality) {
		devices.camera.takePicture(quality, function(imageSrc) {
			connection.file.upload.photo(imageSrc);

			//main.addNewMyData('image', imageSrc);
			//var image = document.getElementById('myImageCamera');
			//image.style.display = 'block';

			//image.src = imageSrc/*"data:image/jpeg;base64," + */;
		});
	},

	/**
	 * @function main.loadPicture
	 * Load picture then send it to the server and present on a wall
	 * @param {Number} quality
	 * Quality of photos is in range [1, 100].
	 */
	loadPicture: function() {
		devices.photoLibrary.take(function(imageSrc) {
			connection.file.upload.photo(imageSrc);

			var image = document.getElementById('myImageCamera');
			image.style.display = 'block';

			image.src = imageSrc/*"data:image/jpeg;base64," + */;
		});
	},

	/**
	 * @function main.initialQrCode
	 * Scan QR Code of webmaster, get connection of websocket and save scaned data to input
	 */
	initialQrCode: function() {
		devices.qrCode.scan(function(result) {

			main.setUrl(result);

		}, true);
	},

	/**
	 * @function main.getMac
	 * Download data of device mac and recall with this mac an alert
	 */
	getMac: function() {
		devices.mac.get(function(result) {
			alert(result);
		});
	},

	/**
	 * @function main.getRooms
	 * Download data of rooms
	 */
	getRooms: function() {
		connection.action.getRooms(function(received) {
			// received zawiera listę elementów, np. {id: 0, name: 'room', folderName: 'room'}
			// instersuje nas id po którym dołączamy i name które wyświetlamy
			if (received.length > 0) {
				main.selectRoomToEnter(received[0].id);
			}
			storage.showRooms(received);

		});
	},

	/**
	 * @function main.initUrl
	 * Initialize url
	 */
	initUrl: function() {
		load('connecting');
		connection.initUrl(function() {
			connection.action.home(function(data) {
				if (data.id) {
					historyObj.addTohistoryObj('login');
					load('rooms', true);
				} else {
					load('login', true);
				}
			});
        }, function() {
            load('connection');
        });
	},
	 
	/**
	 * @function main.initSocket
	 * Initialize socket
	 */
	initSocket: function() {
		load('wall');
		connection.socket.init(function() {
			connection.state = connection.states.established;
		}, function() {
			// Here we do not have to type second argument, because
			// It changes *.html page and this new page loads rooms with argument.
			load('rooms');
		});
		connection.socket.ping();
	},

	/**
	 * @function main.setUrl
	 * Set url to login
	 * @param {String} link
	 * link to login
	 */
	setUrl: function(link) {
        load('connecting');
		if (!(link.substring(link.length - 5) === '/api/')) {
			if (link.substring(link.length - 4) === '/api') {
				link = link + '/';
			} else if (link.substring(link.length - 1) === '/') {
				link = link + 'api/';
			} else {
				link = link + '/api/';
			}
		}

		var url = document.getElementById('url');
		url.value = link;
		connection.setUrl(link, function() {
			url.value = link;

			load('login', true);
		}, function() {
            load('connection', true);
		});
	},

	/**
	 * @function main.login
	 * Login to system
	 * @param {String} login
	 * user login
	 * @param {String} password
	 * user password
	 */
	login: function(login, password) {
		connection.action.login(login, password, function(received) {
			if (received.name === login) {//when everything is correct
				me.id = received.id;
				storage.setUserLogin(login);
				storage.setUserPassword(password);
				load('rooms', true);
			}
		}, function(data) { //in case of wrong input data
			main.userCallback('Wrong username or password');
		});
	},

	/**
	 * @function main.login
	 * Register in system
	 * @param {String} login
	 * user login
	 * @param {String} password
	 * user password
	 * @param {String} password2
	 * user password (confirmation)
	 */
	register: function(login, password, password2) {
		connection.action.register(login, password, password2, function(received) {
			if (received) {//when everything is correct
				load('login', true);
			}
		}, function(data) {//in case of wrong input data or data already exist in database
			if (data) {
				main.userCallback(data);
			} else {
				main.userCallback('Login already registered');
			}
		});
	},

	/**
	 * @function main.createRoom
	 * Create room
	 * @param {String} roomName
	 * Name of the room which user want to createElement
	 */
	createRoom: function(roomName) {
		main.selectRoomToEnter();
		connection.action.createRoom(roomName, function(received) {
			var roomId = received.id;
			console.log(JSON.stringify(received));
			main.joinRoom(received, function(answer) {
				callback(answer);
				if (answer) {
					main.userCallback('Room successfully created');
				} else {
					main.userCallback('Creating room failed');
				}
			});
		});
	},


	/**
	 * @function main.joinRoom
	 * Join and enter to current room
	 * @param {int} roomId
	 * ID of current room
	 * @param {} callb
	 */
	joinRoom: function(roomId, callb) {
		if (roomId) {
			connection.action.joinRoom(roomId.id, function(received) {
				if (received) {
					storage.addCreatedRoom(roomId);
					if (callb) {
						callb(received);
					}
				}
			});
		}
	},

	/**
	 * @function main.joinRoomById
	 * Join and and go to wall of typed room
	 * @param {int} roomId
	 * ID of selected room
	 */
	joinRoomById: function(roomId) {
		main.joinRoom({id: roomId, name: 'already typed room'}, function(answer) {
			main.goToWall();
		});
	},

	/**
	 * @function main.selectRoomToEnter
	 * Set room to which one user want to join
	 * @param {int} selectRoomToEnter
	 * User chosen room
	 */
	selectRoomToEnter: function(selectedRoomToEnter) {
		me.selectedRoomToEnter = selectedRoomToEnter;
	},

	/**
	 * @function main.goToWall
	 * Move to wall view
	 */
	goToWall: function() {
		var roomToEnter = storage.getSelectedRoomToEnter();
		main.selectRoomToEnter(roomToEnter);
		if (me.selectedRoomToEnter) {
			window.localStorage.setItem('selectedRoomToEnter', me.selectedRoomToEnter);
			load('wall');
		} else {
			main.userCallback('No room is selected');
		}
	},

	/**
	 * @function main.goToOnlineUsers
	 * Present list of online users
	 */
	goToOnlineUsers: function() {
		load('users', true);
	},

	/**
	 * @function main.enterRoom
	 * Inform the server that user enter to already joined room.
	 * Runned on the wall page, after receiving ping answer.
	 */
	enterRoom: function() {
		var roomId = window.localStorage.getItem('selectedRoomToEnter');
		if (roomId) {
			me.selectedRoomToEnter = roomId;
			connection.socket.enterRoom(roomId);
		} else {
			main.userCallback('No room is selected');
		}
	},

	/**
	 * @function main.scanRoomQrCode
	 * Scan QR code to current room and join this room.
	 * Immediately goes to wall.
	 */
	scanRoomQrCode: function() {
		// scan
		devices.qrCode.scan(function(roomId) {
			main.joinRoomById(roomId);
		});
	},

	/**
	 * @function main.getRoomData
	 * Download all of current room data
	 */
	getRoomData: function() {
		connection.action.getRoomData(function(data) {
			callback('getRoomData' + JSON.stringify(data));
			storage.addAllRoomData(data);
		});
	}
};

/**
 * @function routing.registerAction
 * Get rooms
 * Get room data (wall)
 * Present wall data
 */
routing.registerAction('rooms', function() {
	main.getRooms();
});
routing.registerAction('wall', function() {
	// Here should be displaying room name from storage
	// (which was set in connection.socket.receive.onEnterRoom())

	connection.socket.getConnectedUsers();
	main.getRoomData();

    load('wallContent', true);
});
routing.registerAction('wallContent', function() {
	//storage.* - action of setting view after changing view
	// to set it again
});
routing.registerAction('users', function() {
	storage.showOnlineUsers();
});
routing.registerAction('login', function() {
	//storage.initLoginData
});
routing.registerAction('connection', function() {
	// we can add here any additional connection information
	// to connection page
	main.userCallback('Connection failed');
});

/**
 * @function connection.socket.receive.onEnterRoom
 * Load wall to get data while user entered the current room
 * @param {int, String} data
 * Data consists of meetingID and name
 */
connection.socket.receive.onEnterRoom = function(data) {
	// Here we should assign data to storage
	me.enteredRoom = data;
	load('wall', true);
};

/**
 * @function connection.socket.receive.onPing
 * Get data while user Ping
 */
connection.socket.receive.onPing = function() {
    main.enterRoom();
};

/**
 * Elements received from websocket is supported by functions below:
 */
/**
 * @function connection.socket.receive.onUsersOnline
 * Add new user to OnlineUsers
 * @param {} data 
 * Data which contain user data
 */
connection.socket.receive.onUsersOnline = function(data) {
	callback('onUsersOnline ' + JSON.stringify(data));
	storage.getAllOnlineUsers(data);
	// add new users
};

/**
 * @function connection.socket.receive.onNewUser
 * Alert about new user online
 * @param {} data 
 * Data which contain user data
 */
connection.socket.receive.onNewUser = function(data) {
	callback('onNewUser ' + JSON.stringify(data));
	storage.addNewUser(data);
	// add new user
};

/**
 * @function connection.socket.receive.onRemoveUser
 * Delete user from OnlineUsers list
 * @param {} data 
 * Data which contain user data
 */
connection.socket.receive.onRemoveUser = function(data) {
	callback('onRemoveUser ' + JSON.stringify(data));
	storage.deleteUser(data);
	// remove user
};

/**
 * @function connection.socket.receive.onNewPhoto
 * Alert about new photo
 * @param {} data 
 * Data which contain information about photo
 */
connection.socket.receive.onNewPhoto = function(data) {
	callback('onNewPhoto: ' + JSON.stringify(data));
    storage.addNewData(data);
};

/**
 * @function connection.socket.receive.onNewNote
 * Alert about new note
 * @param {} data 
 * Data which contain information about note
 */
connection.socket.receive.onNewNote = function(data) {
	callback('onNewNote: ' + JSON.stringify(data));
    storage.addNewData(data);
};

/**
 * @function connection.socket.receive.onNewComment
 * Alert about new comment
 * @param {} data 
 * Data which contain information about comment
 */
connection.socket.receive.onNewComment = function(data) {
	callback('onNewComment: ' + JSON.stringify(data));
	storage.addNewData(data);
    // add new comment
};
