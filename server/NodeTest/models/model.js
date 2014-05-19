var Sequelize = require('sequelize');
var User = require('./user.js');
var Meeting = require('./meeting.js');
var UserRooms = require('./userRoom.js');
var Material = require('./material.js');
var Comment = require('./comment.js');


User.hasMany(Meeting, { through: UserRooms })
Meeting.hasMany(User, { through: UserRooms })

User.hasMany(Material, {as: 'User'})
Meeting.hasMany(Material, {as: 'Meeting'})

User.hasMany(Meeting, { as: 'Creator' })

User.hasMany(Comment, {as: 'User'})
Material.hasMany(Comment, {as: 'Material'})


 module.exports.User = User;
 module.exports.Meeting = Meeting;
 module.exports.UserRoom = UserRooms;
 module.exports.Comment = Comment;
 module.exports.Material = Material;

