const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const PollsSchema = new Schema({
  user: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'User',
  },
  name: {
    type: String,
    required: true,
    unique: true,
  },
  options: [{
    name: {
      type: String,
      required: true,
      unique: true,
    },
    votes: {
      type: Number,
      default: 0,
    },
  }],
});
const Model = mongoose.model('Polls', PollsSchema);
module.exports = Model;
