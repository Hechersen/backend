class UserManager {
  constructor() {
    this.quantity = 0;
    this.users = [];
  }

  create({ photo, email, password, role }) {
    if (!photo || !email || !password || !role) {
      throw new Error('All fields except id are required');
    }
    const user = {
      id: ++this.quantity,
      photo,
      email,
      password,
      role
    };
    this.users.push(user);
    return user;
  }

  read() {
    return this.users;
  }

  readOne(id) {
    const user = this.users.find(user => user.id === id);
    return user || 'User not found';
  }

  update(id, newData) {
    const index = this.users.findIndex(user => user.id === id);
    if (index === -1) {
      return 'User not found';
    }
    this.users[index] = { ...this.users[index], ...newData };
    return this.users[index];
  }

  destroy(id) {
    const index = this.users.findIndex(user => user.id === id);
    if (index === -1) {
      return 'User not found';
    }
    this.users.splice(index, 1);
    return 'User deleted';
  }
}

module.exports = UserManager;
