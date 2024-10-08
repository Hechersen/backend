const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const passwordResetTokenSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  token: {
    type: String,
    required: true
  },
  expiresAt: {
    type: Date,
    required: true
  }
});

module.exports = mongoose.model('PasswordResetToken', passwordResetTokenSchema);
