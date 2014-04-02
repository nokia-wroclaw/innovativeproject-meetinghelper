var mongoose = require('mongoose');

var User = new mongoose.Schema({
 Mac: String,
 Room: String
});
mongoose.model('User', User);

mongoose.connect('mongodb://localhost/NodeTest');
