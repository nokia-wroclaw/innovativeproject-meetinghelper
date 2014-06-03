/**
 * Part of application responsible for data storage and showing stored data
 */

/**
 * Hash with stored data received from server.
 */
var dataFromServer = {};

/**
 * Hash with stored online users data.
 */
var onlineUsers = {};

/**
 * Hash with stored rooms data.
 */
var rooms = {};

var actualRoom = undefined;

/**
 * Function which save downloaded data from server in tables
 * and present them for users.
 */
 
/**
 * Object which contain information about current meeting
 */ 
var storage = {

 	/**
	 * @function storage.showRooms
	 * Save rooms in rooms array.
	 * Show stored data on web page in section with id 'serverRooms'.
	 * @param {Array[Object]} receivedRooms
	 * Rooms received from server {{Integer} receivedRooms.id,
	 * 		{String} receivedRooms.name, {String} receivedRooms.folderName}.
	 */
	showRooms: function(receivedRooms) {
	/**
	 * `roomlist` is an object responsible for storing list of rooms
	 */
		var roomList = document.createElement('select');
		rooms = {};
		for (var room in receivedRooms) {
			rooms[receivedRooms[room].id] = receivedRooms[room];
			var newOption = document.createElement('option');
			newOption.setAttribute('value', receivedRooms[room].id);
			newOption.appendChild(document.createTextNode(receivedRooms[room].name));
			roomList.appendChild(newOption);
		}
		var serverRooms = document.getElementById('serverRooms');
		serverRooms.removeChild(serverRooms.getElementsByTagName('select')[0]);
		serverRooms.appendChild(roomList);
	},

	/**
	 * @function storage.addCreatedRoom
	 * 
	 * @param {Object} room
	 * Data about just created room.
	 */
	addCreatedRoom: function(room) {
		var roomList = document.getElementById('serverRooms').getElementsByTagName('select')[0];
		var newRoom = document.createElement('option');
		newRoom.setAttribute('value', room.id);
		newRoom.appendChild(document.createTextNode(room.name));
		roomList.appendChild(newRoom);
		roomList.value = room.id;
	},

	/**
	 * @function storage.addAllRoomData
	 * 
	 * @param {Array[Object]} receivedData
	 * 
	 */
	addAllRoomData: function (receivedData) {
		dataFromServer = {};
		for (var data in receivedData) {
			dataFromServer[receivedData[data].id] = receivedData[data];
		}
	},

	displayRoomData: function() {
		for (var data in dataFromServer) {
			storage.addNewData(dataFromServer[data], true);
		}
	},

	/**
	 * @function storage.addNewData
	 * Add new object to array dataFromServer.
	 * Invoke adding function depends of data type.
	 * @param {Object} data
	 * Data received from server {{Integer} data.id, {Integer} data.userId,
	 * 		{String} data.type, {String} data.data}.
	 */
	addNewData: function(data, displayOnly) {
		if (!displayOnly) {
			dataFromServer[data.id] = data;
		}
		storage.addPost(data);
	},

	/**
	 * @function storage.addPost
	 * Add new photo on web page in section with id 'received'.
	 * Invoke function adding comment box.
	 * @param {Object} data
	 * Data forwarded by storage.addNewData.
	 */
	addPost: function(data) {
		var post = document.createElement('div');
		post.setAttribute('class', 'post');
		post.setAttribute('id', data.id);
		post.appendChild(storage.addPostHeader(data));
		post.appendChild(storage.addPostObject(data));
		post.appendChild(storage.addPostComments(data));
		post.appendChild(storage.addCommentBox(data.id));
		document.getElementById('received').appendChild(post);
	},

	/**
	 * @function storage.addPostHeader
	 *
	 */
	addPostHeader: function(data) {
		var postHeader = document.createElement('div');
		postHeader.setAttribute('class', 'post_header');
		var name = '';
		if (onlineUsers[data.userId]) {
			name = onlineUsers[data.userId].name;
		}
		var text = document.createTextNode('#' + Object.keys(dataFromServer).length +
			' by ' + onlineUsers[data.userId].name + ' ' + data.date);
		postHeader.appendChild(text);
		return postHeader;
	},

	/**
	 * @function storage.addPostObject
	 *
	 */
	addPostObject: function(data) {
		var postObject = document.createElement('div');
		postObject.setAttribute('class', 'post_object');
		switch (data.type) {
			// Add photo
			case 'photo':
				var image = document.createElement('img');
				image.setAttribute('alt', '');
				image.setAttribute('src', data.data);
				image.setAttribute('width', '90%');
				var onClick = "main.goToPhoto('" + data.data + "\')";
				image.setAttribute('onclick', onClick);
				postObject.appendChild(image);
				break;
			// Add note
			case 'note':
				var note = document.createElement('p');
				note.appendChild(document.createTextNode(data.data));
				note.setAttribute('class', 'noteText');
				postObject.appendChild(note);
				break;
			// Add comment
			case 'comment':
				break;
			// Other option (unknown data)
			default:
				alert('Unknown data received');
			}
		return postObject;
	},

	/**
	 * @function storage.addPostComments
	 *
	 */
	addPostComments: function(data) {
		var postComments = document.createElement('div');
		postComments.setAttribute('class', 'post_comments');
		return postComments;
	},
	
	/**
	 * @function storage.expandCommentBox
	 * After event expand comment box with proper id.
	 * Button 'Submit' will appear.
	 * @param {Integer} id
	 * Id of comment box.
	 */
	expandCommentBox: function(id) {
		var formNode = document.getElementById(id).getElementsByTagName('form')[0];
		formNode.getElementsByTagName('textarea')[0].setAttribute('rows', '3');
		formNode.appendChild(document.createElement('br'));
		formNode.appendChild(document.createElement('input'));
		formNode.getElementsByTagName('input')[0].setAttribute('type', 'submit');
		formNode.getElementsByTagName('input')[0].setAttribute('value', 'Submit');
	},
	
	/**
	 * @function storage.contractCommentBox
	 * After event contract comment box with proper id.
	 * Button 'Submit' will disappear.
	 * @param {Integer} id
	 * Id of comment box.
	 */
	contractCommentBox: function(id) {
		var post = document.getElementById(id);
		var formNode = post.getElementsByTagName('form')[0];
		formNode.removeChild(formNode.getElementsByTagName('br')[0]);
		formNode.removeChild(formNode.getElementsByTagName('input')[0]);
		formNode.getElementsByTagName('textarea')[0].setAttribute('rows', '1');
	},

	/**
	 * @function storage.addCommentBox
	 * Add comment box after each new data received from server.
	 * @param {Integer} id 
	 * Data id which will be assigned as comment box id.
	 */
	addCommentBox: function(id) {
		var commentBox = document.createElement('div');
		commentBox.setAttribute('class', 'commentBox');
		var formNode = document.createElement('form');
		formNode.setAttribute('method', 'post');
		var textArea = document.createElement('textarea');
		textArea.setAttribute('style', 'width: 90%;margin-left:5%;');
		textArea.setAttribute('rows', '1');
		textArea.setAttribute('placeholder', 'Enter your comment here ...');
		textArea.setAttribute('onfocus', 'storage.expandCommentBox(' + id + ')');
		textArea.setAttribute('onblur', 'storage.contractCommentBox(' + id + ')');
		formNode.appendChild(textArea);
		commentBox.appendChild(document.createElement('br'));
		commentBox.appendChild(formNode);
		return commentBox;
	},

	/**
	 * @function storage.getSelectedRoomToEnter
	 * Get value of chosen room.
	 * Send this value to main.selectRoomToEnter
	 */
	getSelectedRoomToEnter: function() {
		var roomToEnter = document.getElementById('serverRooms').getElementsByTagName('select')[0].value;
		return roomToEnter;
	},
	
	/**
	 * @function storage.setServerAddress 
	 * Set address of the current server in localStorage.
	 * @param {String} serverAddress
	 * Address of the server to store.
	 */
	setServerAddress: function(serverAddress) {
		window.localStorage.setItem('serverAddress', serverAddress);
	},

	/**
	 * @function storage.getServerAddress
	 * Get from localStorage address of last logged server.
	 * @return 
	 */
	getServerAddress: function() {
		return window.localStorage.getItem('serverAddress');
	},


	/**
	 * @function storage.setUserLogin
	 * Set login of the current user in localStorage.
	 * @param {String} login
	 * User login to store.
	 */
	setUserLogin: function(login) {
		window.localStorage.setItem('userLogin', login);
	},

	/**
	 * @function storage.getUserLogin
	 * Get from localStorage login of last used user.
	 */
	getUserLogin: function() {
		return window.localStorage.getItem('userLogin');
	},

	/**
	 * @function storage.setUserPassword
	 * Set password of the current user in localStorage.
	 * @param {String} password
	 * User password to store.
	 */ 
	setUserPassword: function(password) {
		window.localStorage.setItem('userPassword', password);
	},

	/**
	 * @function storage.getUserPassword
	 * Get from localStorage password of last used user.
	 */
	getUserPassword: function() {
		return window.localStorage.getItem('userPassword');
	},

	/**
	 * @function storage.addNewUser
	 * Add new user who have entered into room.
	 * @param {Object} data
	 * New entered user data {{Integer} data.userId, {String} data.type, {String} data.data}.
	 */
	addNewUser: function(data) {
		onlineUsers[data.userId] = data;
	},

	/**
	 * @function storage.deleteUser
	 * Delete user when leaving room.
	 * @param {Object} data
	 * Data of deleted user.
	 */
	deleteUser: function(data) {
		delete onlineUsers[data.userId];
	},

	/**
	 * @function storage.getAllOnlineUsers
	 * Invoke once after enter into room.
	 * Get all currently online users in entered room
	 * and store this data in onlineUsers array.
	 * @param {Array[Object]} receivedUsers
	 * Array of currently online users {{Integer} data.userId, {String} data.type,
	 * 		{String} data.name, {String} data.data}.
	 */
	getAllOnlineUsers: function(receivedUsers) {
		onlineUsers = {};
		for (var user in receivedUsers)
		{
			onlineUsers[receivedUsers[user].userId] = receivedUsers[user];
		}
	},
	getAllOnlineUsers2: function(receivedUsers) {
		for (var user in receivedUsers)
		{
			onlineUsers[receivedUsers[user].userId] = receivedUsers[user];
		}
	},

	/**
	 * @function storage.showOnlineUsers
	 * Invoke after load page loadUsers.html.
	 * Get all currently online users in room.
	 */
	showOnlineUsers: function() {
		var users = document.getElementById('onlineUsers');
		for (var user in onlineUsers)
		{
			var newUser = document.createElement('div');
			newUser.setAttribute('class', 'user');
			newUser.appendChild(document.createTextNode(onlineUsers[user].name));
			users.appendChild(newUser);
		}
	},

	setRoom: function(room) {
		actualRoom = room;
	},

	getRoom: function() {
		return actualRoom;
	},

	setRoomName: function() {
		var roomPlace = document.getElementById('roomName');
		roomPlace.appendChild(document.createTextNode(actualRoom.name));
		var roomPlace = document.getElementById('roomId');
		roomPlace.appendChild(document.createTextNode(actualRoom.meetingID));
	},

	displayQrCode: function(url) {
		var element = document.getElementById('myQrCode');
		element.data = url;
	},

	initLoginData: function() {
		console.log(storage.getUserLogin() + ' ' + storage.getUserPassword());
		document.getElementById('login').value = storage.getUserLogin();
		document.getElementById('password').value = storage.getUserPassword();
	}
};
