var dataFromServer = [];

var onlineUsers = [];

var rooms = [];

/**
 * Funkcje zapisujące pobrane z serwera elementy w tablicach
 * i wyświatlające te dane dla użytkownika.
 */
var storage = {
	/**
	 * Zapisuje listę pokoi w tablicy oraz wyświetla je na stronie w sekcji serverRooms
	 */
	showRooms: function(receivedRooms) {
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
	 * Dodawanie nowych danych do tablicy
	 */
	addNewData: function(data) {
		dataFromServer.push(data);
		//dataFromServer[dataFromServer.length] = [dataFromServer.length, data.type, data.data, data.userId];
		//data.id = dataFromServer.length-1;
		switch (data.type) {
			case "photo":
				storage.addNewPhoto(data);
				break;
			case "note":
				storage.addNewMessage(data);
				break;
			case "comment":
				storage.addNewComment(data);
				break;
			default:
				alert("Unknown data received");
		}
	},

	/**
	 * Dodawanie nowych zdjęć
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
		storage.addCommentBox(data);
	},

	/**
	 * Dodawanie nowych notatek tekstowych jako paragraf
	 */
	addNewMessage: function(data) {
		var message = document.createElement("p");
		message.appendChild(document.createTextNode(data.data));
		var element = document.getElementById('myImageCamera');
		element.appendChild(message);
		storage.addCommentBox(data);
	},

	addNewComment: function(data) {
		var comment = document.getElementById(data.id);
	},
	
	/**
	 * Po kliknięciu na commentBox jest rozszerzany i zostaje dodany przycisk "Submit"
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
	 * Utrata focusu przez commentBox cofa w/w zmiany
	 */
	contractCommentBox: function(id) {
		var item = document.getElementById(id);
		item.removeChild(item.getElementsByTagName("br")[0]);
		item.removeChild(item.getElementsByTagName("input")[0]);
		item.getElementsByTagName("textarea")[0].setAttribute("rows", "1");
	},

	/**
	 * Dodaje commentBox pod dodanym elementem (brak implementacji komentarzy)
	 */
	addCommentBox: function(data) {
		var formNode = document.createElement("form");
		formNode.setAttribute("id", data.id);
		formNode.setAttribute("method", "post");
		var textArea = document.createElement("textarea");
		textArea.setAttribute("cols", "50");
		textArea.setAttribute("rows", "1");
		textArea.setAttribute("placeholder", "Enter your comment here ...");
		textArea.setAttribute("onfocus", "main.expandCommentBox(" + data.id + ")");
		textArea.setAttribute("onblur", "main.contractCommentBox(" + data.id + ")");
		formNode.appendChild(textArea);
		document.getElementById('myImageCamera').appendChild(formNode);
		document.getElementById('myImageCamera').appendChild(document.createElement("br"));
	},

	/**
	 * Ustawia zmienną odpowiedzialną za wybór pokoju do wejścia
	 */
	setChosedRoomToEnter: function() {
		var roomToEnter = document.getElementById('serverRooms').getElementsByTagName('select')[0].value;
		main.choseRoomToEnter(roomToEnter);
	},

	/**
	 * Zapisuje adres ostatniego zalogowanego serwera
	 */
	setCurrentServerAddress: function(serverAddress) {
		localStorage.setItem("serverAddress", serverAddress);
	},

	/**
	 * Pobiera adres ostatniego zalogowanego serwera
	 */
	getCurrentServerAddress: function() {
		return localStorage.getItem("serverAddress");
	},

	/**
	 * Zapisuje login ostatnio zalogowanego użytkownika
	 */
	setLastUserLogin: function(login) {
		localStorage.setItem("userLogin", login);
	},

	/**
	 * Pobiera login ostatnio zalogowanego użytkownika
	 */
	getLastUserLogin: function() {
		return localStorage.getItem("userLogin");
	},

	/**
	 * Zapisuje hasło ostatno zalogowanego użytkownika
	 */
	setLastUserPassword: function(password) {
		localStorage.setItem("userPassword", password);
	},

	/**
	 * Pobiera hasło ostatnio zalogowanego użytkownika
	 */
	getLastUserPassword: function() {
		return localStorage.getItem("userPassword");
	},

	/**
	 * Dodaje nowego użytkownika, który wchodzi do pokoju
	 */
	addNewUser: function(data) {
		//onlineUsers[onlineUsers.length] = [data.userId, data.type, data.data];
		onlineUsers.push(data);
	},

	/**
	 * Usuwa użytkownika, gdy opuszcza pokój
	 */
	deleteUser: function(data) {
		//onlineUsers.delete(data.userId);
	},

	/**
	 * Wywoływana po wejściu do pokoju, pobiera wszystkich użytkowników obecnych w pokoju
	 */
	getAllOnlineUsers: function(receivedUsers) {
		onlineUsers = [];
		for (var user in receivedUsers)
		{
			onlineUsers.push(receivedUsers[room]);
		}
	},

	/**
	 * Wyświetla wszysktich użytkowników online w pokoju
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
