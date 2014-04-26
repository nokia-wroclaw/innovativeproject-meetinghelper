
var Model = require('../models/model.js');
var Meeting = Model.Meeting;

module.exports.SendFile = function(req, res, next) {

    userID = req.session.user;
    roomID = req.session.room;
    file = req.files.file;

    fs.readFile(file.path, function (err, data) {

        Meeting.find({where:{id: roomID}})
        .then(function (meeting){
            var newPath = __dirname + "/events/"+ meeting.folderName +"/"+ file.name;
            fs.writeFile(newPath, data, function (err) {
                console.log("Plik zapisano: "+ file.name )
                res.send("Plik zapisano: "+ file.name );
            });    
        });
        
    });
    //Uwaga wcześniej broadcast 
    req.io.broadcast('newPhoto', {
        message: req.files.file.name
    })
};