const express = require('express');
const logger = require('morgan');
const bodyParser = require('body-parser');
const passport = require("passport");
const FacebookTokenStrategy = require("passport-facebook-token");
const cors = require("cors");
const expressValidator = require('express-validator');

const { userAuth } = require("./server/controllers/auth");
const appErrorHandler = require('./server/utils/errorHandler');
const config = require('./server/config/config');

const app = express();

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(expressValidator());
app.use(cors(config.CORS));

passport.use(
    new FacebookTokenStrategy({
        clientID: config.FACEBOOK_APP_ID,
        clientSecret: process.env.FACEBOOK_SECRET
    },
        function (accessToken, refreshToken, profile, done) {
            userAuth(accessToken, refreshToken, profile, function (err, user) {
                return done(err, user);
            });
        }
    ));

require('./server/routes')(app);
app.get('*', (req, res) => res.status(200).send({
    message: 'Welcome to the beginning of nothingness.',
}));

// Errors handling
app.use(appErrorHandler);

module.exports = app;
