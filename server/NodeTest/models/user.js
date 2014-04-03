var Sequelize = require('sequelize');
var sequelize = require('./db.js').Sequelize;


var User = sequelize.define('Users', {
        name: Sequelize.STRING,
        password: Sequelize.STRING,
    }, {
        updatedAt: false,
        createdAt: false
    });

  module.exports = User;