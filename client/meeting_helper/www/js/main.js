
/**
 * Funkcje, od których oczekujemy odpowiedzi, wywołujemy,
 * podając w nich jako argument funkcję, która ma zostać wywołana
 * po otrzymaniu oczekiwanych danych.
 */
var main = {
	takePicture: function(quality) {
		devices.camera.takePicture(quality, function(imageSrc) {
			connection.file.upload.photo(imageSrc);

			var image = document.getElementById('myImageCamera');
			image.style.display = 'block';

			image.src = imageSrc/*"data:image/jpeg;base64," + */;
		});
	},
	initialQrCode: function() {
		devices.qrCode.scan(function(result) {
			var url = document.getElementById('url');
			url.value = result;
		}, true);
	},
	scanAnyQrCode: function() {
		devices.qrCode.scan(function(result) {
			alert(result);
		});
	},
	getMac: function() {
		devices.mac.get(function(result) {
			alert(result);
		});
	}
};


/**
 * Elementy otrzymane od websocketa obecnie obsługuje się u nas w ten sposób:
 */
connection.socket.receive.onNewPhoto = function(data) {
	var image = document.getElementById('received');

	image.style.display = 'block';
	image.src = data;

	callback(data);
};