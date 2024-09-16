const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const documentSchema = new Schema({
  name: { type: String, required: true },
  reference: { type: String, required: true }
});

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
  role: { type: String, enum: ['user', 'premium', 'admin'], default: 'user' },
  githubId: { type: String, unique: true, sparse: true },
  documents: [documentSchema],  // Esquema de documentos
  last_connection: { type: Date }  // Última conexión
});

module.exports = mongoose.model('User', userSchema);
