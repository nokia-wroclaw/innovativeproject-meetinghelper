var qr = require('qr-image');
var fs = require('fs');

var Result = require('../results/result.js')
var Success = Result.Success;
var Error = Result.Error;
var Model = require('../models/model.js');
var User = Model.User;
var Meeting = Model.Meeting;
var Sequelize = require('sequelize');
var Dictionary = require('../dictionary/dictionary.js');

var clients = [];

module.exports.HelloWorld = function(req, res) {
    res.endSuccess("Server v0.7");
};

module.exports.Ping = function(req, res) {
    res.endSuccess("PONG");
};

module.exports.SocketPing = function(req){
    if(req.session.user)
        req.io.emit('pong', new Success(req.session.user).JSON());
    else
        req.io.emit('pong', new Error("403").JSON());
};

module.exports.Connected = function (socket) {
    var hs = socket.handshake;
    console.log('\n A socket with sessionID ' + hs.sessionID 
        + ' connected! \n');
    //var intervalID = setInterval(function () {
    //    hs.session.reload( function () { 
    //      hs.session.touch().save();
    //    });
    //}, 60 * 1000);
    socket.on('disconnect', function () {
        console.log('\n A socket with sessionID ' + hs.sessionID 
            + ' disconnected! \n ');
    });
 
};




