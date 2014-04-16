var fs = require('fs');

var Success = require('../results/result.js').Success;
var Error = require('../results/result.js').Error;
var Exception = require('../results/result.js').Exception;
var Model = require('../models/model.js');
var User = Model.User;
var Meeting = Model.Meeting;
var Sequelize = require('sequelize');


createFolder = function(folderName) {
    if (!fs.existsSync("events/"+ folderName)) {
        fs.mkdirSync("events/"+ folderName);
        return folderName; 
    }
    else {
        var i=0;
        while(true)
        {
            i++;
            if (!fs.existsSync("events/"+ folderName +"("+i+")")) {
                fs.mkdirSync("events/"+ folderName +"("+i+")");
                return folderName +"("+i+")";
            }
        }
    }
}

module.exports.CreateRoom = function(req, res) {

    var folderName = createFolder(req.params.roomName);
  
    if(!folderName == "")
    {
        var room = Meeting.create({
            name: req.params.roomName,
            folderName: folderName,
            accessCode: Math.random().toString(36).slice(2),
            UserId: req.session.user
        }).success(function(room){
            if(room)
                res.end(new Success("Stworzono pokój", room).JSON());
            else
                res.end(new Error("Nie udało sie stworzyć pokoju").JSON()); 
        });
    }
    else{
        res.end(new Error("Nie można stworzyć folderu").JSON());    
    }
    
};

module.exports.GetRoomsList  = function(req, res, next){
    var userID = req.session.user;
    User.find({where:{id: userID}}).success(function(user){
        if(user){
            user.getMeetings().success(function (rooms) {
                 res.end(JSON.stringify(rooms));
            });
        }
        else{
            res.end(new Error("Nie jesteś zalogowany").JSON());
        }
    });
}

module.exports.JoinRoom = function(req, res) {
    var roomID = req.params.roomID;
    var userID = req.session.user;

    Meeting.find({where:{id: roomID}}).success(function(room){
        if(room){
            User.find({where:{id: userID}}).success(function(user){
                if(user){
                    user.addMeeting(room).success(function(user) {
                        req.session.room = room.id;
                        res.end(new Success("Dołączono do pokoju", room).JSON());
                    });
                }
                else{
                    res.end(new Error("Nie jesteś zalogowany").JSON());
                }
            });
        }
        else
            res.end(new Error("Nie znaleziono pokoju").JSON());
    });
};
