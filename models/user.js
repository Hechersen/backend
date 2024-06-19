const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  email: { type: String, required: true, unique: true },
  password: {
    type: String,
    required: function () { return !this.githubId; }
  },
  role: { type: String, default: 'user' }, // 'user' o 'admin'
  githubId: { type: String, unique: true, sparse: true }
});

module.exports = mongoose.model('User', userSchema);
