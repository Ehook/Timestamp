// Create db connection string
const db = 'mongodb://localhost:27017/free-code-camp-voting';

// Create a port for server to listen on
const port = process.env.PORT || 8000;

// Load in Router
const router = require('./routes/api');

// Load in node modules
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const dotenv = require('dotenv');

// Create an express application
const app = express();

// Load in environment variables
dotenv.config({ verbose: true });

// Connect to Mongo
mongoose.connect(db, (err) => {
  if (err) {
    alert(err);
  }
});

// Listen to mongoose connection events
mongoose.connection.on('connected', () => {
  // console.log(`Successfully connected to ${db}`);
});
mongoose.connection.on('disconnected', () => {
  // console.log(`Successfully disconnceted from ${db}`);
});
mongoose.connection.on('error', () => {
  // console.log(`An error has occured connecting to${db}`);
});
// Configure express middleware
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/node_modules', express.static(`${__dirname}/node_modules`));
app.use(express.static(`${__dirname}/public`));
app.use('/api', router);
app.get('*', (request, response) => {
  response.sendFile(`${__dirname}/public/index.html`);
});

// Start up our server
app.listen(port, () => {
  // console.log(`Listening to ${port}`);
});
