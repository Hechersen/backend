const DAOFactory = require('../../daoFactory');

class CartRepository {
  constructor() {
    this.dao = DAOFactory.getDAO('cart');
  }

  async createCart() {
    return await this.dao.createCart();
  }

  async addProductToCart(cartId, product, quantity) {
    return await this.dao.addProductToCart(cartId, product, quantity);
  }

  async getCartById(cartId) {
    return await this.dao.getCartById(cartId);
  }

  async updateCart(cartId, products) {
    return await this.dao.updateCart(cartId, products);
  }

  async updateProductQuantity(cartId, productId, quantity) {
    return await this.dao.updateProductQuantity(cartId, productId, quantity);
  }

  async removeProductFromCart(cartId, productId) {
    return await this.dao.removeProductFromCart(cartId, productId);
  }

  async deleteCart(cartId) {
    return await this.dao.deleteCart(cartId);
  }
}

module.exports = CartRepository;
