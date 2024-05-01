const express = require('express');
const ProductManager = require('./js/productManager');
const app = express();
const port = 3000;

const productManager = new ProductManager('./data/products.json');

app.use(express.json());

app.get('/products', async (req, res) => {
  try {
    const products = await productManager.getAllProducts();
    const limit = req.query.limit;
    res.json(limit ? products.slice(0, Number(limit)) : products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/products/:id', async (req, res) => {
  try {
    const product = await productManager.getProductById(Number(req.params.id));
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ error: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
