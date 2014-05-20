var fs = require('fs');
var Model = require('../models/model.js');
var Meeting = Model.Meeting;
var Material = Model.Material;
var Comment = Model.Comment;

module.exports.SendFile = function(req, res, next) {

    userID = req.session.user;
    roomID = req.session.room;
    file = req.files.file;

    fs.readFile(file.path, function (err, data) {

        Meeting.find({where:{id: roomID}})
        .then(function (meeting){
            var extention = file.name.split('.').pop();
            var newfilename = Math.random().toString(36).slice(2) +"."+ extention;
            var newPath = "events\\"+ meeting.folderName +"\\"+ newfilename;
            fs.writeFile(newPath, data, function (err) {

                var material = Material.create({
                name: file.name,
                fileName: newfilename,
                orginalFileName : file.name,
                like: 0,
                UserId: userID,
                MeetingId: roomID,
                }).then(function(material){
                    if(material){
                        res.endSuccess(newfilename);
                        req.io.broadcast('newMaterial', {
                            material: material,
                            type: 'photo'
                        })
                    } else
                        res.endError(Dictionary.materialNotCreated); 
                });
            });    
        });
        
    });

};


module.exports.DownloadFile = function(req, res, next) {
    var materialID = req.params.materialID;
    Material.find({where:{id: materialID}})
    .then(function(material) {
        Meeting.find({where:{id: material.MeetingId}})
        .then(function(meeting) {
        var newPath = "events\\"+ meeting.folderName +"\\"+ material.fileName;
        res.sendfile(newPath);
        });
    });
};

module.exports.GetAll = function(req, res, next) {
    var meetingID = req.session.room;
    Material.findAll({where:{MeetingId : meetingID}})
    .then(function(materials) {
        res.endSuccess(materials);
    });
};

module.exports.Comment = function(req, res, next) {
    var userID = req.session.user;
    var materialID = req.body.materialID;
    var content = req.body.content;
    Material.find({where:{id : materialID}})
    .then(function(material) {
        if(material)
        {
            var comment =  Comment.create({
                name: content,
                like: 0,
                UserId: userID,
                MaterialId: material.id
                }).then(function(comment){
                    if(comment){
                        res.endSuccess(comment);
                        req.io.broadcast('newComment', {
                            comment: comment
                        });
                    } else
                        res.endError(Dictionary.commentNotCreate); 
                });
        }
        else
            res.endError(Dictionary.materialNotFind); 
    });
};

module.exports.GetComment = function(req, res, next) {
    var userID = req.session.user;
    var materialID = req.param.materialID;
    Material.find({where:{id : materialID}})
    .then(function(materials) {
        if(material)
           res.endSuccess(material.getComments());
        else
            res.endError(Dictionary.materialNotFind); 
    });
};




