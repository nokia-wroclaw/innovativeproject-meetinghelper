/**
 * Part of application responsible for connection.
 */
var connection = {
	url: undefined,

	callback: undefined,

	_callback: function(message) {
		if (connection.callback) {
		    connection.callback(message);
	    } else {
	    	callback(message);
	    }
	},

	setUrl: function(url) {
		connection.url = url;
		connection.socket.init(url);
	},

	hello: function() {
		if (connection.url) {
		    var xmlHttp = null;

		    xmlHttp = new XMLHttpRequest();
		    xmlHttp.open( "GET", connection.url + connectionLinks.hello, false );
		    xmlHttp.send( null );

		    connection._callback(xmlHttp.responseText);
		} else {
			connection._callback('No url is set');
		}
	},

	file: {
		upload: {
			photo: function(imageSrc) {
				if (connection.url) {
					var options = new FileUploadOptions();
					options.fileKey="file";
					options.fileName=imageSrc.substr(imageSrc.lastIndexOf('/')+1);
					options.mimeType="image/jpeg";

					var params = new Object();
					params.value1 = "test";
					params.value2 = "param";

					options.params = params;

					var ft = new FileTransfer();

					ft.onprogress = connection.file.upload._onProgress;
					ft.upload(
						imageSrc,
						connection.url + connectionLinks.sendFile,
						connection.file.upload._success,
						connection.file.upload.fail,
						options);
				} else {
					connection._callback('No url is set');
				}
			},

			onProgress: undefined,

			_onProgress: function(progressEvent) {
				if (connection.file.upload.onProgress) {
					connection.file.upload.onProgress(progressEvent);
				} else {
					//On Android an iOS, lengthComputable is false for downloads that use gzip encoding.
					/*if (progressEvent.lengthComputable) {
						loadingStatus.setPercentage(progressEvent.loaded / progressEvent.total);
					} else {
						loadingStatus.increment();
					}*/
				}
			},

			success: undefined,

			_success: function(message) {
				connection._callback(
					"Code = " + message.responseCode + "\n" +
					"Response = " + message.response + "\n" +
					"Sent = " + message.bytesSent);

				if (connection.file.upload.success) {
					connection.file.upload.success(message.response);
				}
			},

			fail: function(error) {
				connection._callback(
					"An error has occurred: Code = " + error.code + "\n" +
					"upload error source " + error.source + "\n" +
					"upload error target " + error.target);
			}
		},

		download: {
			photo: function(fileUrl, filePath) {
				if (connection.url) {
					var ft = new FileTransfer();
					var uri = encodeURI(connection.url + connectionLinks.getPhoto + fileUrl);

					ft.onprogress = connection.file.download._onProgress;
					ft.download(
						uri,		//link to download
						filePath,	//file path to save
						connection.file.download._success,
						connection.file.download.fail, false);
				} else {
					connection._callback('No url is set');
				}
			},

			onProgress: undefined,

			_onProgress: function(progressEvent) {
				if (connection.file.download.onProgress) {
					connection.file.download.onProgress(progressEvent);
				} else {
					/*if (progressEvent.lengthComputable) {
						loadingStatus.setPercentage(progressEvent.loaded / progressEvent.total);
					} else {
						loadingStatus.increment();
					}*/
				}
			},

			success: undefined,

			_success: function(message) {
				connection._callback("download complete: " + message.fullPath);

				if (connection.file.download.success) {
					connection.file.download.success(message);
				}
			},

			fail: function(error) {
				connection._callback(
					"An error has occurred: Code = " + error.code + "\n" +
					"download error source " + error.source + "\n" +
					"download error target " + error.target);
			}
		}
	},

	mac: {
		get: function() {
			window.MacAddress.getMacAddress(connection.mac.success, connection.mac.fail);
		},
		success: function(macAddress) {
			connection._callback(macAddress);
		},
		fail: function(fail) {
			connection._callback(fail);
		}
	},

	socket: {
		instance: undefined,

		states: {
			open: 'open',
			closed: 'closed'
		},

		state: undefined,

		init: function(link) {
			connection.socket.instance = io.connect(link);

			connection.socket.state = connection.socket.states.open;

			connection.socket.instance.on(webSocketBroadcast.newPhoto, connection.socket._onNewPhoto);
		},

		send: function(event, object) {
			if (connection.socket.state === connection.socket.states.open) {
				connection.socket.instance.emit(event, object);
			}
		},

		onNewPhoto: undefined,

		/**
		 * In data.message is received message.
		 */
		_onNewPhoto: function (data) {
			connection._callback(JSON.stringify(data));

			if (connection.socket.onNewPhoto) {
				connection.socket.onNewPhoto(data.message, data);
			}
		}
	}
};
connection.socket.state = connection.socket.states.closed;