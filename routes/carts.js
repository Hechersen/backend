const express = require('express');
const router = express.Router();
const CartManager = require('../models/cartManager');
const cartManager = new CartManager('./data/carts.json');
const ProductManager = require('../models/productManager');
const productManager = new ProductManager('./data/products.json');

router.post('/', async (req, res) => {
  try {
    const newCart = await cartManager.createCart();
    res.status(201).json(newCart);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/:cid/products', async (req, res) => {
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
});

router.get('/:cid', async (req, res) => {
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
});

router.delete('/:cid', async (req, res) => {
  try {
    const { cid } = req.params;
    await cartManager.deleteCart(cid);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
