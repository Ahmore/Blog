const jwt = require("jsonwebtoken");
const expressJwt = require("express-jwt");
const User = require("./../models").User;
const errorResponder = require('./../utils/errorResponder');
const successResponder = require('./../utils/successResponder');

const authenticate = expressJwt({
    secret: process.env.SERVER_SECRET,
    requestProperty: 'auth',
    getToken: function (req) {
        if (req.headers['x-auth-token']) {
            return req.headers['x-auth-token'];
        }
        return null;
    }
});

const authorize = (...roles) => {
    return (req, res, next) => {
        if (roles.indexOf("*") !== -1) {
            next();
        }
        else {
            if (roles.indexOf(req.auth.role) === -1) {
                return res.status(403).send(errorResponder('User not authorized.'));
            }
    
            next();    
        }
    }
};

const prepareUser = function (req, res, next) {
    if (!req.user) {
        return res.status(401).send(errorResponder('User Not Authenticated'));
    }

    // Prepare token for API
    req.auth = {
        id: req.user.id,
        email: req.user.email,
        role: req.user.role
    };

    next();
};

const createToken = function (auth) {
    return jwt.sign({
        id: auth.id,
        email: auth.email,
        role: auth.role
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
    // res.setHeader('x-auth-token', req.token);
    res.status(200).send(successResponder(req.token));
};

const userAuth = function (accessToken, refreshToken, profile, cb) {
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
    prepareUser: prepareUser,
    userAuth: userAuth,
    createToken: createToken,
    generateToken: generateToken,
    sendToken: sendToken,
    authenticate: authenticate,
    authorize: authorize
};