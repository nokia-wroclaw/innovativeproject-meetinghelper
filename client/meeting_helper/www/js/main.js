var me = {
	id: undefined,
	chosedRoomToEnter: undefined,
	enteredRoom: undefined
};

/**
 * Funkcje, od których oczekujemy odpowiedzi, wywołujemy,
 * podając w nich jako argument funkcję, która ma zostać wywołana
 * po otrzymaniu oczekiwanych danych.
 */
var main = {
	/**
	 * Robi zdjęcie, wysyła na serwer i wyświetla na wallu.
	 * @param {Number} quality
	 * Jakość wykonywanego zdjęcia z zakresu [1, 100].
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
	 * Pobiera zdjęcie, wysyła na serwer i wyświetla na wallu.
	 * @param {Number} quality
	 * Jakość wykonywanego zdjęcia z zakresu [1, 100].
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
	 * Skanuje kod webserwera, nawiązuje połączenie websocketa i zapisuje zeskanowane dane do inputa.
	 */
	initialQrCode: function() {
		devices.qrCode.scan(function(result) {

			main.setUrl(result);

		}, true);
	},

	/**
	 * Skanuje kod i uruchamia jedynie alerta.
	 */
	scanAnyQrCode: function() {
		devices.qrCode.scan(function(result) {
			alert(result);
		});
	},

	/**
	 * Pobiera dane mac urządzenia i wywołuje z nimi alerta.
	 */
	getMac: function() {
		devices.mac.get(function(result) {
			alert(result);
		});
	},

	/**
	 * Pobiera dane mac urządzenia i wywołuje z nimi alerta.
	 */
	getRooms: function() {
		connection.action.getRooms(function(received) {
			// received zawiera listę elementów, np. {id: 0, name: 'room', folderName: 'room'}
			// instersuje nas id po którym dołączamy i name które wyświetlamy
<<<<<<< HEAD
			storage.showRooms(received);
=======
			main.showRooms(received);
>>>>>>> FETCH_HEAD

		});
	},

	setUrl: function(link) {
		var url = document.getElementById('url');
		url.value = link;
		connection.setUrl(link, function() {
			url.value = link;

			load('login');
		});
	},

	/**
	 * Pobiera dane mac urządzenia i wywołuje z nimi alerta.
	 */
	login: function(login, password) {
		connection.action.login(login, password, function(received) {
			//akcja wykonywana po odpowiedzi serwera
			if (received.name === login) {//gdy jest ok
				me.id = received.id;
				load('rooms');
			}
		}, function(data) {
			alert('Wrong username or password');
		});
	},

	/**
	 * Pobiera dane mac urządzenia i wywołuje z nimi alerta.
	 */
	register: function(login, password, password2) {
		connection.action.register(login, password, password2, function(received) {
			//akcja wykonywana po odpowiedzi serwera
			if (received) {//gdy jest ok
				load('login');
			}
		}, function(data) {
			alert('Login already registered');
		});
	},

	/**
	 * Pobiera dane mac urządzenia i wywołuje z nimi alerta.
	 */
	createRoom: function(roomName) {
		main.choseRoomToEnter();
		connection.action.createRoom(roomName, function(received) {
			var roomId = received.id;
			main.joinRoom(roomId, function(answer) {
				if (answer) {
					alert('Room created');
				} else {
					alert('Creating room failed');
				}
			});
		});
	},

	/**
	 * Dołącza i wchodzi do wybranego pokoju.
	 */
	joinRoom: function(roomId, callb) {
		if (roomId) {
			connection.action.joinRoom(roomId, function(received) {
				if (received) {
					main.choseRoomToEnter(roomId);
				}
				callb(received);
			});
		}
	},

	/**
	 * Ustawia pokój, do którego wejść.
	 */
	choseRoomToEnter: function(chosedRoomToEnter) {
		me.chosedRoomToEnter = chosedRoomToEnter;
	},

	/**
	 * Informuje serwer, że `wchodzi` do pokoju (do którego już wcześniej dołączył).
	 */
	enterRoom: function() {
		var roomId = me.chosedRoomToEnter;
		alert('roomId: ' + roomId);
		if (roomId) {
			connection.socket.enterRoom(roomId);
		} else {
			alert('No room is chosen');
		}
	},

	/**
	 * Skanuje kod, dołącza do pokoju i wchodzi do niego.
	 */
	scanRoomQrCode: function() {
		// skanowanie
		devices.qrCode.scan(function(roomId) {
			// dołączenie do pokoju
			main.joinRoom(roomId, function() {
				main.enterRoom();
			});
		});
<<<<<<< HEAD
=======
	},

	/**
	 * Zapisuje listę pokoi w tablicy oraz wyświetla je na stronie w sekcji serverRooms
	 */
	showRooms: function(receivedRooms) {
		var roomList = document.createElement("select");
		rooms = [];
		for (var room in receivedRooms) {
			rooms.push(receivedRooms[room]);
			var newOption = document.createElement("option");
			newOption.setAttribute("value", receivedRooms[room].name);
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
		dataFromServer[dataFromServer.length] = [dataFromServer.length, data.type, data.data, data.userId];
		data.id = dataFromServer.length-1;
		if (data.type === "photo") {
			main.addNewPhoto(data);
		}
		else if (data.type === "message") {
			main.addNewMessage(data);
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
		main.addCommentBox(data);
	},

	/**
	 * Dodawanie nowych notatek tekstowych jako paragraf
	 */
	addNewMessage: function(data) {
		var message = document.createElement("p");
		message.appendChild(document.createTextNode(data.data));
		var element = document.getElementById('myImageCamera');
		element.appendChild(message);
		main.addCommentBox(data);
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
	 * Funkcja dodaje commentBox pod dodanym elementem (brak implementacji komentarzy)
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
>>>>>>> FETCH_HEAD
	}
};

connection.socket.receive.onEnterRoom = function(data) {
	me.enteredRoom = data;
	load('wall');
};

/**
 * Elementy otrzymane od websocketa obecnie obsługuje się u nas w ten sposób:
 */
connection.socket.receive.onNewMaterial = function(data) {
	alert('new photo: ' + JSON.stringify(data));
<<<<<<< HEAD
        storage.addNewData(data);
=======
        main.addNewData(data);
>>>>>>> FETCH_HEAD
	/*var image = document.getElementById('received');

	image.style.display = 'block';
	image.src = data.data;*/
};

/**
 * Elementy otrzymane od websocketa obecnie obsługuje się u nas w ten sposób:
 */
connection.socket.receive.onNewUser = function(data) {
	if (data.userId === me.id) {
		load('wall');
	}
};

/**
 * Pobranie początkowego adresu MAC.
 */
if (init.ready) {
	devices.mac.get(function(result) {alert(result);}, true);
}
