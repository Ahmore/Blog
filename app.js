const express = require('express');
const logger = require('morgan');
const bodyParser = require('body-parser');
const passport = require("passport");
const FacebookTokenStrategy = require("passport-facebook-token");
const { userAuth } = require("./server/controllers/auth");
const cors = require("cors");

const app = express();
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

passport.use(
  new FacebookTokenStrategy({
    clientID: '164788700874989',
    clientSecret: process.env.FACEBOOK_SECRET
  },
  function (accessToken, refreshToken, profile, done) {
    userAuth(accessToken, refreshToken, profile, function(err, user) {
      return done(err, user);
    });
  }
));

var corsOption = {
  origin: true,
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  exposedHeaders: ['x-auth-token']
};
app.use(cors(corsOption));

require('./server/routes')(app);
app.get('*', (req, res) => res.status(200).send({
  message: 'Welcome to the beginning of nothingness.',
}));

module.exports = app;
