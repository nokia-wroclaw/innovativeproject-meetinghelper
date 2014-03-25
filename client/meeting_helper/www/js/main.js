
devices.qrCode.success = function (result) {
	var url = document.getElementById('url');
	url.value = result;
};

devices.camera.success = function(imageSrc) {
	connection.file.upload.photo(imageSrc);

	var image = document.getElementById('myImageCamera');
	image.style.display = 'block';

	image.src = imageSrc/*"data:image/jpeg;base64," + */;
};

connection.socket.onNewPhoto = function(data) {
	var image = document.getElementById('received');

	image.style.display = 'block';
	image.src = connection.url + connectionLinks.getPhoto + data;

	callback(connection.url + connectionLinks.getPhoto + data);
};