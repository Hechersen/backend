const chai = require('chai');
const request = require('supertest');
const { app } = require('../app');

const { expect } = chai;
const authenticatedUser = request.agent(app);

before((done) => {
  authenticatedUser
    .post('/users/login')
    .send({ email: 'adminCoder@coder.com', password: 'adminCod3r123' }) 
    .end((err, res) => {
      if (err) return done(err);
      done();
    });
});

describe('Session API', () => {
  it('should login a user', (done) => {
    const user = {
      email: 'adminCoder@coder.com', 
      password: 'adminCod3r123' 
    };
    authenticatedUser
    .post('/users/login')
    .send(user)
    .expect(302) 
    .end((err, res) => {
      if (err) return done(err);
      authenticatedUser
        .get('/api/sessions/current')
        .expect(200)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.body).to.have.property('user');
          done();
        });
    });
  });

  it('should get the current session', (done) => {
    authenticatedUser
      .get('/api/sessions/current')
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body).to.have.property('user');
        done();
      });
  });
});
