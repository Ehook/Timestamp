var express = require('express');
var cors = require('cors');
var bodyParser = require('body-parser');
var MongoClient = require('mongodb').MongoClient;

var app = express();
app.use(bodyParser.json());
app.use(cors());

var appurl = 'localhost:8000/'

MongoClient.connect('mongodb://localhost:27017/urlshort', function(err, db){
  app.get('/new/:url(*)' ,function(req, res){
    var initurl = req.params.url
    var uniqueID = new Date().getTime();
    uniqueID = uniqueID.toString();
    uniqueID = uniqueID.slice(0, -2);
    var newurl = appurl + uniqueID;
    db.collection('urlshort').insert({
        "longUrl": initurl,
        "shortUrl": newurl,
        "uniqueID": uniqueID
    }, function(error, data){
      if(error){
        console.log("There was a problem collecting data")
      }
      var long = data.ops[0].longUrl
      var shortened = data.ops[0].shortUrl
      var obj = {"original_url": long, "short_url": shortened}
      res.send(obj)
    })
  })
  app.get('/:uniqueID', function(req, res){
    var uniqueID = req.params.uniqueID;

    db.collection('urlshort').find({
      "uniqueID": uniqueID
    }).toArray(function(err, data){
      if(err){
        return console.log("There was an error finding the shortened url")
      }
      if(data.length == 0){
        return console.log("There is no shorten url matches this one in the database")
      }
      var l = data[0].longUrl
      if(l.indexOf("http") == -1){l = "http://"+ l}
      res.redirect(l);
    })

  })
})

app.listen(8000, function(){
  console.log('Working')
})
