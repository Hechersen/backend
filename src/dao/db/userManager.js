const User = require('../../models/user');
const logger = require('../../utils/logger');

class UserManager {
  async createUser(userData) {
    try {
      const user = new User(userData);
      await user.save();
      return user;
    } catch (error) {
      logger.error('Error creating user:', error);
      throw new Error('Error creating user');
    }
  }

  async findUserByEmail(email) {
    try {
      return await User.findOne({ email });
    } catch (error) {
      logger.error('Error finding user by email:', error);
      throw new Error('Error finding user by email');
    }
  }

  async findUserById(userId) {
    try {
      return await User.findById(userId);
    } catch (error) {
      logger.error('Error finding user by ID:', error);
      throw new Error('Error finding user by ID');
    }
  }

  async updateUser(userId, updateData) {
    try {
      return await User.findByIdAndUpdate(userId, updateData, { new: true });
    } catch (error) {
      logger.error('Error updating user:', error);
      throw new Error('Error updating user');
    }
  }  

  async deleteUser(userId) {
    try {
      return await User.findByIdAndDelete(userId);
    } catch (error) {
      logger.error('Error deleting user:', error);
      throw new Error('Error deleting user');
    }
  }  

  // Nuevo método para encontrar usuarios por la última conexión
  async findUsersByLastConnectionBefore(date) {
    try {
      return await User.find({ last_connection: { $lt: date } });
    } catch (error) {
      logger.error('Error finding users by last connection date:', error);
      throw new Error('Error finding users by last connection date');
    }
  }

  // Nuevo método para eliminar un usuario por ID
  async deleteUserById(userId) {
    try {
      return await User.findByIdAndDelete(userId);
    } catch (error) {
      logger.error('Error deleting user by ID:', error);
      throw new Error('Error deleting user by ID');
    }
  }
  

  async findAllUsers() {
    try {
      const users = await User.find();
      return users;
    } catch (error) {
      throw new Error('Error fetching users');
    }
  }

}

module.exports = UserManager;
