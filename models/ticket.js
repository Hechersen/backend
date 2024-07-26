const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ticketSchema = new Schema({
  purchaser: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  amount: { type: Number, required: true },
  code: { type: String, required: true, unique: true },
  products: [{ product: { type: Schema.Types.ObjectId, ref: 'Product' }, quantity: Number }],
  purchaseDate: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Ticket', ticketSchema);
