/**
 * Part of application responsible for connection.
 */

/**
 * Przykład wywołania funkcji, której argumentem jest callb, co będzie uznawane jako
 * nazwa innej funkcji - callbacku ( devices.qrCode.scan(callb) ).
 *
 * devices.qrCode.scan(function(result) {
 *     alert(result);
 * });
 *
 * Taka funkcja, po wykonaniu skanowania, uruchomi z argumentem (u nas result) funkcję
 * podaną jako argument.
 */

/**
 * Przykład użycia funkcji wywoływanej podczas przyjścia wiadomości ze strony serwera.
 *
 * connection.socket.receive.onNewPhoto = function(data) {};
 *
 * Polega to na przypisaniu nowej funkcji, wywoływanej przy danej akcji.
 */

var states = {
	unknown_host: 'unknown_host',
	wrong_host: 'wrong_host',
	established: 'established',
	connecting: 'connecting',
	disconnected: 'disconnected'
};

var nextIdToBeDepreciated = 0;

var connection = {
	url: '',
	state: states.unknown_host,

	states: states,

	callback: undefined,

	_callback: function(message) {
		if (connection.callback) {
		    connection.callback(message);
	    } else {
	    	callback(message);
	    }
	},

	setUrl: function(url, callback) {
		connection.url = '';
		connection.state = connection.states.connecting;
		connection.action.ping(url, function(result) {
			if (result === connectionAnswers.ping) {
				connection.url = url;
				connection.state = connection.states.established;
				if (callback) {
					callback();
				}
			}
		});
	},

	action: {
		types: {
			get: "GET",
			post: "POST"
		},

		_base: function(type, link, value, callb, callb2, ping) {
			try {
				if (connection.state === connection.states.established || ping) {
				    var xmlHttp = null;

				    xmlHttp = new XMLHttpRequest();

				    xmlHttp.onreadystatechange = function() {
						if (xmlHttp.readyState === 4 && xmlHttp.status === 200) {
						    if (callb) {
						    	callb(JSON.parse(xmlHttp.responseText));
						    } else {
						    	connection._callback(xmlHttp.responseText);
						    }
						} else if (xmlHttp.readyState === 4 && (xmlHttp.status === 400 || xmlHttp.status === 401)) {
							if (callb2) {
								callb2();
							}
						}
					}

				    xmlHttp.open( type, connection.url + link, true );

				    if (type === connection.action.types.post) {
						value = JSON.stringify(value);
						xmlHttp.setRequestHeader("Content-Type", "application/json; charset=utf-8");
					}
				    xmlHttp.send( value );

				} else if (connection.state === connection.states.connecting) {
					connection._callback('Connecting...\nPlease check your connection.');
				} else if (connection.state === connection.states.wrong_host) {
					connection._callback('Wrong url');
				} else if (connection.state === connection.states.unknown_host) {
					connection._callback('No url is set');
				} else {
					connection._callback('Unknown exception');
				}
			} catch(e) {
			    if (callb) {
					callb("an error occured");
					callb(e);
			    } else {
					connection._callback("an error occured");
					connection._callback(e);
			    }
			}
		},
		ping: function(link, callb) {
			connection.action._base(
				connection.action.types.get,
				link + connectionLinks.get.ping,
				null,
				connection.receive._onPong(callb),
				undefined,
				true);
		},
		hello: function(callb) {
			connection.action._base(
				connection.action.types.get,
				connectionLinks.hello,
				null, callb);
		},
		mac: function(callb) {
			if (connection.mac.value) {
				connection.action._base(
					connection.action.types.post,
					connectionLinks.post.mac,
					connection.mac.value, callb);
			}
		},
		login: function(login, password, callb, callb2) {
			connection.action._base(
				connection.action.types.post,
				connectionLinks.post.login,
				{login: login, password: password},
				connection.receive.onLogin(callb),
				callb2);
		},
		register: function(login, password, password2, callb, callb2) {
			if (password === password2) {
				connection.action._base(
					connection.action.types.post,
					connectionLinks.post.register,
					{login: login, password: password},
					connection.receive.onRegister(callb),
					callb2);
			} else {
				callb("passwords are not equal");
			}
		},
		createRoom: function(roomName, callb) {
			connection.action._base(
				connection.action.types.post,
				connectionLinks.post.rooms.create,
				{meetingName: roomName},
				connection.receive.onCreateRoom(callb));
		},
		joinRoom: function(roomId, callb) {
			connection.action._base(
				connection.action.types.post,
				connectionLinks.post.rooms.join,
				{meetingID: roomId},
				connection.receive.onJoinRoom(callb));
		},
		getRooms: function(callb) {
			connection.action._base(
				connection.action.types.get,
				connectionLinks.get.rooms.all,
				null,
				connection.receive.onReceiveRooms(callb));
		},
		getRoomData: function(roomId, callb) {
			connection.action._base(
				connection.action.types.get,
				connectionLinks.get.rooms.data,
				{roomId: roomId},
				connection.receive.onReceiveRoomData(callb));
		},
		sendNote: function(note, callb) {
			connection.action._base(
				connection.action.types.get,
				connectionLinks.post.sendNote,
				{note: note},
				connection.receive.onSendNote(callb));
		},
		sendComment: function(id, comment, callb) {
			connection.action._base(
				connection.action.types.get,
				connectionLinks.post.sendNote,
				{materialId: id, comment: comment},
				connection.receive.onSendComment(callb));
		}
	},

	receive: {
		_base: function(callb, ifLogin) {
			if (ifLogin) {
				try {
					connection.socket.init(connection.url.substring(0, connection.url.length - 4));
				} catch(e) {
					connection._callback(e);
					connection.state = connection.states.disconnected;
				}
			}
			return function(data) {
				if (callb) {
					callb(data);
				} else {
					connection._callback(data);
				}
			}
		},
		_onPong: function(callb) {
			return connection.receive._base(callb);
		},
		onLogin: function(callb) {
			return connection.receive._base(callb, true);
		},
		onRegister: function(callb) {
			return connection.receive._base(callb);
		},
		onCreateRoom: function(callb) {
			return connection.receive._base(callb);
		},
		onJoinRoom: function(callb) {
			return connection.receive._base(callb);
		},
		onReceiveRooms: function(callb) {
			return connection.receive._base(callb);
		},
		onReceiveRoomData: function(callb) {
			return connection.receive._base(callb);
		},
		onSendNote: function(callb) {
			return connection.receive._base(callb);
		},
		onSendComment: function(callb) {
			return connection.receive._base(callb);
		}
	},

	file: {
		upload: {
			photo: function(imageSrc, onUpload, onProgress) {
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

					if (onProgress) {
						ft.onprogress = function(progressEvent) {
							onProgress(progressEvent);
							connection.file.upload._onProgress(progressEvent);
						};
					} else {
						ft.onprogress = connection.file.upload._onProgress;
					}
					ft.upload(
						imageSrc,
						connection.url + connectionLinks.uploadFile,
						connection.file.upload._success(callb),
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
					//old part of progress; to be moved to function docs
					//On Android an iOS, lengthComputable is false for downloads that use gzip encoding.
					/*if (progressEvent.lengthComputable) {
						loadingStatus.setPercentage(progressEvent.loaded / progressEvent.total);
					} else {
						loadingStatus.increment();
					}*/
				}
			},

			_success: function(callb, message) {
				return function() {
					connection._callback(
						"Code = " + message.responseCode + "\n" +
						"Response = " + message.response + "\n" +
						"Sent = " + message.bytesSent);

					if (callb) {
						callb(message.response);
					}
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

			connection.socket.instance.on(webSocketBroadcast.enterRoom, connection.socket.receive._onEnterRoom);
			connection.socket.instance.on(webSocketBroadcast.usersOnline, connection.socket.receive._onUsersOnline);
			connection.socket.instance.on(webSocketBroadcast.newUser, connection.socket.receive._onNewUser);
			connection.socket.instance.on(webSocketBroadcast.newMaterial, connection.socket.receive._onNewMaterial);
			connection.socket.instance.on(webSocketBroadcast.newComment, connection.socket.receive._onNewComment);
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

		getConnectedUsers: function() {
			connection.socket.send(webSocketSend.connectedUsers);
		},

		enterRoom: function(roomId) {
			connection.socket.send(webSocketSend.enterMeeting, {meetingID: roomId});
		},

		receive: {
			onEnterRoom: undefined,

			_onEnterRoom: function (data) {
				connection._callback('_onEnterRoom: ' + JSON.stringify(data));

				if (connection.socket.receive.onEnterRoom) {
					connection.socket.receive.onEnterRoom(data.data);
				}
			},

			onUsersOnline: undefined,

			_onUsersOnline: function (data) {
				connection._callback('_onUsersOnline: ' + JSON.stringify(data));

				if (connection.socket.receive.onUsersOnline) {
					var toReturn = [];
					for (var i in data.data) {
						toReturn.push({
							userId: data.id,
							type: 'user',
							data: data
						});
					}
					connection.socket.receive.onUsersOnline(toReturn);
				}
			},

			onNewUser: undefined,

			/**
			 * In data.message is received message.
			 */
			_onNewUser: function (data) {
				connection._callback('_onNewUser: ' + JSON.stringify(data));

				if (connection.socket.receive.onNewUser) {
					connection.socket.receive.onNewUser({
						userId: data.id,
						type: 'user',
						data: data
					});
				}
			},

			onNewPhoto: undefined,

			onNewNote: undefined,

			/**
			 * In data.message is received message.
			 */
			_onNewMaterial: function (data) {
				connection._callback(JSON.stringify(data));

				var nextId;
				if (data.message.id) {
					nextId = data.message.id;
				} else {
					nextId = nextIdToBeDepreciated++;
				}

				if (connection.socket.receive.onNewPhoto) {
					connection.socket.receive.onNewPhoto({
						id: nextId,
						userId: data.message.user,
						type: 'photo',
						data: connection.url + connectionLinks.get.photo + data.message
					});
				}

				if (connection.socket.receive.onNewNote) {
					connection.socket.receive.onNewNote({
						id: nextId,
						userId: data.message.user,
						type: 'note',
						data: connection.url + connectionLinks.get.note + data.message
					});
				}
			},

			onNewComment: undefined,

			/**
			 * In data.message is received message.
			 */
			_onNewComment: function (data) {
				connection._callback(JSON.stringify(data));

				if (connection.socket.receive.onNewComment) {
					connection.socket.receive.onNewComment({
						materialId: data.message.id,
						userId: data.message.user,
						type: 'comment',
						target: connection.url + connectionLinks.get.photo + data.message,
						data: data.message.data
					});
				}
			}
		}
	}
};
connection.socket.state = connection.socket.states.closed;