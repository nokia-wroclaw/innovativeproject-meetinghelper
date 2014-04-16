var fs = require('fs');
express = require('express.io');

app = express();


app.http().io();

//RedisStore = require('connect-redis')(express);
var arr = [];
var photos = [];


var connection = require('./routes/connectionRoute.js');
var qrcode = require('./routes/qrcodeRoute.js');
var user = require('./routes/userRoute.js');
var room = require('./routes/roomRoute.js');

var sequelize = require('./models/db.js').Sequelize;

app.configure( function() {
    app.use(express.static(__dirname + '/www'));
    app.use(express.logger());
    app.use(express.bodyParser());
    app.use(express.cookieParser());  
    app.use(express.session({ secret: "PWRTeam" }));
  //app.use(express.session({ store: new RedisStore, secret: "PWRTeam" }))

});
/*
io.set('authorization', function (handshakeData, accept) {

  if (handshakeData.headers.cookie) {

    handshakeData.cookie = cookie.parse(handshakeData.headers.cookie);

    handshakeData.sessionID = connect.utils.parseSignedCookie(handshakeData.cookie['express.sid'], 'secret');

    if (handshakeData.cookie['express.sid'] == handshakeData.sessionID) {
      return accept('Cookie is invalid.', false);
    }

  } else {
    return accept('No cookie transmitted.', false);
  } 

  accept(null, true);
});*/
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
"<form method='post' action='/api/sendFile' enctype='multipart/form-data'>" +
"<input type='file' name='file'/>" +
"<input type='submit' /></form>" +
"</body></html>";

var form1 ="<form method='post' action='/api/login'>"+
    "<input type='text' name='login'>"+
     "<input type='text' name='password'>"+
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


app.io.sockets.on('connection', function (socket) {
    console.log("Ktos do³¹czyl");
  socket.on('enterRoom', function (data) {
      user.SNewUser(socket, data);
  });
});


app.get('/api/', connection.HelloWorld);
app.get('/api/ping', connection.Ping);

app.get('/api/rooms/create/:roomName', user.IsLogin, room.CreateRoom);
app.get('/api/rooms/join/:roomID', user.IsLogin, room.JoinRoom);
app.get('/api/rooms/list', user.IsLogin, room.GetRoomsList);


app.get('/api/qrcode', qrcode.QRCode);
app.get('/api/qrcode/:address/:port', qrcode.QRCodeGenerator);
app.get('/api/qrcode/:groupCode', qrcode.QRCodeJoinGroup);

app.post('/api/login', user.Login);
app.post('/api/register', user.Register);
app.get('/api/logout',  user.Logout);

app.get('/api/users/list', user.IsLogin, user.GetUsers);



app.get('/api/meetingName', function(req, res){
    res.send(meeting.photos.name);
});

app.get('/api/reg', function(req, res) {
    	
    res.writeHead(200, {'Content-Type': 'text/html' });
	res.end(form1);
});

app.get('/api/file', function(req, res) {
    	
    res.writeHead(200, {'Content-Type': 'text/html' });
	res.end(form);
});

app.get('/api/generateDatabase', function(req, res) {
   sequelize
  .sync({ force: true })
  .complete(function(err) {
    res.end("Wygenerowano bazê danych");
    console.log("Wygenerowano bazê danych");
  })
});

app.get('/api/getPhot', function(req, res) {
    var result="";
    for (var i = 0; i < meeting.photos.length; i++) {
        result += meeting.photos[i] + "<br/>";
    }
    res.send(result);
});

app.get('/api/getPhotos', function(req, res) {
    res.send(JSON.stringify(photos));
});

app.get('/api/photoExist/:photoName', function(req, res) {
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

app.post('/api/sendFile', function(req, res) {

    fs.readFile(req.files.file.path, function (err, data) {

var newPath = __dirname + "/uploads/"+ req.files.file.name;
  fs.writeFile(newPath, data, function (err) {
      console.log("Plik zapisano: "+ req.files.file.name )
    res.send("Plik zapisano: "+ req.files.file.name );
  });
    });

    photos.push(req.files.file.name);

    req.io.broadcast('newPhoto', {
        message: req.files.file.name
    })
});


app.get('/api/user/:filename', function(req, res){
  var uid = req.params.filename;
  res.sendfile('./uploads/'+uid);
});

app.listen(1337, function() { }); 

