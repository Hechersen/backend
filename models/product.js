const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const productSchema = new mongoose.Schema({
  title: String,
  price: Number,
  code: String,
  category: String,
  description: String,
  availability: Boolean,
  stock: Number
}, {
  toObject: { getters: true },
  toJSON: { getters: true }
});

productSchema.plugin(mongoosePaginate);

const Product = mongoose.model('Product', productSchema);

module.exports = Product;

