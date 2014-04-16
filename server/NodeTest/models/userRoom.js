var Sequelize = require('sequelize');
var sequelize = require('./db.js').Sequelize;


var UserRooms = sequelize.define('UserRooms', {
    }, {
        updatedAt: false,
        createdAt: false
    });

  module.exports = UserRooms;
