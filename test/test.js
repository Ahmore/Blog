require('dotenv').config()

const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('./../app');
const should = chai.should();
const Sequelize = require('./../node_modules/sequelize/lib/sequelize');
const authController = require('./../server/controllers/auth');

const ENV = "test";
const config = require(`${__dirname}/../server/config/config.json`)[ENV];

// Connection to DB
let sequelize = new Sequelize(
    config.database, config.username, config.password, config
);

chai.use(chaiHttp);

describe('Blog', function () {
    let user1_token;
    let user2_token;
    
    before(function() {
        // Create token
        user1_token = authController.createToken({
            id: 1,
            email: 'test@test.pl',
            role: 'admin'
        });

        user2_token = authController.createToken({
            id: 2,
            email: 'test2@test.pl',
            role: 'admin'
        });

        // Truncate db with CASCADE option
        return sequelize.query("TRUNCATE TABLE \"Users\" CASCADE").then(function () {
            // Add 2 users
            let user1 = sequelize.query("INSERT INTO \"Users\" (\"id\", \"email\", \"role\", \"facebookProviderId\", \"facebookProviderToken\", \"createdAt\", \"updatedAt\") VALUES (\'1\', \'test@test.pl\', \'admin\', \' \', \' \', \'2018-04-23 20:00\', \'2018-04-23 20:00\')");
            let user2 = sequelize.query("INSERT INTO \"Users\" (\"id\", \"email\", \"role\", \"facebookProviderId\", \"facebookProviderToken\", \"createdAt\", \"updatedAt\") VALUES (\'2\', \'test2@test.pl\', \'admin\', \' \', \' \', \'2018-04-23 20:00\', \'2018-04-23 20:00\')");
            let user3 = sequelize.query("INSERT INTO \"Users\" (\"id\", \"email\", \"role\", \"facebookProviderId\", \"facebookProviderToken\", \"createdAt\", \"updatedAt\") VALUES (\'3\', \'test3@test.pl\', \'admin\', \' \', \' \', \'2018-04-23 20:00\', \'2018-04-23 20:00\')");

            return Promise.all([
                user1,
                user2
            ]);
        });
    });

    it('Should show API message on /api GET', function (done) {
        chai.request(server)
            .get('/api')
            .end(function (err, res) {
                res.should.have.status(200);

                res.body.should.have.property("message");
                res.body.message.should.be.a("string");
                res.body.message.should.equal("Welcome to the Blog API!");

                done();
            });
    });

    describe('Users', function () {
        it('Should return non empty users list', function (done) {
            chai.request(server)
            .get('/api/users')
            .set('x-auth-token', user1_token)
            .end(function (err, res) {
                res.should.have.status(200);

                res.body.should.have.property("amount");
                res.body.amount.should.be.a("number");
                res.body.amount.should.equal(3);

                res.body.should.have.property("data");
                res.body.data.should.be.an("array");

                done();
            });
        });

        it('Should return user details', function (done) {
            chai.request(server)
            .get('/api/users/1')
            .set('x-auth-token', user1_token)
            .end(function (err, res) {
                res.should.have.status(200);

                res.body.should.have.property("data");
                res.body.data.should.be.an("object");
                
                res.body.data.should.have.property("id");
                res.body.data.id.should.be.a("number");
                res.body.data.id.should.equal(1);

                done();
            });
        });
        
        it('Should edit user and return updated details', function (done) {
            chai.request(server)
            .put('/api/users/3')
            .set('x-auth-token', user1_token)
            .send({ role: 'user' })
            .end(function (err, res) {
                res.should.have.status(200);
                
                res.body.should.have.property("data");
                res.body.data.should.be.an("object");

                res.body.data.should.have.property("role");
                res.body.data.role.should.be.a("string");
                res.body.data.role.should.equal("user");

                done();
            });
        });
        
        it('Should delete user', function (done) {
            chai.request(server)
            .delete('/api/users/3')
            .set('x-auth-token', user1_token)
            .end(function (err, res) {
                res.should.have.status(204);

                done();
            });
        });
        
        it('Should return error while deleting user again, because user doesn\'t exist', function (done) {
            chai.request(server)
            .delete('/api/users/3')
            .set('x-auth-token', user1_token)
            .end(function (err, res) {
                res.should.have.status(404);

                done();
            });
        });
    });

    // describe('Posts', function () {
    //     it('Should add post', function (done) {

    //     });

    //     it('Should return non empty user posts list', function (done) {

    //     });

    //     it('Should edit post', function (done) {

    //     });

    //     it('Should delete post', function (done) {

    //     });
        
    //     it('Should return error while deleting post again, because post doesn\'t exist', function (done) {
            
    //     });
    // });
    
    // describe('Comments', function () {
    //     it('Should add comment to post', function (done) {

    //     });

    //     it('Should return non empty post comments list', function (done) {

    //     });

    //     it('Should edit comment', function (done) {

    //     });

    //     it('Should delete comment', function (done) {

    //     });
        
    //     it('Should return error while deleting comment again, because comment doesn\'t exist', function (done) {
            
    //     });
    // });
    
    // describe('Follows', function () {
    //     it('Should add follow', function (done) {

    //     });

    //     it('Should return non empty user follows list', function (done) {

    //     });

    //     it('Should add follower', function (done) {

    //     });

    //     it('Should return non empty user followers list', function (done) {

    //     });

    //     it('Should delete follow', function (done) {

    //     });
        
    //     it('Should return error while deleting follow again, because follow doesn\'t exist', function (done) {
            
    //     });
    // });
});