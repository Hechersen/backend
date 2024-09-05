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

describe('Product API', () => {
  it('should get all products', (done) => {
    authenticatedUser
      .get('/api/products')
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body.payload).to.be.an('array');
        done();
      });
  });

  it('should get a product by ID', (done) => {
    const productId = '66c5dd516309c529f7fe068b';
    authenticatedUser
      .get(`/api/products/${productId}`)
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body).to.have.property('title');
        done();
      });
  });

  it('should add a new product', (done) => {
    const newProduct = {
      title: 'Test Product',
      price: 100,
      code: 'TEST123',
      category: 'Test',
      description: 'A test product',
      stock: 50
    };
    authenticatedUser
      .post('/api/products')
      .send(newProduct)
      .expect(201)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body).to.have.property('_id');
        done();
      });
  });
});
