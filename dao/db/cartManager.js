const Cart = require('../../models/cart');

class CartManager {
  async createCart() {
    const cart = new Cart({ products: [] });
    await cart.save();
    return cart;
  }

  async addProductToCart(cartId, product, quantity) {
    const cart = await Cart.findById(cartId);
    if (!cart) {
      throw new Error('Cart not found');
    }
    const existingProduct = cart.products.find(p => p.product.equals(product._id));
    if (existingProduct) {
      existingProduct.quantity += quantity;
    } else {
      cart.products.push({ product: product._id, quantity });
    }
    await cart.save();
    return cart;
  }

  async getCartById(cartId) {
    return Cart.findById(cartId).populate('products.product');
  }

  async updateCart(cartId, products) {
    const cart = await Cart.findById(cartId);
    if (!cart) {
      throw new Error('Cart not found');
    }
    cart.products = products.map(p => ({
      product: p.productId,
      quantity: p.quantity
    }));
    await cart.save();
    return cart;
  }

  async updateProductQuantity(cartId, productId, quantity) {
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
    return cart;
  }

  async removeProductFromCart(cartId, productId) {
    const cart = await Cart.findById(cartId);
    if (!cart) {
      throw new Error('Cart not found');
    }
    cart.products = cart.products.filter(p => !p.product.equals(productId));
    await cart.save();
    return cart;
  }

  async deleteCart(cartId) {
    await Cart.findByIdAndDelete(cartId);
  }
}

module.exports = CartManager;
