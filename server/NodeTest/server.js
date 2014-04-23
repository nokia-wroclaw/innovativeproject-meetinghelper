var fs = require('fs');
express = require('express.io')
app = express().http().io()

//RedisStore = require('connect-redis')(express);

var connection = require('./routes/connectionRoute.js');
var qrcode = require('./routes/qrcodeRoute.js');
var user = require('./routes/userRoute.js');
var meeting = require('./routes/meetingRoute.js');
var material = require('./routes/materialRoute.js');

var sequelize = require('./models/db.js').Sequelize;
var Config = require('./config/index.js')();

app.configure( function() {
    app.use(express.static(__dirname + '/www'));
    app.use(express.logger());
    app.use(express.bodyParser());
    app.use(express.cookieParser());  
    app.use(express.session({ secret: "PWRTeam" }));
  //app.use(express.session({ store: new RedisStore, secret: "PWRTeam" }))
});

 sequelize.sync();

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

app.io.on('connection', connection.Connected);

app.io.route('ping', connection.SocketPing);
app.io.route('users/online', user.UsersOnline); 
app.io.route('meetings/enterMeeting', meeting.EnterMeeting);

app.get('/api/', connection.HelloWorld);
app.get('/api/ping', connection.Ping);

app.post('/api/meetings/create', user.IsLogin, meeting.CreateRoom);
app.post('/api/meetings/join', user.IsLogin, meeting.JoinRoom);
app.get('/api/meetings/list', user.IsLogin, meeting.GetRoomsList);


app.get('/api/qrcode', qrcode.QRCode);
app.get('/api/qrcode/:address/:port', qrcode.QRCodeGenerator);
app.get('/api/qrcode/:groupCode', qrcode.QRCodeJoinGroup);

app.post('/api/login', user.Login);
app.post('/api/register', user.Register);
app.get('/api/logout',  user.Logout);

app.post('/api/materials/sendFile', user.IsLogin, meeting.IsRoom, material.SendFile);



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

app.listen(Config.port, function() { }); 

