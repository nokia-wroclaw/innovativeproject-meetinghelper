var testosterone = require('testosterone')({port: 1337})
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
  