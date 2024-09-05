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

describe('Cart API', () => {
  it('should create a new cart', (done) => {
    authenticatedUser
      .post('/api/carts')
      .expect(201)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body).to.be.an('object');
        done();
      });
  });

  it('should add a product to the cart', (done) => {
    const cartId = '66a3a9d25196fde9ff936a1d';
    const product = {
      productId: '66c5dd516309c529f7fe068b',
      quantity: 2
    };
    authenticatedUser
      .post(`/api/carts/${cartId}/products`)
      .send(product)
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body).to.have.property('products');
        done();
      });
  });
});
