var fs = require('fs');

var Result = require('../results/result.js');
var Success = Result.Success;
var Error = Result.Error;
var Exception = Result.Exception;
var Model = require('../models/model.js');
var User = Model.User;
var Meeting = Model.Meeting;
//var Sequelize = require('sequelize');
var Dictionary = require('../dictionary/dictionary.js');

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

    var meetingName = req.body.meetingName;

    var folderName = createFolder(meetingName);
  
    if(!folderName == "")
    {
        var room = Meeting.create({
            name: meetingName,
            folderName: folderName,
            accessCode: Math.random().toString(36).slice(2),
            UserId: req.session.user
        }).success(function(room){
            if(room)
                res.endSuccess(room);
            else
                res.endError(Dictionary.meetingNotCreated); 
        });
    }
    else{
        res.endError(Dictionary.folderNotCreate);    
    }
};

module.exports.GetRoomsList  = function(req, res, next){
    var userID = req.session.user;
    User.find({where:{id: userID}})
    .then(function(user) {
        return user.getMeetings()
    })
    .then(function(meetings) {
        res.endSuccess(meetings);
    })
}

module.exports.JoinRoom = function(req, res, next) {
    var meetingID = req.body.meetingID;
    var userID = req.session.user;

    User.find({where:{id: userID}})
    .then(function(user) {
        return Meeting.find({where:{id: meetingID}})
        .then(function(meeting) {
            return user.addMeeting(meeting)
            .then(function() {
                req.session.room = meetingID;
                res.endSuccess(true);
            })
        })
        
    });
};

module.exports.JoinRoomByCode = function(req, res, next) {
    var accessCode = req.body.accessCode;
    var userID = req.session.user;

    User.find({where:{id: userID}})
    .then(function(user) {
        return Meeting.find({where:{accessCode: accessCode}})
        .then(function(meeting) {
            return user.addMeeting(meeting)
            .then(function() {
                req.session.room = meeting.Id;
                res.endSuccess(true);
            })
        })
        
    });
};


module.exports.EnterMeeting = function(req) {
    var meetingID = req.data.meetingID;
    var userID = req.session.user;
     console.log("sesja socketa: "+ req.session.id)
    User.find({where:{id: userID}})
    .then(function(user) {
        return user.getMeetings()
        .then(function(meetings){
            access = false;
            meetings.forEach(function(meeting) {
                if(meeting.id == meetingID)
                    access = true;
            })
           return access;
        })
        .then(function(access){
            if(access) {
                req.session.rom = meetingID;
                req.io.join(meetingID);
                req.io.emit('joined', {data: meetingID});
            }
        })
    });
};

module.exports.IsRoom = function(req, res, next){
    if(!req.session.room){
        return res.meetingMissing();
    }
    next();
}
