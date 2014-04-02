var qr = require('qr-image');
var fs = require('fs');


var rooms = [];
var users = [];

var serverIP = "192.168.1.234";
var port = "1337";
//var mongoose = require('mongoose');

module.exports.HelloWorld = function(req, res) {
    res.send("Server v0.2");
};

module.exports.CreateRoom = function(req, res) {
    rooms.push(req.params.roomName);
    fs.mkdirSync("events/"+ req.params.roomName);
    res.end(JSON.stringify({result:1, message:"OK"}));
};

module.exports.JoinRoom = function(req, res) {
    rooms.push(req.params.roomName);
    fs.mkdirSync("events/"+ req.params.roomName);
    res.end(JSON.stringify({result:1, message:"OK"}));
};

module.exports.QRCode = function(req, res) {
    var code = qr.image("http://"+ serverIP +":"+ port +"/", { type: 'svg' });
    res.type('svg');
    code.pipe(res);
}

module.exports.Login = function(req, res) {
}

module.exports.GetUsers = function(req, res) {

}


module.exports.serverIP = serverIP;
module.exports.port = port;
