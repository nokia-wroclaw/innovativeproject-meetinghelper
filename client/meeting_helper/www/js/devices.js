/**
 * Part of application responsible for devices.
 */
var devices = {
	callback: undefined,

	_callback: function(message) {
		if (devices.callback) {
		    devices.callback(message);
	    } else {
	    	callback(message);
	    }
	},

	qrCode: {
		scan: function(userCallback, ifSetUrl) {
			cordova.plugins.barcodeScanner.scan(
				devices.qrCode._success(userCallback, ifSetUrl),
				devices.qrCode.fail);
		},

		success: undefined,

		_success: function(userCallback) {
			return function (result) {
				if (result.text !== '') {
					if (userCallback) {
						userCallback(result.text)
					}

					devices._callback(
						"We got a barcode\n" +
						"Result: " + result.text + "\n" +
						"Format: " + result.format + "\n" +
						"Cancelled: " + result.cancelled);

					if (devices.qrCode.success) {
						devices.qrCode.success(result.text);
					}
				}
			}
		},

		cancel: function() {
			devices._callback("Scanning cancelled");
		},

		fail: function(error) {
			devices._callback("Scanning failed: " + error);
		}
	},

	photoLibrary: {
		take: function(userCallback) {
			navigator.camera.getPicture(
				devices.photoLibrary._success(userCallback),
				devices.photoLibrary.fail, {
					quality: 50,
					destinationType: Camera.DestinationType.FILE_URI,
					sourceType: 2,	// 0:Photo Library, 1=Camera, 2=Saved Album
                    encodingType: 0
			});
		},

		success: undefined,

		_success: function(userCallback) {
			return function(imageSrc) {
				devices._callback(
					"We took a picture: " + imageSrc);

				if (userCallback) {
					userCallback(imageSrc);
				} else {

					if (devices.photoLibrary.success) {
						devices.photoLibrary.success(imageSrc);
					} else {
						connection.file.upload.photo(imageSrc);
					}
				}
			}
		},

		fail: function(message) {
			devices._callback('Failed because: ' + message);
		}
	},

	camera: {
		takePicture: function(quality, userCallback) {
			if (!quality) quality = 50;
			navigator.camera.getPicture(
				devices.camera._success(quality, userCallback),
				devices.camera.fail, {
					quality: quality,
					destinationType: Camera.DestinationType.FILE_URI
			});
		},

		success: undefined,

		_success: function(quality, userCallback) {
			return function(imageSrc) {
				devices._callback(
					"We got a picture (quality: " + quality + "): " + imageSrc);

				if (userCallback) {
					userCallback(imageSrc);
				}

				if (devices.camera.success) {
					devices.camera.success(imageSrc);
				}

				if (!userCallback && !devices.camera.success) {
					connection.file.upload.photo(imageSrc);
				}
			}
		},

		fail: function(message) {
			devices._callback('Failed because: ' + message);
		}
	},

	mac: {
		value: undefined,

		get: function(userCallback, ifSaveMac) {
			window.MacAddress.getMacAddress(devices.mac._success(userCallback, ifSaveMac), devices.mac.fail);
		},
		success: undefined,
		_success: function(userCallback, ifSaveMac) {
			return function(macAddress) {
				if (ifSaveMac) {
					devices.mac.value = macAddress;
				} else {

					if (userCallback) {
						userCallback(macAddress);
					} else {
						devices._callback(macAddress);
					}
					if (devices.mac.success) {
						devices.mac.success(macAddress);
					}
				}
			}
		},
		fail: function(fail) {
			devices._callback(fail);
		}
	}
};