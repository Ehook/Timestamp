//Get requirements and instatiate some of them
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const Mongoose = require('mongoose');
const Bing = require('node-bing-api')({accKey: '2339dc348eb44a6c906d563731985fa7'})
const searchTerm =require('./models/searchTerm.js')

Mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/searchTerms')
const app = express();
app.use(bodyParser.json());
app.use(cors());

//Get call with required and not required params to do a search for an image
app.get('/api/recentsearchs', (req, res, next)=>{
  searchTerm.find({}, (err, data)=>
{
  res.json(data)
})
})

app.get('/api/imagesearch/:searchVal*', (req, res, next)=>{

  var {searchVal} = req.params
  var {offset} = req.query

  var data = new searchTerm({
    searchVal,
    searchDate: new Date()
  });
  //Save to searchTerm collection
  data.save(err =>{
    if(err){
      res.send('Error saving to database')
    }
  })
  var searchOffset;
//Does offset exist
if(offset){
  if(offset == 1){
    offset = 0;
    searchOffset = 1;
  }
  else if(offset>1){
    searchOffset = offset +1;
  }
}

Bing.images(searchVal,
  {
  top:(10 * searchOffset),
  skip: (10 * offset)
}, function(error, rez, body){
  var bingData = [];
  for(var i = 0; i<10; i++){
    bingData.push({
      url: body.value[i].webSearchUrl,
      snippet: body.value[i].name,
      thumbnail: body.value[i].thumbnailUrl,
      context: body.value[i].hostPageDisplayUrl
    })
  }
  res.json(bingData);
});
});

app.listen(process.env.PORT || 8000, () =>{
  console.log('Working!')
})
