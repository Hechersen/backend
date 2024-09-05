const ProductManager = require('../dao/db/productManager');
const productManager = new ProductManager();
const { generateMockProducts } = require('../utils/mocking');
const logger = require('../utils/logger');

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

// exports.getProductById = async (req, res) => {
//   try {
//     const { pid } = req.params;
//     const product = await productManager.getProductById(pid);
//     if (!product) {
//       return res.status(404).json({ error: 'Product not found' });
//     }
//     res.render('productDetails', { product });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

exports.getProductById = async (req, res) => {
  try {
    const { pid } = req.params;
    const product = await productManager.getProductById(pid);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    // Devolver el producto como JSON en lugar de renderizar una vista
    res.json(product);  // Cambiado de res.render a res.json
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


exports.addProduct = async (req, res) => {
  console.log('addProduct called with user:', req.user);
  try {
    if (!req.user || !req.user._id) {
      console.log('User authentication failed');
      return res.status(400).json({ error: 'User not authenticated or missing ID' });
    }

    const newProductData = {
      ...req.body,
      owner: req.user._id
    };
    console.log('Adding new product with data:', newProductData);

    const newProduct = await productManager.addProduct(newProductData);
    console.log('Product added successfully:', newProduct);

    res.status(201).json(newProduct);
  } catch (error) {
    console.error('Error adding product:', error);
    res.status(500).json({ error: 'Error adding new product' });
  }
};




// exports.addProduct = async (req, res) => {
//   console.log('addProduct function called');
//   try {
//     console.log('Authenticated User:', req.user); 

//     if (!req.user || !req.user._id) {
//       return res.status(400).json({ error: 'User not authenticated or missing ID' });
//     }

//     const newProductData = {
//       ...req.body,
//       owner: req.user._id
//     };
//     const newProduct = await productManager.addProduct(newProductData);
//     res.status(201).json(newProduct);
//   } catch (error) {
//     console.error('Error adding product:', error); 
//     res.status(500).json({ error: 'Error adding new product' });
//   }
// };

exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const existingProduct = await productManager.getProductById(id);
    if (!existingProduct) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Verificar si el usuario es el propietario o un administrador
    if (req.user.role === 'premium' && existingProduct.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Premium users can only update their own products.' });
    }

    const updatedData = {
      category: req.body.category || existingProduct.category,
      description: req.body.description || existingProduct.description,
      stock: req.body.stock || existingProduct.stock,
    };

    const updatedProduct = await productManager.updateProduct(id, updatedData);
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
    const { id } = req.params;
    const existingProduct = await productManager.getProductById(id);
    if (!existingProduct) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Verificar si el usuario es el propietario o un administrador
    if (req.user.role === 'premium' && existingProduct.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Premium users can only delete their own products.' });
    }

    await productManager.deleteProduct(id);
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    logger.error('Error deleting product:', error);
    res.status(500).json({ error: 'Error deleting the product' });
  }
};

// Nueva función para el mocking de productos
exports.mockProducts = async (req, res, next) => {
  try {
    // Generar productos simulados
    const mockProducts = generateMockProducts(100);
    res.json({ status: 'success', data: mockProducts });
  } catch (error) {
    next(error);
  }
};
