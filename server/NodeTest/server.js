var fs = require('fs');
express = require('./node_extentions/express.js')
app = express().http().io()

var connect = require('connect');

var connection = require('./routes/connectionRoute.js');
var qrcode = require('./routes/qrcodeRoute.js');
var user = require('./routes/userRoute.js');
var meeting = require('./routes/meetingRoute.js');
var material = require('./routes/materialRoute.js');

var sequelize = require('./models/db.js').Sequelize;
var Config = require('./config/index.js')();
var Cookie = require('cookie');

MemoryStore = express.session.MemoryStore,
sessionStore = new MemoryStore();

app.configure( function() {
    app.use(express.static(__dirname + '/www'));
    app.use(express.logger());
    app.use(express.bodyParser());
    app.use(express.cookieParser());  
    app.use(express.session({ store: sessionStore, secret: 'PWRTeam', key: 'express.sid'}));

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
app.io.set('authorization', function(data, accept){
    if(data.headers.cookie){
        data.cookie = Cookie.parse(data.headers.cookie);
        data.cookie = connect.utils.parseSignedCookies(data.cookie, 'PWRTeam');
        data.sessionID = data.cookie["express.sid"];

         console.log("\n sessionID = "+ data.sessionID + "\n");
        sessionStore.get(data.sessionID, function(err, session){
            if(err || !session){
                accept("Error,", false);
            } else{
                data.session = session;
                accept(null, true);
            }
        })
    }
    else{
        return accept("No Transmitted cookie", false)
    }
    });

app.io.on('connection', connection.Connected);

app.io.route('ping', connection.SocketPing);
app.io.route('users/online', user.UsersOnline); 
app.io.route('meetings/enterMeeting', meeting.EnterMeeting);

app.get('/api/', connection.HelloWorld);
app.get('/api/ping', connection.Ping);

app.post('/api/meetings/create', user.IsLogin, meeting.CreateRoom);
app.post('/api/meetings/join', user.IsLogin, meeting.JoinRoom);
app.post('/api/meetings/joinByCode', user.IsLogin, meeting.JoinRoomByCode);
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

app.get('/api/user/:filename', function(req, res){
  var uid = req.params.filename;
  res.sendfile('./uploads/'+uid);
});

app.listen(Config.port, function() { }); 


module.exports = app;

