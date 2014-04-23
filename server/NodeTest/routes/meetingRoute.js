var fs = require('fs');

var Result = require('../results/result.js');
var Success = Result.Success;
var Error = Result.Error;
var Exception = Result.Exception;
var Model = require('../models/model.js');
var User = Model.User;
var Meeting = Model.Meeting;
//var Sequelize = require('sequelize');


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

    var roomName = req.body.roomName;

    var folderName = createFolder(roomName);
  
    if(!folderName == "")
    {
        var room = Meeting.create({
            name: roomName,
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
    User.find({where:{id: userID}})
    .then(function(user) {
        return user.getMeetings()
    })
    .then(function(meetings) {
        res.end(JSON.stringify(meetings));
    })
}

module.exports.JoinRoom = function(req, res, next) {
    var roomID = req.body.roomID;
    var userID = req.session.user;

    User.find({where:{id: userID}})
    .then(function(user) {
        return Meeting.find({where:{id: roomID}})
        .then(function(room) {
            return user.addMeeting(room)
            .then(function() {
                req.session.room = roomID;
                res.end(new Success("Dołączono do pokoju", room).JSON());
            })
        })
        
    });
};

module.exports.EnterMeeting = function(req) {
    var roomID = req.data.meetingID;
    var userID = req.session.user;

    User.find({where:{id: userID}})
    .then(function(user) {
        return user.getMeetings()
        .then(function(meetings){
            meetings.forEach(function(meeting) {
                if(meeting.id == meetingID)
                    return true
            })
            return false;
        })
        .then(function(access){
            if(access) {
                req.session.rom = roomID;
                req.io.join(roomID);
            }
        })
    });
};

module.exports.IsRoom = function(req, res, next){
    if(!req.session.room){
        return res.send(403);
    }
    next();
}
