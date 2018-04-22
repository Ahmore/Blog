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
    app.get('/api/users', authController.authenticate, controllers.users.getAll);

    // Get user
    app.get('/api/users/:id', authController.authenticate, controllers.users.get);

    // Edit user
    app.put('/api/users/:id', authController.authenticate, controllers.users.update);

    // Delete user
    app.delete('/api/users/:id', authController.authenticate, controllers.users.destroy);



    // Posts
    // Get all my posts including following users posts
    app.get('/api/posts', authController.authenticate, controllers.posts.getAll);

    // Get user posts
    app.get('/api/posts/:userId', authController.authenticate, controllers.posts.getUserPosts);

    // Add post
    app.post('/api/posts', authController.authenticate, controllers.posts.create);

    // Edit post
    app.put('/api/posts/:id', authController.authenticate, controllers.posts.update);

    // Delete post
    app.delete('/api/posts/:id', authController.authenticate, controllers.posts.destroy);



    // Comments
    // Get post comments
    app.get('/api/comments/:postId', authController.authenticate, controllers.comments.getPostComments);

    // Add comment to post
    app.post('/api/comments/:postId', authController.authenticate, controllers.comments.create);

    // Edit comment
    app.put('/api/comments/:id', authController.authenticate, controllers.comments.update);

    // Delete comment
    app.delete('/api/comments/:id', authController.authenticate, controllers.comments.destroy);



    // Follows
    // Get following users
    app.get('/api/follows', controllers.follows.getFollows);
    
    // Get followers
    app.get('/api/follows/followers', controllers.follows.getFollowers);

    // Add following user
    app.post('/api/follows/:userId', controllers.follows.create);

    // Delete following user
    app.delete('/api/follows', controllers.follows.destroy);
};