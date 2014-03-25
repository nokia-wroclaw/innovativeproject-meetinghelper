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
		scan: function() {
			cordova.plugins.barcodeScanner.scan(devices.qrCode._success, devices.qrCode.fail);
		},

		success: undefined,

		_success: function (result) {
			if (result.text !== '') {
				connection.setUrl(result.text);

				devices._callback(
					"We got a barcode\n" +
					"Result: " + result.text + "\n" +
					"Format: " + result.format + "\n" +
					"Cancelled: " + result.cancelled);

				if (devices.qrCode.success) {
					devices.qrCode.success(result.text);
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

	camera: {
		takePicture: function(quality) {
			if (!quality) quality = 50;
			navigator.camera.getPicture(
				devices.camera._success(quality),
				devices.camera.fail, {
					quality: quality,
					destinationType: Camera.DestinationType.FILE_URI
			});
		},

		success: undefined,

		_success: function(quality) {
			return function(imageSrc) {
				devices._callback(
					"We got a picture (quality: " + quality + "): " + imageSrc);

				if (devices.camera.success) {
					devices.camera.success(imageSrc);
				} else {
					connection.file.upload.photo(imageSrc);
				}
			}
		},

		fail: function(message) {
			devices._callback('Failed because: ' + message);
		}
	}
};
