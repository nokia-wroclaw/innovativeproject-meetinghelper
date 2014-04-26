﻿var fs = require('fs');

var Model = require('../models/model.js');
var User = Model.User;
var Meeting = Model.Meeting;
var Success = require('../results/result.js').Success;
var Error = require('../results/result.js').Error;
var Exception = require('../results/result.js').Exception;
var Sequelize = require('sequelize');
var Dictionary = require('../dictionary/dictionary.js');


module.exports.Register = function(req, res, next) {

    if(req.body.login == "" || req.body.password == ""){
        res.endError(Dictionary.noLoginOrPassword);
        return;
    }

    User.find({where:{name: req.body.login}}).success(function(user){
        if(user)
            res.endError(Dictionary.userIssetYet);
        else
        {
            var user = User.create({
                name: req.body.login,
                password: req.body.password
            }).success(function(user) {
                if(user)
                    res.endSuccess(user.id);
                else
                    res.endError(Dictionary.userNotCreated);
             });
        }
    });
    
}

module.exports.IsLogin = function(req, res, next){
    if(!req.session.user){
        return res.unauthorized();
    }
    next();
}

module.exports.Login = function(req, res, next) {
    User.find({where: Sequelize.and({name: req.body.login}, {password: req.body.password})}).success(function(user) {
        if(user)
        {
            req.session.user = user.id;
            res.endSuccess(user);
        }
        else
            res.endError(Dictionary.invalidData);
    });
}

module.exports.Logout = function(req, res, next) {
    delete req.session.user;
    delete req.session.room;
    res.endSuccess(true);
}



module.exports.UsersOnline = function(req){
    var clients = [];
    app.io.sockets.clients(req.session.room).forEach(function(socket) {
        if(socket.handshake.session.user)
            clients.push({ userId: socket.handshake.session.user});
    })
    req.io.emit('usersOnline', new Success(clients).JSON());
}


module.exports.SNewUser = function (socket, data) {
      socket.user = data.user;
      socket.room = data.room;
      socket.join(data.room); 
      User.find({where:{id: data.user}}).success(function(user) {
          if(user)
            {
                socket.broadcast.to(data.room).emit('newUser', user);
                socket.emit('newUser', user);
            }
       });
      console.log("User "+ data.user + " dołączył do pokoju " + data.room);
  }
