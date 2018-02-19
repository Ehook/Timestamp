var express = require('express')
var bodyParser = require('body-parser')
var cors = require('cors')

var app = module.exports = express();
app.use(bodyParser.json());
app.use(cors());

app.get('/dateValues/:dateVal', function(request, respond, next){
var DateVal = request.params.dateVal;

var DateFormatting =  {
  year: 'numeric',
  month: 'long',
  day: 'numeric'
}
if(isNaN(DateVal)){
   var naturalDate = new Date(DateVal);
   if (naturalDate == "Invalid Date"){
     naturalDate = null;
     unixDate = null;
   }else{
   naturalDate = naturalDate.toLocaleDateString('en-us', DateFormatting);
   var unixDate = new Date(DateVal).getTime()/1000;
   }
 }else{
   var unixDate = DateVal;
   var naturalDate = new Date(DateVal *1000);
   naturalDate = naturalDate.toLocaleDateString('en-us', DateFormatting);
 }
respond.json({unix: unixDate, natural: naturalDate});
});




app.listen(8000, function(){
  console.log('Good Job!')
})
