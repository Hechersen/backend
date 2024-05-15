const express = require('express');
const router = express.Router();
const ProductManager = require('../models/productManager');
const productManager = new ProductManager('./data/products.json');

router.get('/', async (req, res) => {
  try {
    const products = await productManager.getAllProducts();
    res.render('home', { products });
  } catch (error) {
    res.status(500).json({ error: 'Unable to retrieve products' });
  }
});

router.get('/api', async (req, res) => {
  try {
    const products = await productManager.getAllProducts();
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: 'Unable to retrieve products' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const product = await productManager.getProductById(req.params.id);
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ error: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error retrieving the product' });
  }
});

router.post('/', async (req, res) => {
  try {
    const newProduct = await productManager.addProduct(req.body);
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(500).json({ error: 'Error adding new product' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const updatedProduct = await productManager.updateProduct(req.params.id, req.body);
    if (updatedProduct) {
      res.json(updatedProduct);
    } else {
      res.status(404).json({ error: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error updating the product' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await productManager.deleteProduct(req.params.id);
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting the product' });
  }
});

module.exports = router;
