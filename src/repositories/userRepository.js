const DAOFactory = require('../../daoFactory');

class UserRepository {
  constructor() {
    this.dao = DAOFactory.getDAO('user');
  }

  async createUser(userData) {
    return await this.dao.createUser(userData);
  }

  async findUserByEmail(email) {
    return await this.dao.findUserByEmail(email);
  }

  async findUserById(userId) {
    return await this.dao.findUserById(userId);
  }

  async updateUser(userId, updateData) {
    return await this.dao.updateUser(userId, updateData);
  }

  async deleteUser(userId) {
    return await this.dao.deleteUser(userId);
  }

  async findUsersByLastConnectionBefore(date) {
    return await this.dao.findUsersByLastConnectionBefore(date);
  }

  async deleteUserById(userId) {
    return await this.dao.deleteUserById(userId);
  }

  async findAllUsers() {
    return await this.dao.findAllUsers();
  }
  
}

module.exports = UserRepository;

