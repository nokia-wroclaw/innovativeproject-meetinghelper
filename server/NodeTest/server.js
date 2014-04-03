var fs = require('fs');
express = require('express.io');
app = express();

app.http().io();

var message = "";
var arr = [];
var photos = [];


var connection = require('./routes/connectionRoute.js');
var qrcode = require('./routes/qrcodeRoute.js');
var user = require('./routes/userRoute.js');
var room = require('./routes/roomRoute.js');

var sequelize = require('./models/db.js').Sequelize;

app.configure( function() {
    app.use(express.bodyParser());
  app.use(express.cookieParser());  
  app.use(express.session({ secret: "PWRTeam" }));

});
/*
sequelize
  .sync({ force: true })
  .complete(function(err) {
    // Even if we didn't define any foreign key or something else,
    // instances of Target will have a column SourceId!
  })
/*
*/


var form = "<!DOCTYPE HTML><html><body>" +
"<form method='post' action='/sendFile' enctype='multipart/form-data'>" +
"<input type='file' name='file'/>" +
"<input type='submit' /></form>" +
"</body></html>";

var form1 ="<form method='post' action='/users/register'>"+
    "<input type='text' name='username'>"+
    "<input type='submit'>"+
"</form>";

// Routes

app.io.route('ready', function(req) {
    req.io.broadcast('new visitor')
})

app.io.route('drawClick', function(req) {
    req.io.broadcast('draw', req.data)
})
app.io.route('testWebSocket', function(req) {
    console.log("Test dzia³a!")
})


app.get('/', connection.HelloWorld);
app.get('/ping', connection.Ping);

app.get('/rooms/create/:roomName', room.CreateRoom);
app.get('/rooms/join/:roomName', room.JoinRoom);
app.get('/rooms/liest', room.GetRoomsList);


app.get('/qrcode', qrcode.QRCode);
app.get('/qrcode/:address/:port', qrcode.QRCodeGenerator);
app.get('/qrcode/:groupCode', qrcode.QRCodeJoinGroup);

app.post('/login', user.Login);
app.post('/register', user.Register);
app.post('/logout', user.Logout);

app.get('/users/list', user.GetUsers);




app.get('/client', function(req, res) {
    res.sendfile(__dirname + '/client.html')
});

app.get('/meetingName', function(req, res) {
    res.send(meeting.photos.name);
});

app.get('/file', function(req, res) {
    	
    res.writeHead(200, {'Content-Type': 'text/html' });
	res.end(form);
});

app.get('/setMessage/:message', function(req, res) {
    arr.push(req.params.message);
    res.send('Dodano wiadomoœæ: ' + message);
});

app.get('/getMessage', function(req, res) {
    var result="";
    for (var i = 0; i < arr.length; i++) {
        result += arr[i] + "<br/>";
    }
    res.send(result);
});

app.get('/getPhot', function(req, res) {
    var result="";
    for (var i = 0; i < meeting.photos.length; i++) {
        result += meeting.photos[i] + "<br/>";
    }
    res.send(result);
});

app.get('/getPhotos', function(req, res) {
    res.send(JSON.stringify(photos));
});

app.get('/photoExist/:photoName', function(req, res) {
    var photoName = req.params.photoName;
    
    fs.exists('./uploads/'+photoName+'.jpg', function (exists) {
        if(exists){
            res.send("Plik istnieje");
        }
        else{
            res.send("Plik nie istnieje");
        }
    });
});

app.post('/sendFile', function(req, res) {

    fs.readFile(req.files.file.path, function (err, data) {

var newPath = __dirname + "/uploads/"+ req.files.file.name;
  fs.writeFile(newPath, data, function (err) {
      console.log("Plik zapisano: "+ req.files.file.name )
    res.send("Plik zapisano: "+ req.files.file.name );
  });
    });

    //meeting.photos.push(req.files.file.name);
    photos.push(req.files.file.name);

    req.io.broadcast('newPhoto', {
        message: req.files.file.name
    })
});


app.get('/user/:filename', function(req, res){
  var uid = req.params.filename;
  res.sendfile('./uploads/'+uid);
});

app.listen(1337, function() { }); 

