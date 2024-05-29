const Cart = require('../../models/cart');

class CartManager {
  async createCart() {
    try {
      const cart = new Cart({ products: [] });
      await cart.save();
      return cart;
    } catch (error) {
      throw new Error('Error creating cart');
    }
  }

  async addProductToCart(cartId, productId, quantity) {
    try {
      const cart = await Cart.findById(cartId);
      if (!cart) throw new Error('Cart not found');

      const existingProduct = cart.products.find(p => p.product.toString() === productId);
      if (existingProduct) {
        existingProduct.quantity += quantity;
      } else {
        cart.products.push({ product: productId, quantity });
      }
      await cart.save();
      return cart;
    } catch (error) {
      throw new Error('Error adding product to cart');
    }
  }

  async getCartById(cartId) {
    try {
      return await Cart.findById(cartId).populate('products.product');
    } catch (error) {
      throw new Error('Cart not found');
    }
  }

  async removeProductFromCart(cartId, productId) {
    try {
      const cart = await Cart.findById(cartId);
      if (!cart) throw new Error('Cart not found');

      cart.products = cart.products.filter(p => p.product.toString() !== productId);
      await cart.save();
      return cart;
    } catch (error) {
      throw new Error('Error removing product from cart');
    }
  }
}

module.exports = CartManager;
