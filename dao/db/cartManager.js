const Cart = require('../../models/cart');
const CartDTO = require('../../dto/cartDTO');
const logger = require('../../utils/logger');

class CartManager {
  async createCart() {
    try {
      const cart = new Cart({ products: [] });
      await cart.save();
      return new CartDTO(cart);
    } catch (error) {
      logger.error('Error creating cart:', error);
      throw new Error('Error creating cart');
    }
  }

  async addProductToCart(cartId, product, quantity) {
    try {
      const cart = await Cart.findById(cartId);
      if (!cart) {
        throw new Error('Cart not found');
      }
      const existingProduct = cart.products.find(p => p.product && p.product.equals(product._id));
      if (existingProduct) {
        existingProduct.quantity += quantity;
      } else {
        cart.products.push({ product: product._id, quantity });
      }
      await cart.save();
      return new CartDTO(cart);
    } catch (error) {
      logger.error('Error adding product to cart:', error);
      throw new Error('Error adding product to cart');
    }
  }

  async getCartById(cartId) {
    try {
      const cart = await Cart.findById(cartId).populate('products.product');
      if (!cart) {
        throw new Error('Cart not found');
      }
      return new CartDTO(cart);
    } catch (error) {
      logger.error('Error retrieving cart by ID:', error);
      throw new Error('Error retrieving cart by ID');
    }
  }

  async updateCart(cartId, products) {
    try {
      const cart = await Cart.findById(cartId);
      if (!cart) {
        throw new Error('Cart not found');
      }
      cart.products = products.map(p => ({
        product: p.productId,
        quantity: p.quantity
      }));
      await cart.save();
      return new CartDTO(cart);
    } catch (error) {
      logger.error('Error updating cart:', error);
      throw new Error('Error updating cart');
    }
  }

  async updateProductQuantity(cartId, productId, quantity) {
    try {
      const cart = await Cart.findById(cartId);
      if (!cart) {
        throw new Error('Cart not found');
      }
      const product = cart.products.find(p => p.product.equals(productId));
      if (!product) {
        throw new Error('Product not found in cart');
      }
      product.quantity = quantity;
      await cart.save();
      return new CartDTO(cart);
    } catch (error) {
      logger.error('Error updating product quantity in cart:', error);
      throw new Error('Error updating product quantity in cart');
    }
  }

  async removeProductFromCart(cartId, productId) {
    try {
      const cart = await Cart.findById(cartId);
      if (!cart) {
        throw new Error('Cart not found');
      }
      cart.products = cart.products.filter(p => !p.product.equals(productId));
      await cart.save();
      return new CartDTO(cart);
    } catch (error) {
      logger.error('Error removing product from cart:', error);
      throw new Error('Error removing product from cart');
    }
  }

  async deleteCart(cartId) {
    try {
      await Cart.findByIdAndDelete(cartId);
    } catch (error) {
      logger.error('Error deleting cart:', error);
      throw new Error('Error deleting cart');
    }
  }
}

module.exports = CartManager;
