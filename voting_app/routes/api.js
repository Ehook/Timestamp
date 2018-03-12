const express = require('express');

const router = express.Router({ caseSensitive: true });
const bcrypt = require('bcrypt-nodejs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const Poll = require('../models/polls');
// Update Poll Vote count
router.put('/polls/:id', (req, res) => {
  Poll.findByIdAndUpdate(
    { _id: req.params.id },
    {
      name: req.body.name,
      options: req.body.options,
    }, (err, docs) => {
      if (err) res.json(err);
      else {
        // console.log(docs);
      }
    },
  );
});

// Get Poll ID from url
router.get('/polls/:id', (request, response) => {
  const PollID = request.headers.referer.split('/')[4];
  response.send(PollID);
});
// Get all Polls
router.get('/polls', (request, response) => {
  Poll.find({}, (err, polls) => {
    if (err) {
      return response.status(400).send(err);
    }
    if (polls.length < 1) {
      return response.status(400).send('No polls here yet!');
    }
    // console.log(polls);
    return response.status(200).send(polls);
  });
});
// Create a new Poll
router.post('/polls', authenticate, (request, response) => {
  if (!request.body) {
    return response.status(400).send('No poll data supplied!');
  }
  const poll = new Poll();
  poll.name = request.body.name;
  poll.options = request.body.options;
  poll.user = request.body.user;
  poll.save((err, resource) => {
    if (err) {
      return response.status(400).send("couldn't save poll");
    }
    return response.status(201).send(resource);
  });
});
// Verify token
router.post('/verify', (request, response) => {
  if (!request.body.token) {
    return response.status(400).send('Invalid token');
  }
  jwt.verify(request.body.token, process.env.secret, (err, decoded) => {
    if (err) {
      return response.status(400).send('Error with token');
    }
    return response.status(200).send(decoded);
  });
});
// Login
router.post('/login', (request, response) => {
  if (request.body.name && request.body.password) {
    User.findOne({ name: request.body.name }, (err, user) => {
      if (err) {
        return response.status(400).send('An error has occured. Please try again.');
      }
      if (!user) {
        return response.status(404).send('No user has been registered with there Credentials');
      }
      if (bcrypt.compareSync(request.body.password, user.password)) {
        const token = jwt.sign({
          data: user,
        }, process.env.secret, { expiresIn: 3600 });
        return response.status(200).send(token);
      }
      return response.status(400).send('Password is not correct');
    });
  } else {
    return response.status(400).send('Please enter valid Credentials!');
  }
});
// Register
router.post('/register', (request, response) => {
  if (request.body.name && request.body.password) {
    const user = new User();
    user.name = request.body.name;
    console.time('bcryptHashing');
    user.password = bcrypt.hashSync(request.body.password, bcrypt.genSaltSync(10));
    console.timeEnd('bcryptHashing');
    user.save((err, document) => {
      if (err) {
        return response.status(400).send(err);
      }

      const token = jwt.sign({
        data: document,
      }, process.env.secret, { expiresIn: 360000 });
      return response.status(201).send(token);
    });
  } else {
    return response.status(400).send({
      message: 'Invalid Credentials supplied!',
    });
  }
});
// Authentication middleware
function authenticate(request, response, next) {
  if (!request.headers.authorization) {
    return response.status(400).send('No token supplied!');
  }
  if (request.headers.authorization.split(' ')[2]) {
    const token = request.headers.authorization.split(' ')[2];
    jwt.verify(token, process.env.secret, (err, decoded) => {
      if (err) {
        return response.status(400).send(err);
      }
      console.log('continuing with middleware chain!');
      next();
    });
  }
}


module.exports = router;
