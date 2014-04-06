var t_serverData = {
	totalRecords: 0,
	data: []
};

var t_myData = {
        data: []
};

var t_onlineUser = {
	numberOfOnlineUsers: 0,
        user: []
	/*id: [],
	name: [],
	surname: [],
	login: []*/
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

                        main.addNewMyData('image', imageSrc);
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
			var url = document.getElementById('url');
			url.value = result;
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
			alert(received);
		});
	},

	/**
	 * Pobiera dane mac urządzenia i wywołuje z nimi alerta.
	 */
	login: function(login, password) {
		connection.action.login(login, password, function(received) {
			alert(received);
		});
	},

	/**
	 * Pobiera dane mac urządzenia i wywołuje z nimi alerta.
	 */
	register: function(login, password, password2) {
		connection.action.register(login, password, password2, function(received) {
			alert(received);
		});
	},

	/**
	 * Pobiera dane mac urządzenia i wywołuje z nimi alerta.
	 */
	createRoom: function(room) {
		connection.action.createRoom(room, function(received) {
			alert(received);
			var roomId = JSON.parse(received).data.id;
			var input = document.getElementById('roomId');
			input.value = roomId;
		});
	},

	/**
	 * Dołącza do pokoju za pomocą nazwy pokoju.
	 */
	joinRoom: function(roomId) {
		connection.action.joinRoom(roomId, function(received) {
			// `received` na razie nie potrzebne
			alert(received);

			//main.enterRoom(roomId);
		});
	},

	/**
	 * Informuje serwer, że `wchodzi` do pokoju.
	 */
	enterRoom: function(roomId) {
		connection.socket.enterRoom(roomId);
	},

	/**
	 * Skanuje kod, dołącza do pokoju i wchodzi do niego.
	 */
	scanRoomQrCode: function() {
		// skanowanie
		devices.qrCode.scan(function(roomId) {
			alert(roomId);
			// dołączenie do pokoju
			connection.action.joinRoom(roomId, function(received2) {
				alert(received2);
				// wejście do pokoju
				connection.socket.enterRoom(roomId);
			});
		});
	},
        
        /**
	 * Dodawanie elementu do struktury JSON
	 * @param {String} type
         * @param {String} data
         * @param {String} author
	 */
	addNewServerData: function(type, data, author) {
		t_serverData.totalRecords += 1;
		t_serverData.data[t_serverData.totalRecords-1] = [type, data, author];
                main.updateServerData(type, data, author);
	},
        
        /**
         * 
         * @param {String} type
         * @param {String} data
         */
        addNewMyData: function(type, data) {
                t_myData.data[t_myData.data.length] = [type, data];
                main.updateMyData(type, data);
        },
        
        /**
         * 
         * @returns {undefined}
         */
        showServerData: function() {
                for (var data in dataTable) {
                    ;
                }
        },
        
        /**
         * 
         * @param {String} type
         * @param {String} data
         * @param {String} author
         */
        updateServerData: function(type, data, author) {
                var image = document.createElement("img");
                var node = document.createAttribute("alt");
                node.value="photo";
                image.setAttributeNode(node);
                node = document.createAttribute("style");
                node.value="display:none;width:90%;margin-left:5%;";
                image.setAttributeNode(node);
                var element = document.getElementById('received');
                element.appendChild(image);
                var tmp = element.getElementsByTagName("img")[t_serverData.data.length-1];
                tmp.style.display='block';
                tmp.src=data;
        },

        /**
         * 
         * @param {String} type
         * @param {String} data
         */
        updateMyData: function(type, data) {
                var image = document.createElement("img");
                var node = document.createAttribute("alt");
                node.value="photo";
                image.setAttributeNode(node);
                node = document.createAttribute("style");
                node.value="display:none;width:60px;height:60px;";
                image.setAttributeNode(node);
                var element = document.getElementById('myImageCamera');
                element.appendChild(image);
                var tmp = element.getElementsByTagName("img")[t_myData.data.length-1];
                tmp.style.display='block';
                tmp.src=data;
        },
        
	/**
	 * Dodawanie nowego użytkownika do spotkania
         * @param {Number} id_
	 * @param {String} name_
         * @param {String} surname_
         * @param {String} login_
	 */
	userEntered: function(id_, name_, surname_, login_/*meaby few more params*/) {
		t_onlineUser.numberOfOnlineUsers += 1;
                t_onlineUser.user[t_onlineUser.numberOfOnlineUsers-1] = [id_, name_, surname_, login_];
                //onlineUserTable.id = id_;
		//onlineUserTable.id = onlineUserTable.id[numberOfOnlineUsers-1];
		//onlineUserTable.name = name_;
		//onlineUserTable.surname = surname_;
		//onlineUserTable.login = login_;
	},
        
        /**
         * 
         * @param {Number} id_
         */
        userLeft: function(id_) {
                ;
        }
};

/**
 * Elementy otrzymane od websocketa obecnie obsługuje się u nas w ten sposób:
 */
connection.socket.receive.onNewPhoto = function(data) {
        main.addNewServerData('image', data, 'sbd');
	/*var image = document.getElementById('received');

	image.style.display = 'block';
	image.src = data.data;*/
};

/**
 * Elementy otrzymane od websocketa obecnie obsługuje się u nas w ten sposób:
 */
/*connection.socket.receive.onNewUser = function(data) {
	callback(data);
};*/

/**
 * Elementy otrzymane od websocketa obecnie obsługuje się u nas w ten sposób:
 */
connection.socket.receive.onNewMessage = function(data) {
	callback(data);
};

/**
 * Pobranie początkowego adresu MAC.
 */
if (init.ready) {
	devices.mac.get(function(result) {alert(result);}, true);
}
