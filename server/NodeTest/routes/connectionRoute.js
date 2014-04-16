var qr = require('qr-image');
var fs = require('fs');

var Success = require('../results/result.js').Success;
var Model = require('../models/model.js');
var User = Model.User;
var Meeting = Model.Meeting;
var Sequelize = require('sequelize');



module.exports.HelloWorld = function(req, res) {

    if(req.session.user == undefined)
        res.send("Server v0.4");
    else
        res.send("Witaj nr: "+ req.session.user);
};

module.exports.Ping = function(req, res) {

    res.end(new Success("PONG").JSON());
};

