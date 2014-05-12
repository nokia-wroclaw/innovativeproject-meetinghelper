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
			if (received.length > 0) {
				main.choseRoomToEnter(received[0].id);
			}
			storage.showRooms(received);

		});
	},

	initUrl: function() {
		load('connecting');
		connection.initUrl(function() {
			connection.action.home(function(data) {
				if (data.id) {
					historyObj.addTohistoryObj('login');
					load('rooms', true);
				} else {
					load('login');
				}
			});
        }, function() {
            load('connection');
        });
	},

	initSocket: function() {
		load('wall');
        connection.socket.init(function() {
        	connection.state = connection.states.established;
        }, function() {
            load('rooms');
        });
        connection.socket.ping();
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
				load('rooms', true);
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
				if (callb) {
					callb(received);
				}
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

	goToOnlineUsers: function() {
		load('users', true);
	},

	/**
	 * Informuje serwer, że `wchodzi` do pokoju (do którego już wcześniej dołączył).
	 */
	enterRoom: function() {
		var roomId = window.localStorage.getItem('chosedRoomToEnter');
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
				main.goToWall();
			});
		});
	},

	getRoomData: function() {
		connection.action.getRoomData(function(data) {
			alert('getRoomData' + JSON.stringify(data));
			//obsłużenie odbioru wszystkich danych
		});
	}
};

routing.registerAction('rooms', function() {
	main.getRooms();
});
routing.registerAction('wall', function() {
	connection.socket.getConnectedUsers();
	main.getRoomData();

    load('wallContent', true);
});
routing.registerAction('wallContent', function() {
	//storage.coś - akcje ustawiające wygląd po przełączeniu widoku
	// w celu jego ponownego ustawienia
});
routing.registerAction('users', function() {
	storage.showOnlineUsers();
});

connection.socket.receive.onEnterRoom = function(data) {
	// data consists of: meetingID, name
	me.enteredRoom = data;
	load('wall', true);
};

connection.socket.receive.onPing = function() {
    main.enterRoom();
};

/**
 * Elementy otrzymane od websocketa obecnie obsługuje się u nas w ten sposób:
 */
connection.socket.receive.onUsersOnline = function(data) {
	alert('onUsersOnline ' + JSON.stringify(data));
	storage.getAllOnlineUsers(data);
	// add new users
};

connection.socket.receive.onNewUser = function(data) {
	alert('onNewUser ' + JSON.stringify(data));
	storage.addNewUser(data);
	// add new user
};

connection.socket.receive.onRemoveUser = function(data) {
	alert('onRemoveUser ' + JSON.stringify(data));
	storage.deleteUser(data);
	// remove user
};

connection.socket.receive.onNewPhoto = function(data) {
	alert('onNewPhoto: ' + JSON.stringify(data));
    storage.addNewData(data);
};

connection.socket.receive.onNewNote = function(data) {
	alert('onNewNote: ' + JSON.stringify(data));
    storage.addNewData(data);
};

connection.socket.receive.onNewComment = function(data) {
	alert('onNewComment: ' + JSON.stringify(data));
	storage.addNewData(data);
    // add new comment
};
