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
		try {
			connection.socket.init(url);
		} catch(e) {}
	},

	/*hello: function() {
		if (connection.url) {
		    var xmlHttp = null;

		    xmlHttp = new XMLHttpRequest();
		    xmlHttp.open( "GET", connection.url + connectionLinks.hello, false );
		    xmlHttp.send( null );

		    connection._callback(xmlHttp.responseText);
		} else {
			connection._callback('No url is set');
		}
	},*/

	action: {
		types: {
			get: "GET",
			post: "POST"
		},

		base: function(type, link, value, callb) {
			if (connection.url) {
			    var xmlHttp = null;

			    xmlHttp = new XMLHttpRequest();
			    xmlHttp.open( type, connection.url + link, false );
			    xmlHttp.send( value );

			    if (callb) {
			    	callb(xmlHttp.responseText);
			    } else {
			    	connection._callback(xmlHttp.responseText);
			    }
			} else {
				connection._callback('No url is set');
			}
		},
		hello: function(callb) {
			connection.action.base(
				connection.action.types.get,
				connectionLinks.hello,
				null, callb);
		},
		mac: function(callb) {
			if (connection.mac.value) {
				connection.action.base(
					connection.action.types.post,
					connectionLinks.post.mac,
					connection.mac.value, callb);
			}
		},
		login: function(username, password, callb) {
			connection.action.base(
				connection.action.types.post,
				connectionLinks.post.login,
				{username: username, password: password},
				connection.receive.onLogin(callb));
		},
		register: function(username, password, password2, callb) {
			if (password === password2) {
				connection.action.base(
					connection.action.types.post,
					connectionLinks.post.register,
					{username: username, password: password},
					connection.receive.onRegister(callb));
			}
		},
		getRooms: function(callb) {
			connection.action.base(
				connection.action.types.get,
				connectionLinks.get.rooms,
				{config: {}},
				connection.receive.onReceiveRooms(callb));
		},
		getRoomData: function(roomId, callb) {
			connection.action.base(
				connection.action.types.get,
				connectionLinks.get.roomData,
				{roomId: roomId},
				connection.receive.onReceiveRoomData(callb));
		}
	},

	receive: {
		base: function(callb) {
			return function(data) {
				if (callb) {
					callb(data);
				} else {
					connection._callback(data);
				}
			}
		},
		onLogin: function(callb) {
			return connection.receive.base(callb);
		},
		onRegister: function(callb) {
			return connection.receive.base(callb);
		},
		onReceiveRooms: function(callb) {
			return connection.receive.base(callb);
		},
		onReceiveRoomData: function(callb) {
			return connection.receive.base(callb);
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
						connection.url + connectionLinks.uploadFile,
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

			connection.socket.instance.on(webSocketBroadcast.newPhoto, connection.socket.receive._onNewPhoto);
		},

		send: function(event, object) {
			if (connection.socket.state === connection.socket.states.open) {
				connection.socket.instance.emit(event, object);
			} else {
				connection._callback('Socket is in closed state');
			}
		},

		testSend: function(message) {
			connection.socket.send(webSocketSend.test, message);
		},

		receive: {
			onNewPhoto: undefined,

			/**
			 * In data.message is received message.
			 */
			_onNewPhoto: function (data) {
				connection._callback(JSON.stringify(data));

				if (connection.socket.onNewPhoto) {
					connection.socket.onNewPhoto(
						connection.url + connectionLinks.getPhoto + data.message, data);
				}
			}
		}
	}
};
connection.socket.state = connection.socket.states.closed;