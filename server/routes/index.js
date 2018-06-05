const controllers = require('../controllers');
const passport = require("passport");
const { checkSchema } = require('express-validator/check');
const schemas = require("./../validation/schemas");
const schemaErrorHandler = require("./../validation/errorHandler");

module.exports = (app) => {
    app.get('/api', (req, res) => res.status(200).send({
        message: 'Welcome to the Blog API!',
    }));

    // Authentication
    app.post('/api/auth/facebook', checkSchema(schemas.login), schemaErrorHandler, passport.authenticate('facebook-token', { session: false }), controllers.auth.prepareUser, controllers.auth.generateToken, controllers.auth.sendToken);



    // Users
    // Get all users
    app.get('/api/users', controllers.auth.authenticate, controllers.auth.authorize("*"), controllers.users.getAll);

    // Get user
    app.get('/api/users/:id', controllers.auth.authenticate, controllers.auth.authorize("*"), controllers.users.get);

    // Edit user
    app.put('/api/users/:id', checkSchema(schemas.user), controllers.auth.authenticate, controllers.auth.authorize("admin"), controllers.users.update);

    // Delete user
    app.delete('/api/users/:id', controllers.auth.authenticate, controllers.auth.authorize("admin"), controllers.users.destroy);



    // Posts
    // Get all my posts including following users posts
    app.get('/api/posts', controllers.auth.authenticate, controllers.auth.authorize("*"), controllers.posts.getAll);

    // Get user posts
    app.get('/api/posts/:userId', controllers.auth.authenticate, controllers.auth.authorize("*"), controllers.posts.getUserPosts);

    // Add post
    app.post('/api/posts', checkSchema(schemas.post), controllers.auth.authenticate, controllers.auth.authorize("*"), controllers.posts.create);

    // Edit post
    app.put('/api/posts/:id', checkSchema(schemas.post), controllers.auth.authenticate, controllers.auth.authorize("*"), controllers.posts.update);

    // Delete post
    app.delete('/api/posts/:id', controllers.auth.authenticate, controllers.auth.authorize("*"), controllers.posts.destroy);



    // Comments
    // Get post comments
    app.get('/api/comments/:postId', controllers.auth.authenticate, controllers.auth.authorize("*"), controllers.comments.getPostComments);

    // Add comment to post
    app.post('/api/comments/:postId', checkSchema(schemas.comment), controllers.auth.authenticate, controllers.auth.authorize("*"), controllers.comments.create);

    // Edit comment
    app.put('/api/comments/:id', checkSchema(schemas.comment), controllers.auth.authenticate, controllers.auth.authorize("*"), controllers.comments.update);

    // Delete comment
    app.delete('/api/comments/:id', controllers.auth.authenticate, controllers.auth.authorize("*"), controllers.comments.destroy);



    // Follows
    // Get following users
    app.get('/api/follows', controllers.auth.authenticate, controllers.auth.authorize("*"), controllers.follows.getFollows);

    // Get followers
    app.get('/api/followers', controllers.auth.authenticate, controllers.auth.authorize("*"), controllers.follows.getFollowers);

    // Add following user
    app.post('/api/follows/:userId', controllers.auth.authenticate, controllers.auth.authorize("*"), controllers.follows.create);

    // Delete following user
    app.delete('/api/follows/:id', controllers.auth.authenticate, controllers.auth.authorize("*"), controllers.follows.destroy);
};
