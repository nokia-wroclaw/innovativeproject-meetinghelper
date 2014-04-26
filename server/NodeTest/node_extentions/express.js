var express = require('express.io');

express.response.unauthorized = function() {
    this.status(401).json("Unauthorized");
};

express.response.meetingMissing = function() {
    this.status(403).json("Meeting missing");
};

express.response.endSuccess = function(data) {
    this.status(200).end(JSON.stringify(data));
};

express.response.endError = function(message, data) {
    this.status(400).end(JSON.stringify({message:message, data:data}));
};


module.exports = express;
