const authController = require('../controllers/auth');
const controllers = require('../controllers');
const passport = require("passport");
const { checkSchema } = require('express-validator/check');
const schemas = require("./../validation/schemas");
const schemaErrorHandler = require("./../validation/errorHandler");

module.exports = (app) => {
    app.get('/api', (req, res) => res.status(200).send({
        message: 'Welcome to the Blog API!!!',
    }));

    // Authentication
    app.post('/api/auth/facebook', checkSchema(schemas.login), schemaErrorHandler, passport.authenticate('facebook-token', { session: false }), authController.prepareUser, authController.generateToken, authController.sendToken);
    // app.get('/api/auth/me', authController.authenticate, authController.getCurrentUser);

    // Users
    // Get all users
    app.get('/api/users', controllers.users.getAll);

    // Get user
    app.get('/api/users/:id', controllers.users.get);

    // Edit user
    app.put('/api/users/:id', controllers.users.update);

    // Delete user
    // app.delete('/api/users/:id', authController.authenticate);

    // Posts
    // Get all my posts including following users posts
    // app.get('/api/posts', authController.authenticate);

    // Get user posts
    // app.get('/api/posts/:userId', authController.authenticate);

    // Add post
    // app.post('/api/posts', authController.authenticate);

    // Edit post
    // app.put('/api/posts/:id', authController.authenticate);

    // Delete post
    // app.delete('/api/posts/:id', authController.authenticate);

    // Comments
    // Get post comments
    // app.get('/api/comments/:postId', authController.authenticate);

    // Add comment to post
    // app.post('/api/comments/:postId', authController.authenticate);

    // Edit comment
    // app.put('/api/comments/:id', authController.authenticate);

    // Delete comment
    // app.delete('/api/comments/:id', authController.authenticate);

    // Follows
    // Get following users
    // app.get('/api/follows', authController.authenticate);
};