var express = require('express');
var cors = require('cors');
var bodyParser = require('body-parser');
var useragent = require('express-useragent');

var app = module.exports = express();
app.use(bodyParser.json());
app.use(cors());
app.use(useragent.express());
var api = '/api/whoami';
app.get(api, function(request, response, next){
var language = request.acceptsLanguages();
var software = "OS: " + request.useragent.os + ", Browser: " + request.useragent.browser;
var ipaddress = request.ip;

  response.json({'ipaddress': ipaddress, 'language': language, 'Software': software})
})

app.listen(8000, function(){
  console.log('Working')
})
