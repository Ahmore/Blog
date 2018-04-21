require('dotenv').config()

const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('./../app');
const should = chai.should();

chai.use(chaiHttp);

describe('Todos', function() {
  it('should list ALL Todos on /api GET', function(done) {
    chai.request(server)
      .get('/api')
      .end(function(err, res) {
        res.should.have.status(200);
        done();
      });
  });
});