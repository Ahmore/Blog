const jwt = require("jsonwebtoken");
const expressJwt = require("express-jwt");
const User = require("./../models").User;

const authenticate = expressJwt({
    secret: process.env.SERVER_SECRET,
    requestProperty: 'auth',
    getToken: function(req) {
        if (req.headers['x-auth-token']) {
            return req.headers['x-auth-token'];
        }
        return null;
    }
});

const getCurrentUser =  function(req, res, next) {
    User.findById(req.auth.id).then(user => {
        if (!user) {
            return res.status(404).send({
                message: 'User Not Found',
            });
        }
        
        return res.status(200).send(user);
    });
};

const prepareUser = function(req, res, next) {
    if (!req.user) {
        return res.status(401).send({
            message: 'User Not Authenticated',
        });
    }

    // Prepare token for API
    req.auth = {
      id: req.user.id,
      email: req.user.email
    };

    next();
};

const createToken = function(auth) {
    return jwt.sign({
        id: auth.id
    }, 
    process.env.SERVER_SECRET,
    {
        expiresIn: 60 * 120
    });
};
  
const generateToken = function (req, res, next) {
    req.token = createToken(req.auth);
    next();
};
  
const sendToken = function (req, res) {
    res.setHeader('x-auth-token', req.token);
    res.status(200).send(req.auth);
};

const userAuth = function(accessToken, refreshToken, profile, cb) {
    return User.findOne({
        where: {
            facebookProviderId: profile.id
        }
    })
    .then(user => {
        if (!user) {
            User.create({
                email: profile.emails[0].value,
                facebookProviderId: profile.id,
                facebookProviderToken: accessToken
            })
            .then(user => {
                cb(null, user);
            })
            .catch(error => {
                cb(error, null);
            });
        }
        else {
            cb(null, user);
        }
    })
    .catch(error => {
        cb(error, null);
    });
};

module.exports = {
    getCurrentUser: getCurrentUser,
    prepareUser: prepareUser,
    userAuth: userAuth,
    createToken: createToken,
    generateToken: generateToken,
    sendToken: sendToken,
    authenticate: authenticate
};