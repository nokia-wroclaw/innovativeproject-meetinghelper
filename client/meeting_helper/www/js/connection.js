/**
 * Part of application responsible for connection.
 */

/**
 * Example of function call, having one of arguments `callb`, what is considered as
 * name of other function - callback ( eg. devices.qrCode.scan(callb) ).
 *
 * devices.qrCode.scan(function(result) {
 *     alert(result);
 * });
 *
 * Such function, after scan, runs function, passed as argument,
 * with result argument of scanning.
 */

/**
 * Example of function use which is called while receiving asynchronous message from server.
 *
 * connection.socket.receive.onNewPhoto = function(data) {};
 *
 * It relies on assigning new function to object, which will be called in specific action.
 */

/**
 * Possible connection states.
 */
var states = {
	unknown_host: 'unknown_host',
	wrong_host: 'wrong_host',
	established: 'established',
	connecting: 'connecting',
	disconnected: 'disconnected'
};

/**
 * `connection` is an object responsible for connecting with web server and
 * allowing user to get or post data.
 */
var connection = {
	url: '',

	/**
	 * Actual connection state.
	 */
	state: states.unknown_host,

	/**
	 * Possigle connection states.
	 */
	states: states,

	/**
	 * Callback to be set by developer.
	 */
	callback: undefined,

	/**
	 * @function connection._callback
	 * Default callback. Runs connection callback if exists.
	 * In other case runs global callback.
	 * @param {Strion} message
	 * Message to be displayed.
	 */
	_callback: function(message) {
		if (connection.callback) {
		    connection.callback(message);
	    } else {
	    	callback(message);
	    }
	},

	/**
	 * @function connection.initUrl
	 * Sets initial url. Checks in cookies, later in default server url.
	 * Checks connection. When connection is right, calls success callback.
	 * When wrong, calls failure callback.
	 * @param {Function} success
	 * Called after successfull connection.
	 * @param {Function} failure
	 * Called after failed connection.
	 */
	initUrl: function(success, failure) {
		connection.state = connection.states.unknown_host;
		if (!connection.url) {
			connection.url = storage.getServerAddress();
		}
		if (!connection.url) {
			connection.url = common.defaultUrl;
		}
		if (connection.url) {
			connection.checkConnection(connection.url, success, failure);
		} else {
			connection.state = connection.states.wrong_host;
			if (failure) {
				failure();
			}
		}
		return connection.url;
	},

	/**
	 * @function connection.setUrl
	 * Sets server url and pings it to check connection. After correct ping,
	 * changes connection state and calls callback.
	 * @param {String} url
	 * URL to be set.
	 * @param {Function} callback
	 * Called after setting url correctly.
	 */
	setUrl: function(url, success, failure) {
		connection.url = '';

		connection.checkConnection(url, function() {
			connection.url = url;
			storage.setServerAddress(url);
			if (success) {
				success();
			}
		}, failure);
	},

	/**
	 * @function connection.getUrl
	 * Gets server url. If not set, checks if any is saved in cookies.
	 * @return {String}
	 * Requested url.
	 */
	getUrl: function() {
		if (!connection.url) {
			connection.url = storage.getServerAddress();
		}
		return connection.url;
	},

	/**
	 * @function connection.getSocketUrl
	 * Gets websocket url.
	 * @return {String}
	 * Requested url.
	 */
	getSocketUrl: function() {
		var url = connection.getUrl();
		if (url) {
			var socketUrl = url.substring(0, url.length - 4);
			return socketUrl;
		}
	},

	/**
	 * @function connection.checkConnection
	 * Checks connection with server by sending ping request.
	 * @param {String} url
	 * URL to be checked.
	 * @param {Function} success
	 * Called after successfull connection.
	 * @param {Function} failure
	 * Called after failed connection.
	 */
	checkConnection: function(url, success, failure) {
		connection.state = connection.states.connecting;
		var stateChanged = false;
		connection.action.ping(url, function(result) {
			if (result === connectionAnswers.ping) {
				answer(connection.states.established, success);
			} else {
				answer(connection.states.wrong_host, failure);
			}
		});
		setTimeout(function() {
			answer(connection.states.wrong_host, failure);
		}, 3000);

		var answer = function(state, callback) {
			if (!stateChanged) {
				stateChanged = true;
				connection.state = state;
				if (callback) {
					callback();
				}
			}
		};
	},

	/**
	 * Get and post actions object.
	 */
	action: {
		/**
		 * Enum with possible actions
		 */
		types: {
			get: "GET",
			post: "POST"
		},

		/**
		 * @function connection.action._base
		 * Performs http get or post request.
		 * @param {Object} type
		 * Type of actually runned action.
		 * @param {String} link
		 * Link of actually runned action.
		 * @param {Object} value
		 * Object to sent in request.
		 * @param {Function} correctCallb
		 * Callback called after receiving correct status.
		 * @param {Function} errorCallb
		 * Callback called after receiving incorrect status.
		 * @param {Boolean} ping
		 * Sprecifies whether actual request is
		 * from ping - it doesn't have to wait until
		 * connection state will be changed to established.
		 */
		_base: function(type, link, value, correctCallb, errorCallb, ping) {
			try {
				if (connection.state === connection.states.established || ping) {
				    var xmlHttp = null;

				    xmlHttp = new XMLHttpRequest();

				    xmlHttp.onreadystatechange = function() {
						if (xmlHttp.readyState === 4 && xmlHttp.status === 200) {
						    if (correctCallb) {
						    	var parsed;
						    	try {
						    		parsed = JSON.parse(xmlHttp.responseText);
						    	} catch(e) {
						    		connection._callback('parsed error: ' + e);
						    		parsed = {};
						    	}
						    	correctCallb(parsed);
						    } else {
						    	connection._callback(xmlHttp.responseText);
						    }
						} else if (xmlHttp.readyState === 4 && (xmlHttp.status === 400 || xmlHttp.status === 401)) {
							if (errorCallb) {
								errorCallb();
							}
						}
					}
					var url;
					if (ping) {
						url = link;
					} else {
						url = connection.getUrl() + link;
					}
				    xmlHttp.open( type, url, true );

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
			    if (correctCallb) {
					correctCallb("an error occured");
					correctCallb(e);
			    } else {
					connection._callback("an error occured");
					connection._callback(e);
			    }
			}
		},

		/**
		 * @function connection.action.home
		 * Checks if user is logged in.
		 * @param {Function} callb
		 * Called after receiving login answer.
		 */
		home: function(callb) {
			connection.action._base(
				connection.action.types.get,
				connectionLinks.get.home,
				null,
				connection.receive._onHome(callb));
		},

		/**
		 * @function connection.action.ping
		 * Sends ping request to server.
		 * @param {String} link
		 * Link for ping action.
		 * @param {Function} callb
		 * Called after receiving ping answer.
		 */
		ping: function(link, callb) {
			connection.action._base(
				connection.action.types.get,
				link + connectionLinks.get.ping,
				null,
				connection.receive._onPong(callb),
				undefined,
				true);
		},

		/**
		 * @function connection.action.login
		 * Logins actual user.
		 * @param {String} login
		 * @param {String} password
		 * @param {String} login
		 * @param {Function} callb
		 * Called after receiving success status.
		 * @param {Function} errorCallb
		 * Called after receiving error status.
		 */
		login: function(login, password, callb, errorCallb) {
			connection.action._base(
				connection.action.types.post,
				connectionLinks.post.login,
				{login: login, password: password},
				connection.receive.onLogin(callb),
				errorCallb);
		},

		/**
		 * @function connection.action.register
		 * Registers actual user.
		 * @param {String} login
		 * @param {String} password
		 * @param {String} password2
		 * @param {Function} callb
		 * Called after receiving success status.
		 * @param {Function} errorCallb
		 * Called after receiving error status.
		 */
		register: function(login, password, password2, callb, errorCallb) {
			if (password === password2) {
				connection.action._base(
					connection.action.types.post,
					connectionLinks.post.register,
					{login: login, password: password},
					connection.receive.onRegister(callb),
					errorCallb);
			} else {
				errorCallb("passwords are not equal");
			}
		},

		/**
		 * @function connection.action.createRoom
		 * Creates new room.
		 * @param {String} roomName
		 * Name of new room.
		 * @param {Function} callb
		 * Called after creating room properly.
		 */
		createRoom: function(roomName, callb) {
			connection.action._base(
				connection.action.types.post,
				connectionLinks.post.rooms.create,
				{meetingName: roomName},
				connection.receive.onCreateRoom(callb));
		},

		/**
		 * @function connection.action.joinRoom
		 * Joins specified room.
		 * @param {String} roomId
		 * Id of room to join.
		 * @param {Function} callb
		 * Called after joining room properly.
		 */
		joinRoom: function(roomId, callb) {
			connection.action._base(
				connection.action.types.post,
				connectionLinks.post.rooms.join,
				{meetingID: roomId},
				connection.receive.onJoinRoom(callb));
		},

		/**
		 * @function connection.action.getRooms
		 * Gets all rooms which was recently entered by user.
		 * @param {Function} callb
		 * Called after receiving rooms with rooms array.
		 */
		getRooms: function(callb) {
			connection.action._base(
				connection.action.types.get,
				connectionLinks.get.rooms.all,
				null,
				connection.receive.onReceiveRooms(callb));
		},

		/**
		 * @function connection.action.getUsers
		 * Gets all users which was from actual room.
		 * @param {Function} callb
		 * Called after receiving users.
		 */
		getUsers: function(callb) {
			connection.action._base(
				connection.action.types.get,
				connectionLinks.get.rooms.users,
				null,
				connection.receive.onReceiveUsers(callb));
		},

		/**
		 * @function connection.action.getRoomData
		 * Requests for all room data.
		 * @param {String} roomId
		 * Id of room to get data.
		 * @param {Function} callb
		 * Called with received data.
		 */
		getRoomData: function(callb) {
			connection.action._base(
				connection.action.types.get,
				connectionLinks.get.rooms.data,
				null,
				connection.receive.onReceiveRoomData(callb));
		},

		/**
		 * @function connection.action.sendNote
		 * Sends to server note to be displayed on wall.
		 * @param {String} note
		 * Contents of the note.
		 * @param {Function} callb
		 * Called after sending a note.
		 */
		sendNote: function(note, callb) {
			connection.action._base(
				connection.action.types.post,
				connectionLinks.post.note,
				{context: note},
				connection.receive.onSendNote(callb));
		},

		/**
		 * @function connection.action.sendComment
		 * Sends to server comment to specified material.
		 * @param {String} materialId
		 * Id of material to be commented.
		 * @param {String} note
		 * Contents of the comment.
		 * @param {Function} callb
		 * Called after sending a comment.
		 */
		sendComment: function(materialId, comment, callb) {
			connection.action._base(
				connection.action.types.post,
				connectionLinks.post.comment,
				{materialID: materialId, content: comment},
				connection.receive.onSendComment(callb));
		}
	},

	/**
	 * All below public receive functions are allowed to be overwritten by
	 * developer to decide what to do with received data.
	 */
	receive: {
		/**
		 * @function connection.receive._base
		 * Decides how to develop data received from server.
		 * @param {Function} callb
		 * Called with received data.
		 * @return {Function}
		 * Function accepting one argument to be called in receive actions.
		 * Allows user to decide what to do with received data.
		 */
		_base: function(callb) {
			return function(data) {
				if (callb) {
					callb(data);
				} else {
					connection._callback(data);
				}
			}
		},

		/**
		 * @function connection.receive._onHome
		 * Called after home answer is received.
		 * @param {Function} callb
		 * Called with received data.
		 */
		_onHome: function(callb) {
			return connection.receive._base(callb);
		},

		/**
		 * @function connection.receive._onPong
		 * Called after pong answer is received.
		 * @param {Function} callb
		 * Called with received data.
		 */
		_onPong: function(callb) {
			return connection.receive._base(callb);
		},

		/**
		 * @function connection.receive.onLogin
		 * Called after login answer is received.
		 * @param {Function} callb
		 * Called with received data.
		 */
		onLogin: function(callb) {
			return connection.receive._base(callb, true);
		},

		/**
		 * @function connection.receive.onRegister
		 * Called after register answer is received.
		 * @param {Function} callb
		 * Called with received data.
		 */
		onRegister: function(callb) {
			return connection.receive._base(callb);
		},

		/**
		 * @function connection.receive.onCreateRoom
		 * Called after answer is received.
		 * @param {Function} callb
		 * Called with received data.
		 */
		onCreateRoom: function(callb) {
			return connection.receive._base(callb);
		},

		/**
		 * @function connection.receive.onJoinRoom
		 * Called after answer is received.
		 * @param {Function} callb
		 * Called with received data.
		 */
		onJoinRoom: function(callb) {
			return connection.receive._base(callb);
		},

		/**
		 * @function connection.receive.onReceiveRooms
		 * Called after answer is received.
		 * @param {Function} callb
		 * Called with received data.
		 */
		onReceiveRooms: function(callb) {
			return connection.receive._base(callb);
		},

		/**
		 * @function connection.receive.onReceiveUsers
		 * Called after answer is received.
		 * @param {Function} callb
		 * Called with received data.
		 */
		onReceiveUsers: function(callb) {
			return connection.receive._base(function(data) {
				var toReturn = [];
				for (var i in data) {
					toReturn.push({
						userId: data[i].id,
						type: 'user',
						name: data[i].name,
						data: data[i]
					});
				}
				callb(toReturn);
			});
		},

		/**
		 * @function connection.receive.onReceiveRoomData
		 * Called after answer is received.
		 * @param {Function} callb
		 * Called with received data.
		 */
		onReceiveRoomData: function(callb) {
			return connection.receive._base(function(data) {
				var toReturn = [];
				for (var i in data) {
					if (data[i].type === 'photo') {
						toReturn.push({
							id: data[i].id,
							userId: data[i].UserId,
							type: 'photo',
							data: connection.getUrl() + connectionLinks.get.material + data[i].id
						});
					} else if (data[i].type === 'note') {
						toReturn.push({
							id: data[i].id,
							userId: data[i].UserId,
							type: 'note',
							data: data[i].context
						});
					}
				}
				callb(toReturn);
			});
		},

		/**
		 * @function connection.receive.onSendNote
		 * Called after answer is received.
		 * @param {Function} callb
		 * Called with received data.
		 */
		onSendNote: function(callb) {
			return connection.receive._base(callb);
		},

		/**
		 * @function connection.receive.onSendComment
		 * Called after answer is received.
		 * @param {Function} callb
		 * Called with received data.
		 */
		onSendComment: function(callb) {
			return connection.receive._base(callb);
		}
	},

	/**
	 * Part responsible for sending and downloading files.
	 */
	file: {
		/**
		 * Part responsible for sending files.
		 */
		upload: {
			/**
			 * @function connection.file.upload.photo
			 * Uploads photo to server onto url saved in parent object.
			 * @param {String} imageSrc
			 * Source of image in device's local storage.
			 * @param {Function} onUpload
			 * Called after successfull upload.
			 * @param {Function} onProgress
			 * Called when upload progress changes.
			 */
			photo: function(imageSrc, onUpload, onProgress) {
				if (connection.getUrl()) {
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
						connection.getUrl() + connectionLinks.post.file,
						connection.file.upload._success(onUpload),
						connection.file.upload.fail,
						options);
				} else {
					connection._callback('No url is set');
				}
			},

			/**
			 * @function connection.file.upload.onProgress
			 * Possible global `on progress` function called when each
			 * single photo is uploaded.
			 * @param {Object} progressEvent
			 * Progress event with values: loaded, total and lengthComputable.
			 */
			onProgress: undefined,

			/**
			 * @function connection.file.upload._onProgress
			 * Called in connection.file.upload.photo while uploading photo. Allows to
			 * add additional actions before running connection.file.upload.onProgress function.
			 * @param {Object} progressEvent
			 * Progress event with values: loaded, total and lengthComputable.
			 */
			_onProgress: function(progressEvent) {
				if (connection.file.upload.onProgress) {
					connection.file.upload.onProgress(progressEvent);
				}
			},

			/**
			 * @function connection.file.upload._success
			 * Returns function to be called in connection.file.upload.photo
			 * after successfull upload.
			 * @param {Function} callb
			 * Called with success response after successfull upload.
			 * @return {Function}
			 * Function to be called in connection.file.upload.photo with one value: message.
			 * It has properties: responseCode, response, bytesSent and fullPath.
			 */
			_success: function(callb) {
				return function(message) {
					connection._callback(
						"Code = " + message.responseCode + "\n" +
						"Response = " + message.response + "\n" +
						"Sent = " + message.bytesSent);

					if (callb) {
						callb(message.response);
					}
				};
			},

			/**
			 * @function connection.file.upload.fail
			 * Called in connection.file.upload.photo when upload fails.
			 * @param {Object} error
			 * Error message with values: code, source and target.
			 */
			fail: function(error) {
				connection._callback(
					"An error has occurred: Code = " + error.code + "\n" +
					"upload error source " + error.source + "\n" +
					"upload error target " + error.target);
			}
		},

		/**
		 * Part responsible for downloading files.
		 */
		download: {
			/**
			 * @function connection.file.download.photo
			 * Downloads photo from server onto typed url.
			 * @param {String} fileUrl
			 * Url of image to be downloaded.
			 * @param {String} filePath
			 * Path to save downloaded image.
			 * @param {Function} onDownload
			 * Called after successfull download.
			 * @param {Function} onProgress
			 * Called when download progress changes.
			 */
			photo: function(fileUrl, filePath, onDownload, onProgress) {
				if (connection.getUrl()) {
					var ft = new FileTransfer();
					var uri = encodeURI(connection.getUrl() + connectionLinks.getPhoto + fileUrl);

					if (onProgress) {
						ft.onprogress = function(progressEvent) {
							onProgress(progressEvent);
							connection.file.download._onProgress(progressEvent);
						};
					} else {
						ft.onprogress = connection.file.download._onProgress;
					}
					ft.download(
						uri,		//link to download
						filePath,	//file path to save
						connection.file.download._success(onDownload),
						connection.file.download.fail, false);
				} else {
					connection._callback('No url is set');
				}
			},

			/**
			 * @function connection.file.download.onProgress
			 * Possible global `on progress` function called when each
			 * single photo is downloaded.
			 * @param {Object} progressEvent
			 * Progress event with values: loaded, total and lengthComputable.
			 */
			onProgress: undefined,

			/**
			 * @function connection.file.download._onProgress
			 * Called in connection.file.download.photo while downloading photo. Allows to
			 * add additional actions before running connection.file.download.onProgress function.
			 * @param {Object} progressEvent
			 * Progress event with values: loaded, total and lengthComputable.
			 */
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

			/**
			 * @function connection.file.download._success
			 * Returns function to be called in connection.file.download.photo
			 * after successfull download.
			 * @param {Function} callb
			 * Called with success response after successfull download.
			 * @return {Function}
			 * Function to be called in connection.file.download.photo with one value: message.
			 * It has properties: responseCode, response, bytesSent and fullPath.
			 */
			_success: function(callb) {
				return function(message) {
					connection._callback(
						"Code = " + message.responseCode + "\n" +
						"Response = " + message.response + "\n" +
						"Sent = " + message.bytesSent + "\n" +
						"Path = " + message.fullPath);

					if (callb) {
						callb(message.response);
					}
				};
			},

			/**
			 * @function connection.file.download.fail
			 * Called in connection.file.download.photo when download fails.
			 * @param {Object} error
			 * Error message with values: code, source and target.
			 */
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

		init: function(success, failure) {
			try {
				connection.socket.close();
				connection.socket.instance = io.connect(connection.getSocketUrl());

				connection.socket.state = connection.socket.states.open;

				connection.socket.instance.on(webSocketBroadcast.pong, connection.socket.receive._onPing(success));
				connection.socket.instance.on(webSocketBroadcast.enterRoom, connection.socket.receive._onEnterRoom);
				connection.socket.instance.on(webSocketBroadcast.usersOnline, connection.socket.receive._onUsersOnline);
				connection.socket.instance.on(webSocketBroadcast.newUser, connection.socket.receive._onNewUser);
				connection.socket.instance.on(webSocketBroadcast.removeUser, connection.socket.receive._onRemoveUser);
				connection.socket.instance.on(webSocketBroadcast.newMaterial, connection.socket.receive._onNewMaterial);
				connection.socket.instance.on(webSocketBroadcast.newComment, connection.socket.receive._onNewComment);
			} catch(e) {
				connection._callback(e);
				connection.state = connection.states.disconnected;
				if (failure) {
					failure();
				}
			}
		},

		close: function() {
			if (connection.socket.instance) {
				try {
					connection.socket.instance.disconnect();
				} catch(e) {
				}

				connection.socket.state = connection.socket.states.closed;
			}
		},

		send: function(event, object) {
			if (connection.socket.state === connection.socket.states.open) {
				connection.socket.instance.emit(event, object);
			} else {
				connection._callback('Socket is in closed state');
			}
		},

		ping: function() {
			connection.socket.send(webSocketSend.ping);
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
					connection.socket.receive.onEnterRoom(data);
				}
			},

			onUsersOnline: undefined,

			_onUsersOnline: function (received) {
				connection._callback('_onUsersOnline: ' + JSON.stringify(received));
				try {
					var data = JSON.parse(received);

					if (connection.socket.receive.onUsersOnline) {
						var toReturn = [];
						for (var i in data) {
							toReturn.push({
								userId: data[i].userID,
								type: 'user',
								name: data[i].name,
								data: data[i]
							});
						}
						connection.socket.receive.onUsersOnline(toReturn);
					}
				} catch(e) {
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

			onRemoveUser: undefined,

			/**
			 * In data.message is received message.
			 */
			_onRemoveUser: function (data) {
				connection._callback('_onRemoveUser: ' + JSON.stringify(data));

				if (connection.socket.receive.onRemoveUser) {
					connection.socket.receive.onRemoveUser({
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
				if (data.material.type === 'photo') {
					if (connection.socket.receive.onNewPhoto) {
						connection.socket.receive.onNewPhoto({
							id: data.material.id,
							userId: data.material.UserId,
							type: 'photo',
							data: connection.getUrl() + connectionLinks.get.material + data.material.id
						});
					}
				} else if (data.material.type === 'note') {
					if (connection.socket.receive.onNewNote) {
						connection.socket.receive.onNewNote({
							id: data.material.id,
							userId: data.material.UserId,
							type: 'note',
							data: data.material.context
						});
					}
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
						materialId: data.comment.MaterialId,
						userId: data.comment.UserId,
						type: 'comment',
						data: data.comment.name
					});
				}
			},

			onPing: undefined,

			_onPing: function (success) {
				return function() {
					if (success) {
						success();
					}
					if (connection.socket.receive.onPing) {
						connection.socket.receive.onPing();
					}
					connection._callback('pong');
				}
			}
		}
	}
};
connection.socket.state = connection.socket.states.closed;