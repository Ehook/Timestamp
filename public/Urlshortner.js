var express = require('express');
var cors = require('cors');
var bodyParser = require('body-parser');
var MongoClient = require('mongodb').MongoClient;

var app = module.exports = express();
app.use(bodyParser.json());
app.use(cors());
app.use(express.static(__dirname + '/public'));

var url = '/new/:url(*)';
var appurl = 'localhost:8000/'
var urlrequest = 0;

MongoClient.connect('mongodb://localhost:27017/urlshort', function(err, db){
  app.get(url ,function(request, response, next){
    var initurl = request.params.url
    urlrequest++
    //var newurllength = new Array(initurl);
    var newurl = appurl + (urlrequest * 2 + 1000);
    var result = newurl.link(initurl)

    db.collection('urlshort').insert({
        "longUrl": initurl,
        "shortUrl": newurl,
        "uniqueID": urlrequest
    }, function(error, data){
      if(error){
        console.log("There was a problem collecting data")
      }
      console.log(data)
    })
    /*if(console.error()){
      throw err;
    }
    else{
      response.json({'NewURL': result, 'OldURL': initurl})
      console.log('Created New Link! ' + newurl)
    }*/
  })
})
app.get('/:newurl', function(request, response){
  var shortenedurl = request.params.newurl;
  if(shortenedurl.indexOf("http") == -1){shortenedurl = "http://"+shortenedurl}
  request.redirect(shortenedurl);
})

app.listen(8000, function(){
  console.log('Working')
})