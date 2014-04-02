var fs = require('fs');

app = require('express.io')();
app.http().io();

var message = "";
var arr = [];
var photos = [];


var connection = require('./routes/connection.js');




app.configure( function() {
    app.use(require('express.io').bodyParser());
});

var form = "<!DOCTYPE HTML><html><body>" +
"<form method='post' action='/sendFile' enctype='multipart/form-data'>" +
"<input type='file' name='file'/>" +
"<input type='submit' /></form>" +
"</body></html>";

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
app.get('/rooms/create/:roomName', connection.CreateRoom);
app.get('/rooms/join/:roomName', connection.JoinRoom);
app.get('/qrcode', connection.QRCode);
app.get('/users/login/:mac', connection.Login);
app.get('/users/list', connection.GetUsers);




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

