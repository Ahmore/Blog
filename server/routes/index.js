const authController = require('../controllers/auth');
const passport = require("passport");
const { checkSchema } = require('express-validator/check');
const schemas = require("./../validation/schemas");
const errorHandler = require("./../validation/errorHandler");

module.exports = (app) => {
    app.get('/api', (req, res) => res.status(200).send({
        message: 'Welcome to the Todos API!!!',
    }));

    app.post('/api/auth/facebook', checkSchema(schemas.login), errorHandler, passport.authenticate('facebook-token', { session: false }), authController.prepareUser, authController.generateToken, authController.sendToken);
    // app.get('/api/auth/me', authController.authenticate, authController.getCurrentUser);
};