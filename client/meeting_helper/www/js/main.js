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
			storage.showRooms(received);

		});
	},

	initUrl: function() {
        load('connecting');
        connection.initUrl(function() {
            load('login');
        }, function() {
            load('connection');
        });
	},

	setUrl: function(link) {
        load('connecting');
		var url = document.getElementById('url');
		url.value = link;
		connection.setUrl(link, function() {
			url.value = link;

			load('login');
		}, function() {
			alert('Connection failed');
            load('connection');
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
			if (data) {
				alert(data);
			} else {
				alert('Login already registered');
			}
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

	goToWall: function() {
		if (me.chosedRoomToEnter) {
			window.localStorage.setItem('chosedRoomToEnter', me.chosedRoomToEnter);
			load('wall');
		} else {
			alert('No room is chosen');
		}
	},

	/**
	 * Informuje serwer, że `wchodzi` do pokoju (do którego już wcześniej dołączył).
	 */
	enterRoom: function() {
		var roomId = window.localStorage.getItem('chosedRoomToEnter');
		alert('roomId: ' + roomId);
		if (roomId) {
			me.chosedRoomToEnter = roomId;
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
				main.choseRoomToEnter(roomId);
				main.goToWall();
			});
		});
	}
};

connection.socket.receive.onEnterRoom = function(data) {
	me.enteredRoom = data;
    load('wallContent');
};

/**
 * Elementy otrzymane od websocketa obecnie obsługuje się u nas w ten sposób:
 */
connection.socket.receive.onUsersOnline = function(data) {
	// add new users
};

/**
 * Elementy otrzymane od websocketa obecnie obsługuje się u nas w ten sposób:
 */
connection.socket.receive.onNewUser = function(data) {
	// add new user
};

/**
 * Elementy otrzymane od websocketa obecnie obsługuje się u nas w ten sposób:
 */
connection.socket.receive.onNewPhoto = function(data) {
	alert('new photo: ' + JSON.stringify(data));
    storage.addNewData(data);
};

/**
 * Elementy otrzymane od websocketa obecnie obsługuje się u nas w ten sposób:
 */
connection.socket.receive.onNewNote = function(data) {
	alert('new note: ' + JSON.stringify(data));
    storage.addNewData(data);
};

/**
 * Elementy otrzymane od websocketa obecnie obsługuje się u nas w ten sposób:
 */
connection.socket.receive.onNewComment = function(data) {
	alert('new comment: ' + JSON.stringify(data));
    //tutaj akcja na otrzymanie nowego komentarza
};
