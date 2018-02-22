var portNumber = process.argv[2]
var express = require('express')
var app = express()
var path = require('path')
var bodyparser = require('body-parser')
var stylus = require('stylus')
var url = require('url')
var fs = require('fs')
app.use(bodyparser.urlencoded({ extended: false }));
var jsonParser = bodyparser.json()

app.get('/books', function (req, res) {
  fs.readFile(process.argv[3], 'utf8', function(err, data){
    obj = JSON.parse(data)
    res.json(obj)
    res.sendFile(path.join(portNumber));

  })
})


app.listen(portNumber)
