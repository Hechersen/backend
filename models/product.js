const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  title: String,
  price: Number,
  code: String,
}, {
  toObject: { getters: true },
  toJSON: { getters: true }
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
