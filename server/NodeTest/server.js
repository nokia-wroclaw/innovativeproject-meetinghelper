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

/*
* Requirement: none
* callback event: pong
*/

app.io.route('ping', connection.SocketPing);

/*
* Description: Get users online
* Requirement: logged, in room
* callback event: usersOnline ((userID, name)[])
*     
*/
app.io.route('users/online', user.UsersOnline); 

/*
* Description: Enter to meeting
* Requirement: logged
* callback event: joined (meetingID, name)
* hidden result: in room
*/
app.io.route('meetings/enterMeeting', meeting.EnterMeeting);


/*
* Requirement: none
* return: server version
*/
app.get('/api/', connection.HelloWorld);

/*
* Requirement: none
* return: PONG
*/
app.get('/api/ping', connection.Ping);

/*
* Description: Create Meeting
* Requirement: logged
* POST arguments:
*       - meetingName (string)
* return:         
*       - created meeting (object)
*/
app.post('/api/meetings/create', user.IsLogin, meeting.CreateRoom);

/*
* Description: Join to Meeting
* Requirement: logged
* POST arguments:
*       - meetingID (integer)
* return:         
*       - result (boolean)
*/
app.post('/api/meetings/join', user.IsLogin, meeting.JoinRoom);

/*
* Description: Join to Meeting by Code
* Requirement: logged
* POST arguments:
*       - accessCode (string)
* return:         
*       - result (boolean)
*/
app.post('/api/meetings/joinByCode', user.IsLogin, meeting.JoinRoomByCode);

/*
* Description: Get joined meeting
* Requirement: logged
* GET arguments:
*       - none
* return:         
*       - result (boolean)
*/
app.get('/api/meetings/list', user.IsLogin, meeting.GetRoomsList);

/*
* Description: Get all users from meeting
* Requirement: logged, in meeting
* GET arguments:
*       - none
* return:         
*       - List<users> (object)
*/
app.get('/api/meetings/users/getAll', user.IsLogin, meeting.IsRoom, meeting.GetUsers);


/*
* Description: Get qrcode
* Requirement: none
* GET arguments:
*       - none
* return:         
*       - qrCode (svg)
*/
app.get('/api/qrcode', qrcode.QRCode);

/*
* Description: Generate qrcode
* Requirement: none
* GET arguments:
*       - address name(string)
*       - port name (integer)
* return:         
*       - qrCode (svg)
*/
app.get('/api/qrcode/:address/:port', qrcode.QRCodeGenerator);
app.get('/api/qrcode/:groupCode', qrcode.QRCodeJoinGroup);

/*
* Description: Login
* Requirement: none
* POST arguments:
*       - login(string)
*       - password(string)
* return:         
*       - user(object)
*/
app.post('/api/login', user.Login);

/*
* Description: Register
* Requirement: none
* POST arguments:
*       - login(string)
*       - password(string)
* return:         
*       - userID(integer)
* hidden result: logged
*/
app.post('/api/register', user.Register);

/*
* Description: Logout
* Requirement: logged
* GET arguments:
*       - none
* return:         
*       - result(boolean)
*/
app.get('/api/logout',user.IsLogin, user.Logout);

/*
* Description: Get All Meterials from meeting
* Requirement: logged, in meeting
* GET arguments:
*       - none
* return:         
*       - materials[] (array of materials)
*/
app.get('/api/materials/getAll', user.IsLogin, meeting.IsRoom, material.GetAll);

/*
* Description: Send file to meeting
* Requirement: logged, in meeting
* POST arguments:
*       - file(file)
* return:         
*       - newfilename (string)
*/
app.post('/api/materials/sendFile', user.IsLogin, meeting.IsRoom, material.SendFile);

/*
* Description: Send file to meeting
* Requirement: logged, in meeting
* GET arguments:
*       - materialID(integer)
* return:         
*       - file (file)
*/
app.get('/api/materials/file/:materialID', user.IsLogin, meeting.IsRoom, material.DownloadFile);

/*
* Description: Send file to meeting
* Requirement: logged, in meeting
* GET arguments:
*       - materialID(integer)
* return:         
*       - file (file)
*/
app.get('/api/materials/file/miniature/:materialID', user.IsLogin, material.DownloadFileMiniature);


/*
* Description: Send file to meeting
* Requirement: logged, in meeting
* POST arguments:
*       - context
* return:         
*       - material (object)
*/
app.post('/api/materials/sendNote', user.IsLogin, meeting.IsRoom, material.SendNote);



/*
* Description: Comment material
* Requirement: logged, in meeting
* POST arguments:
*       - materialID(integer)
*       - content(string)
* return:         
*       - comment (object)
*/
app.post('/api/materials/comments/add', user.IsLogin, meeting.IsRoom, material.Comment);

/*
* Description: get comments for rooms
* Requirement: logged, in meeting
* GET arguments: none
* return:         
*       - comment[] (object)
*/
app.get('/api/materials/comments/getAll', user.IsLogin, meeting.IsRoom, material.GetAllComments);


/*
* Description: get comments for material
* Requirement: logged, in meeting
* GET arguments:
*       - materialID(integer)
* return:         
*       - comment (object)
*/
app.get('/api/materials/comments/:materialID', user.IsLogin, meeting.IsRoom, material.GetComment);



/*
* Description: Test login
*/
app.get('/api/reg', function(req, res) {
    	
    res.writeHead(200, {'Content-Type': 'text/html' });
	res.end(form1);
});

/*
* Description: Test generate database
*/
app.get('/api/generateDatabase', function(req, res) {
   sequelize
  .sync({ force: true })
  .complete(function(err) {
    res.endSuccess("Wygenerowano bazê danych");
    console.log("Wygenerowano bazê danych");
  })
});


app.listen(Config.port, function() { }); 
module.exports = app;

