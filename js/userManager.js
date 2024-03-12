class UserManager {
  static quantity = 0;
  static #users = [];

  create({ photo, email, password, role }) {
    if (!photo || !email || !password || !role) {
      throw new Error('All fields except id are required');
    }
    const user = {
      id: ++UserManager.quantity,
      photo,
      email,
      password,
      role
    };
    UserManager.#users.push(user);
    return user;
  }

  read() {
    return UserManager.#users;
  }

  readOne(id) {
    return UserManager.#users.find(user => user.id === id) || null;
  }

  update(id, newData) {
    const index = UserManager.#users.findIndex(user => user.id === id);
    if (index === -1) return null;

    UserManager.#users[index] = { ...UserManager.#users[index], ...newData };
    return UserManager.#users[index];
  }

  destroy(id) {
    const index = UserManager.#users.findIndex(user => user.id === id);
    if (index === -1) return false;

    UserManager.#users.splice(index, 1);
    return true;
  }
}

module.exports = UserManager;
