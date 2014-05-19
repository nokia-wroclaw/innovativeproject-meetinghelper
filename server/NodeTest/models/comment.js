var Sequelize = require('sequelize');
var sequelize = require('./db.js').Sequelize;

var Comments = sequelize.define('Comments', {
        name: Sequelize.STRING,
        like: Sequelize.INTEGER,

    }, {
        
    });

  module.exports = Comments;