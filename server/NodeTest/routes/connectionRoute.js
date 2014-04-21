var qr = require('qr-image');
var fs = require('fs');

var Result = require('../results/result.js')
var Success = Result.Success;
var Error = Result.Error;
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

module.exports.SocketPing = function(req){
    if(req.session.user)
        req.io.emit('pong', new Success(req.session.user).JSON());
    else
        req.io.emit('pong', new Error("403").JSON());
};

module.exports.UserOnline = function(req){
    req.io.join(1);
    var clients = app.io.sockets.clients(1);
    console.log(clients)
};



