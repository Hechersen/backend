const User = require('../../models/user');

class UserManager {
  async createUser(userData) {
    const user = new User(userData);
    await user.save();
    return user;
  }

  async findUserByEmail(email) {
    return await User.findOne({ email });
  }

  async findUserById(userId) {
    return await User.findById(userId);
  }

  async updateUser(userId, updateData) {
    return await User.findByIdAndUpdate(userId, updateData, { new: true });
  }

  async deleteUser(userId) {
    return await User.findByIdAndDelete(userId);
  }
}

module.exports = UserManager;

