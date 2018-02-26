//Requirements for mongoose and schema
const mongoose = require('mongoose')
const Schema = mongoose.Schema
//Model
const searchTeamSchema = new Schema(
  {
   searchVal: String,
   searchDate: Date
},
  {timestamp: true}
);
//Connects Model and collection
const ModelClass = mongoose.model('searchTerm', searchTeamSchema);

module.exports = ModelClass;
