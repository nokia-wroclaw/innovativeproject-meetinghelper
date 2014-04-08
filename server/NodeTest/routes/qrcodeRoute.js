var qr = require('qr-image');
var ip = require("ip");
//var fs = require('fs');


var port = "1337";
var room = "PWRMeeting"


module.exports.QRCode = function(req, res) {
    var code = qr.image("http://"+ ip.address() +":"+ port +"/api/", { type: 'svg' });
    res.type('svg');
    code.pipe(res);
}

module.exports.QRCodeGenerator = function(req, res){
    var address = req.params.address;
    var port = req.params.port;
    var room = req.params.room;

    var code = qr.image("http://"+ address +":"+ port +"/api/"+room, { type: 'svg' });
    res.type('svg');
    code.pipe(res);
}

module.exports.QRCodeJoinGroup = function(req, res){
    var groupCode = req.params.groupCode;

    var code = qr.image(groupCode, { type: 'svg' });
    res.type('svg');
    code.pipe(res);
}

