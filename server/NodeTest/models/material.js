var Sequelize = require('sequelize');
var sequelize = require('./db.js').Sequelize;

var Materials = sequelize.define('Materials', {
        name: Sequelize.STRING,
        fileName: Sequelize.STRING,
        orginalFileName: Sequelize.STRING,
        like: Sequelize.INTEGER,
        context: Sequelize.STRING,
        type: Sequelize.STRING
    }, {
        
    });

  module.exports = Materials;