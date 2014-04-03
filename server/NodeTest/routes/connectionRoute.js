var qr = require('qr-image');
var fs = require('fs');

var Success = require('../results/result.js').Success;
var User = require('../models/user.js');
var Room = require('../models/room.js');
var Sequelize = require('sequelize');



module.exports.HelloWorld = function(req, res) {

    if(req.session.user == undefined)
        res.send("Server v0.2");
    else
        res.send("Witaj nr: "+ req.session.user);
};

module.exports.Ping = function(req, res) {

    res.end(new Success("PONG").JSON());
};

