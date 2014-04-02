var fs = require('fs');

var User = require('../models/user.js');
var Room = require('../models/room.js');
var UserRoom = require('../models/userRoom.js');
var Success = require('../results/result.js').Success;
var Error = require('../results/result.js').Error;
var Exception = require('../results/result.js').Exception;
var Sequelize = require('sequelize');



module.exports.Register = function(req, res) {

    if(req.body.login == "" || req.body.password == ""){
        res.end(new Exception("Nie podano loginu bądź hasła").JSON());
        return;
    }

    User.find({where:{name: req.body.login}}).success(function(user){
        if(user)
            res.end(new Error("Podany użytkownik jest już zarejestrowany").JSON());
        else
        {
            var user = User.create({
                name: req.body.login,
                password: req.body.password
            }).success(function(user) {
                if(user)
                    res.end(new Success("Zarejestrowano pomyslnie").JSON());
                else
                    res.end(new Error("Nie udało się stworzyć użytkownika").JSON());
             });
        }
    });
    
}

module.exports.Login = function(req, res) {
    User.find({where: Sequelize.and({name: req.body.login}, {password: req.body.password})}).success(function(user) {
        if(user)
        {
            console.log("Zalogował się user: "+ JSON.stringify(user));
            req.session.user = user.id;
            res.end(new Success("Zalogowany").JSON());
        }
        else
            res.end(new Error("Podano niepoprawne dane").JSON());
    });
}

module.exports.Logout = function(req, res) {
    delete req.session.user;
    req.io.leave(req.session.room);
    delete req.session.room;
    res.end(new Success("Zostałes wylogowany").JSON());
}


module.exports.GetUsers = function(req, res) {

}
