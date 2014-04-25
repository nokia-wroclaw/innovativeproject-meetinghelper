var express = require('express.io');

//Errors response
express.response.unauthorized = function() {
    this.status(401).json("Unauthorized");
};


module.exports = express;
