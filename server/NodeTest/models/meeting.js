var Sequelize = require('sequelize');
var sequelize = require('./db.js').Sequelize;

var Meeting = sequelize.define('Meetings', {
        name: Sequelize.STRING,
        folderName : Sequelize.STRING,
        accessCode : Sequelize.STRING
    }, {
        
    });


  module.exports = Meeting;

  