var Sequelize = require('sequelize');
var sequelize = require('./db.js').Sequelize;

var Room = sequelize.define('Rooms', {
        name: Sequelize.STRING,
        folderName : Sequelize.STRING,
    }, {
        updatedAt: false,
        createdAt: false
    });


  module.exports = Room;

  