var Sequelize = require('sequelize');

var sequelize = new Sequelize('meetinghelper', '', '', {
      dialect: 'sqlite',

      // disable logging
      logging: false,
      storage: 'meetinghelper.db'
    });



  module.exports.Sequelize = sequelize;

