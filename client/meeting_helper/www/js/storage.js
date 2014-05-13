/**
 * Part of application responsible for data storage and showing stored data
 */

/**
 * Hash with stored data received from server.
 */
var dataFromServer = [];

/**
 * Hash with stored online users data.
 */
var onlineUsers = [];

/**
 * Hash with stored rooms data.
 */
var rooms = [];

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
	 * Rooms received from server {{Integer} receivedRooms.id, {String} receivedRooms.name, {String} receivedRooms.folderName}.
	 */
	showRooms: function(receivedRooms) {
	/**
	* `roomlist` is an object responsible for storing list of rooms
	*/
		var roomList = document.createElement("select");
		rooms = [];
		for (var room in receivedRooms) {
			rooms.push(receivedRooms[room]);
			var newOption = document.createElement("option");
			newOption.setAttribute("value", receivedRooms[room].id);
			newOption.appendChild(document.createTextNode(receivedRooms[room].name));
			roomList.appendChild(newOption);
		}
		var serverRooms = document.getElementById("serverRooms");
		serverRooms.removeChild(serverRooms.getElementsByTagName("select")[0]);
		serverRooms.appendChild(roomList);
	},

	 /**
	 * @function storage.addCreatedRoom
	 * 
	 * @param {Object} room
	 * Data about just created room.
	 */
	addCreatedRoom: function(room) {
		var roomList = document.getElementById("serverRooms").getElementsByTagName("select")[0];
		var newRoom = document.createElement("option");
		newRoom.setAttribute("value", room.id);
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
		dataFromServer = [];
		for (var data in receivedData) {
			storage.addNewData(receivedData[data]);
		}
	},

	/**
	 * @function storage.addNewData
	 * Add new object to array dataFromServer.
	 * Invoke adding function depends of data type.
	 * @param {Object} data
	 * Data received from server {{Integer} data.id, {Integer} data.userId, {String} data.type, {String} data.data}.
	 */
	addNewData: function(data) {
		dataFromServer.push(data);
		switch (data.type) {
			// Add photo
			case "photo":
				storage.addNewPhoto(data);
				break;
			// Add note
			case "note":
				storage.addNewMessage(data);
				break;
			// Add comment
			case "comment":
				storage.addNewComment(data);
				break;
			// Other option (unknown data)
			default:
				alert("Unknown data received");
		}
	},

	 /**
	 * @function storage.addNewPhoto
	 * Add new photo on web page in section with id 'myImageCamera'.
	 * Invoke function adding comment box.
	 * @param {Object} data
	 * Data forwarded by storage.addNewData.
	 */
	addNewPhoto: function(data) {
		var image = document.createElement("img");
		image.setAttribute("alt", "photo");
		image.setAttribute("style", "display:none;width:90%;margin-left:5%");
		image.setAttribute("align", "center");
		image.style.display = "block";
		image.src = data.data;
		var element = document.getElementById('myImageCamera');
		element.appendChild(image);
		storage.addCommentBox(data.id);
	},

	 /**
	 * @function storage.addNewMessage
	 * Add new note as paragraph on web page in section with id 'myImageCamera'.
	 * @param {Object} data
	 * Data forwarded by storage.addNewData.
	 */
	addNewMessage: function(data) {
		var message = document.createElement("p");
		message.appendChild(document.createTextNode(data.data));
		var element = document.getElementById('myImageCamera');
		element.appendChild(message);
		storage.addCommentBox(data.id);
	},

	/**
	 * @function storage.addNewComment
	 * Add new comment after data with proper id.
	 * @param {Object} data
	 * Data forwarded by storage.addNewData.
	 */
	addNewComment: function(data) {
		var comment = document.getElementById(data.id);
	},
	
	 /**
	 * @function storage.expandCommentBox
	 * After event expand comment box with proper id.
	 * Button 'Submit' will appear.
	 * @param {Integer} id
	 * Id of comment box.
	 */
	expandCommentBox: function(id) {
		var item = document.getElementById(id);
		item.getElementsByTagName("textarea")[0].setAttribute("rows", "3");
		item.appendChild(document.createElement("br"));
		item.appendChild(document.createElement("input"));
		item.getElementsByTagName("input")[0].setAttribute("type", "submit");
		item.getElementsByTagName("input")[0].setAttribute("value", "Submit");
	},
	
	 /**
	 * @function storage.contractCommentBox
	 * After event contract comment box with proper id.
	 * Button 'Submit' will disappear.
	 * @param {Integer} id
	 * Id of comment box.
	 */
	contractCommentBox: function(id) {
		var item = document.getElementById(id);
		item.removeChild(item.getElementsByTagName("br")[0]);
		item.removeChild(item.getElementsByTagName("input")[0]);
		item.getElementsByTagName("textarea")[0].setAttribute("rows", "1");
	},

	 /**
	 * @function storage.addCommentBox
	 * Add comment box after each new data received from server.
	 * @param {Integer} id 
	 * Data id which will be assigned as comment box id.
	 */
	addCommentBox: function(id) {
		var formNode = document.createElement("form");
		formNode.setAttribute("id", id);
		formNode.setAttribute("method", "post");
		var textArea = document.createElement("textarea");
		textArea.setAttribute("cols", "50");
		textArea.setAttribute("rows", "1");
		textArea.setAttribute("placeholder", "Enter your comment here ...");
		textArea.setAttribute("onfocus", "storage.expandCommentBox(" + id + ")");
		textArea.setAttribute("onblur", "storage.contractCommentBox(" + id + ")");
		formNode.appendChild(textArea);
		document.getElementById('myImageCamera').appendChild(formNode);
		document.getElementById('myImageCamera').appendChild(document.createElement("br"));
	},

	 /**
	 * @function storage.setChosedRoomToEnter
	 * Get value of chosen room.
	 * Send this value to main.choseRoomToEnter
	 */
	setChosedRoomToEnter: function() {
		var roomToEnter = document.getElementById('serverRooms').getElementsByTagName('select')[0].value;
		main.choseRoomToEnter(roomToEnter);
	},
	
	 /**
	 * @function storage.setServerAddress 
	 * Set address of the current server in localStorage.
	 * @param {String} serverAddress
	 * Address of the server to store.
	 */
	setServerAddress: function(serverAddress) {
		window.localStorage.setItem("serverAddress", serverAddress);
	},

	 /**
	 * @function storage.getServerAddress
	 * Get from localStorage address of last logged server.
	 * @return 
	 */
	getServerAddress: function() {
		return window.localStorage.getItem("serverAddress");
	},


	 /**
	 * @function storage.setUserLogin
	 * Set login of the current user in localStorage.
	 * @param {String} login
	 * User login to store.
	 */
	setUserLogin: function(login) {
		window.localStorage.setItem("userLogin", login);
	},

	 /**
	 * @function storage.getUserLogin
	 * Get from localStorage login of last used user.
	 */
	getUserLogin: function() {
		return window.localStorage.getItem("userLogin");
	},

	 /**
	 * @function storage.setUserPassword
	 * Set password of the current user in localStorage.
	 * @param {String} password
	 * User password to store.
	 */ 
	setUserPassword: function(password) {
		window.localStorage.setItem("userPassword", password);
	},

	 /**
	 * @function storage.getUserPassword
	 * Get from localStorage password of last used user.
	 */
	getUserPassword: function() {
		return window.localStorage.getItem("userPassword");
	},

	 /**
	 * @function storage.addNewUser
	 * Add new user who have entered into room.
	 * @param {Object} data
	 * New entered user data {{Integer} data.id, {String} data.type, {String} data.data}.
	 */
	addNewUser: function(data) {
		onlineUsers.push(data);
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
	 * Array of currently online users {{Integer} data.id, {String} data.type, {String} data.name, {String} data.data}.
	 */
	getAllOnlineUsers: function(receivedUsers) {
		onlineUsers = [];
		for (var user in receivedUsers)
		{
			onlineUsers.push(receivedUsers[user]);
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
			newUser.appendChild(document.createTextNode(onlineUsers[user].data));
			users.appendChild(newUser);
		}
	}
};
