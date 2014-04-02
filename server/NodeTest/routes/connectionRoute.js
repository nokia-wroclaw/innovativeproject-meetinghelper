var qr = require('qr-image');
var fs = require('fs');

var User = require('../models/user.js');
var Room = require('../models/room.js');
var Sequelize = require('sequelize');



module.exports.HelloWorld = function(req, res) {

    if(req.session.user == undefined)
        res.send("Server v0.2");
    else
        res.send("Witaj nr: "+ req.session.user);
};

