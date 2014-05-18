/*var testosterone = require('testosterone')({port: 1337})
  , assert = testosterone.assert;

testosterone
  .get('/api/', function (res) {
    assert.equal(res.statusCode, 200);
  })
  .get('/api/ping', function (res) {
    assert.equal(res.statusCode, 200);
    assert.equal(JSON.parse(res.body), 'PONG');
  })

  .post('/api/register', {login:"test", password:"test"}, function (res) {
    assert.equal(res.statusCode, 200);
  })
  .post('/api/login', {login:"test", password:"test"}, function (res) {
    assert.equal(res.statusCode, 200);
  })
  .get('/api/logout', function (res) {
    assert.equal(res.statusCode, 200);
  })
  .get('/api/photoExist/:photoName', function (res) {
    assert.equal(res.statusCode, 200);
  })
  */




/* read documentation https://github.com/visionmedia/supertest
/* install mocha
*  run server
*  then
*  run command:
*      mocha
*/



var request = require('supertest');
var server = request.agent('http://localhost:1337');



describe('GET /api/generateDatabase', function(){
    it('Recreade database', function(done){
    server
        .get('/api/generateDatabase')                       
        .expect(200)
        .end(function(err, res){
            if (err) return done(err);
            console.log(res.body);
            done()
        });
    });
});


describe('GET /api/register', function(){
    it('Register', function(done){
    server
            .post('/api/register')
            .send({ login: 'test', password: 'test' })
            .expect(200)
            .end(function(err, res){
            if (err) return done(err);
            console.log(res.body);
            done()
        });
    });
});


describe('GET /api/login', function(){
    it('Login', function(done){
    server
            .post('/api/login')
            .send({ login: 'test', password: 'test' })
            .expect(200)
            .end(function(err, res){
            if (err) return done(err);
            console.log(res.body);
            done()
        });
    });
});


/*********************************
**    Here our tests            **
*********************************/


describe('GET /api/ping', function(){
    it('ping', function(done){
    server
        .get('/api/ping')                       
        .expect(200)
        .expect(JSON.stringify("PONG"))
        .end(function(err, res){
            if (err) return done(err);
            console.log(res.body);
            done()
        });
    });
});


describe('GET /api/meetings/create', function(){
    it('Create Meeting', function(done){
    server
            .post('/api/meetings/create')
            .send({ meetingName: 'testowy' })
            .expect(200)
            .end(function(err, res){
            if (err) return done(err);
            console.log(res.body);
            done()
        });
    });
});


describe('GET /api/meetings/join', function(){
    it('Join Meeting', function(done){
    server
            .post('/api/meetings/join')
            .send({ meetingID: '1' })
            .expect(200)
            .end(function(err, res){
            if (err) return done(err);
            console.log(res.body);
            done()
        });
    });
});
