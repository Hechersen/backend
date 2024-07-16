const ProductManager = require('../dao/db/productManager');
const productManager = new ProductManager();

exports.getAllProducts = async (req, res) => {
  try {
    const { limit = 10, page = 1, sort, query } = req.query;
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
};

exports.getProductById = async (req, res) => {
  try {
    const { pid } = req.params;
    const product = await productManager.getProductById(pid);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.render('productDetails', { product });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.addProduct = async (req, res) => {
  try {
    const newProduct = await productManager.addProduct(req.body);
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(500).json({ error: 'Error adding new product' });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { category, description } = req.body;
    const updatedProduct = await productManager.updateProduct(id, { category, description });
    if (updatedProduct) {
      req.app.get('io').emit('product update', updatedProduct);
      res.json(updatedProduct);
    } else {
      res.status(404).json({ error: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error updating the product' });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    await productManager.deleteProduct(req.params.id);
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting the product' });
  }
};
