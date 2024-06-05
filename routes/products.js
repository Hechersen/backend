const express = require('express');
const router = express.Router();
const ProductManager = require('../dao/db/productManager');
const productManager = new ProductManager();

router.get('/', async (req, res) => {
  try {
    const { limit = 10, page = 1, sort, query } = req.query;

    // Convertir valores a tipos adecuados
    const limitValue = parseInt(limit, 10);
    const pageValue = parseInt(page, 10);
    const sortValue = sort === 'asc' ? 1 : -1;
    const queryFilter = query ? { $or: [{ category: query }, { availability: query }] } : {};

    const options = {
      limit: limitValue,
      page: pageValue,
      sort: sort ? { price: sortValue } : {}
    };

    const products = await productManager.getProducts(queryFilter, options);

    res.json({
      status: 'success',
      payload: products.docs,
      totalPages: products.totalPages,
      prevPage: products.prevPage,
      nextPage: products.nextPage,
      page: products.page,
      hasPrevPage: products.hasPrevPage,
      hasNextPage: products.hasNextPage,
      prevLink: products.hasPrevPage ? `/api/products?limit=${limitValue}&page=${products.page - 1}&sort=${sort}&query=${query}` : null,
      nextLink: products.hasNextPage ? `/api/products?limit=${limitValue}&page=${products.page + 1}&sort=${sort}&query=${query}` : null
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Unable to retrieve products' });
  }
});

// Renderiza la vista home
router.get('/view', async (req, res) => {
  try {
    const products = await productManager.getAllProducts();
    res.render('home', { products });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Unable to retrieve products' });
  }
});

// Rutas API
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
