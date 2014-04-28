
var Model = require('../models/model.js');
var Meeting = Model.Meeting;
var Material = Model.Material;

module.exports.SendFile = function(req, res, next) {

    userID = req.session.user;
    roomID = req.session.room;
    file = req.files.file;

    fs.readFile(file.path, function (err, data) {

        Meeting.find({where:{id: roomID}})
        .then(function (meeting){
            var extention = filename.split('.').pop();
            var newfilename = Math.random().toString(36).slice(2) +"."+ extention;
            var newPath = __dirname + "/events/"+ meeting.folderName +"/"+ newfilename;
            fs.writeFile(newPath, data, function (err) {

                var material = Material.create({
                name: roomName,
                fileName: newfilename,
                orginalFileName : filename,
                like: 0,
                UserId: req.session.user
                }).then(function(material){
                    if(material){
                        res.endSuccess(newfilename);
                        req.io.broadcast('newMaterial', {
                            material: material
                        })
                    } else
                        res.endError(Dictionary.materialNotCreated); 
                });
            });    
        });
        
    });

};