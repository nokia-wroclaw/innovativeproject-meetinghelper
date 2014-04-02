var Sequelize = require('sequelize');
var sequelize = require('./db.js').Sequelize;
var User = require('./user.js');
var Room = require('./room.js');


var UserRooms = sequelize.define('UserRooms', {
    }, {
        updatedAt: false,
        createdAt: false
    });

User.hasMany(Room, { through: UserRooms })
Room.hasMany(User, { through: UserRooms })

  module.exports = UserRooms;
