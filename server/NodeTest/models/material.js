var Sequelize = require('sequelize');
var sequelize = require('./db.js').Sequelize;

var Materials = sequelize.define('Materials', {
        name: Sequelize.STRING,
        fileName: Sequelize.STRING,
        orginalFileName: Sequelize.STRING,
        like: Sequelize.INTEGER,

    }, {
        
    });

  module.exports = Materials;