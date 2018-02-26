var express = require('express')
var bodyParser = require('body-parser')
var cors = require('cors')
var multer = require('multer')

var app = module.exports = express();
app.use(bodyParser.json());
app.use(cors());
var upload = multer({dest: 'uploads/'});
app.use(express.static(__dirname + "/public"));

// app.get('/', function(req, res, next){
//   res.sendFile(__dirname + "/index.html");
// })

app.post('/upload', upload.single('file'), function(req, res, next){
return res.json(req.file)
});

app.listen(8000, function(){
  console.log('working')
});
