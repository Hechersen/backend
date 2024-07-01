const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  first_name: { type: String, required: true },
  last_name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  age: { type: Number, required: true },
  password: {
    type: String,
    required: function () { return !this.githubId; }
  },
  cart: { type: Schema.Types.ObjectId, ref: 'Cart' },
  role: { type: String, default: 'user' }, // 'user' o 'admin'
  githubId: { type: String, unique: true, sparse: true }
});

module.exports = mongoose.model('User', userSchema);

