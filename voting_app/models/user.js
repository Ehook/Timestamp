var mongoose = require('mongoose')
var Schema = mongoose.Schema;

var userSchema = new Schema ({
  name: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  }
});

userSchema.pre('save', function(){
  console.log('About to save username');
});
userSchema.post('save', function(){
  console.log('Successfully saved')
});
var Model = mongoose.model('User', userSchema);

module.exports = Model;
