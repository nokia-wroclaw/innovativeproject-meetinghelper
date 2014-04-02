
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

			var image = document.getElementById('myImageCamera');
			image.style.display = 'block';

			image.src = imageSrc/*"data:image/jpeg;base64," + */;
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
		});
	},

	/**
	 * Dołącza do pokoju za pomocą nazwy pokoju.
	 */
	joinRoom: function(room) {
		connection.action.joinRoom(room, function(received) {
			alert(received);

			main.enterRoom(received.room);
		});
	},

	/**
	 * Informuje serwer, że `wchodzi` do pokoju.
	 */
	enterRoom: function(roomId) {
		connection.socket.enterRoom(roomId, function(received) {
			alert(received);
		});
	},

	/**
	 * Pobiera dane mac urządzenia i wywołuje z nimi alerta.
	 */
	getRooms: function() {
		connection.action.getRooms(function(received) {
			alert(received);
		});
	}
};

/**
 * Elementy otrzymane od websocketa obecnie obsługuje się u nas w ten sposób:
 */
connection.socket.receive.onNewPhoto = function(data) {
	var image = document.getElementById('received');

	image.style.display = 'block';
	image.src = data.data;
};

/**
 * Elementy otrzymane od websocketa obecnie obsługuje się u nas w ten sposób:
 */
connection.socket.receive.onNewUser = function(data) {
	callback(data);
};

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
