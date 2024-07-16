const CartManager = require('../dao/db/cartManager');
const cartManager = new CartManager();
const ProductManager = require('../dao/db/productManager');
const productManager = new ProductManager();

exports.createCart = async (req, res) => {
  try {
    const newCart = await cartManager.createCart();
    res.status(201).json(newCart);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.addProductToCart = async (req, res) => {
  try {
    const { cid } = req.params;
    const { productId, quantity } = req.body;
    const product = await productManager.getProductById(productId);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    const updatedCart = await cartManager.addProductToCart(cid, product, quantity);
    res.status(200).json(updatedCart);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getCartById = async (req, res) => {
  try {
    const { cid } = req.params;
    const cart = await cartManager.getCartById(cid);
    if (!cart) {
      return res.status(404).json({ error: 'Cart not found' });
    }
    res.json(cart);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteCart = async (req, res) => {
  try {
    const { cid } = req.params;
    await cartManager.deleteCart(cid);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.removeProductFromCart = async (req, res) => {
  try {
    await cartManager.removeProductFromCart(req.params.cid, req.params.pid);
    res.json({ message: 'Product removed from cart successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error removing product from cart' });
  }
};

exports.updateCart = async (req, res) => {
  try {
    const updatedCart = await cartManager.updateCart(req.params.cid, req.body.products);
    res.json(updatedCart);
  } catch (error) {
    res.status(500).json({ error: 'Error updating cart' });
  }
};

exports.updateProductQuantity = async (req, res) => {
  try {
    const updatedCart = await cartManager.updateProductQuantity(req.params.cid, req.params.pid, req.body.quantity);
    res.json(updatedCart);
  } catch (error) {
    res.status(500).json({ error: 'Error updating product quantity in cart' });
  }
};
