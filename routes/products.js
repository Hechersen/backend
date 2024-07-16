// const express = require('express');
// const router = express.Router();
// const ProductManager = require('../dao/db/productManager');
// const productManager = new ProductManager();

// // Ruta para devolver JSON
// router.get('/', async (req, res) => {
//   try {
//     const { limit = 10, page = 1, sort, query } = req.query;
//     const limitValue = parseInt(limit, 10);
//     const pageValue = parseInt(page, 10);
//     const sortValue = sort === 'asc' ? 1 : -1;
//     const queryFilter = query ? { $or: [{ category: query }, { availability: query }] } : {};

//     const options = {
//       limit: limitValue,
//       page: pageValue,
//       sort: sort ? { price: sortValue } : {}
//     };

//     const products = await productManager.getProducts(queryFilter, options);

//     res.json({
//       status: 'success',
//       payload: products.docs,
//       totalPages: products.totalPages,
//       prevPage: products.prevPage,
//       nextPage: products.nextPage,
//       page: products.page,
//       hasPrevPage: products.hasPrevPage,
//       hasNextPage: products.hasNextPage,
//       prevLink: products.hasPrevPage ? `/api/products?limit=${limitValue}&page=${products.page - 1}&sort=${sort}&query=${query}` : null,
//       nextLink: products.hasNextPage ? `/api/products?limit=${limitValue}&page=${products.page + 1}&sort=${sort}&query=${query}` : null
//     });
//   } catch (error) {
//     res.status(500).json({ status: 'error', message: 'Unable to retrieve products' });
//   }
// });

// // Nueva ruta para renderizar vista de productos
// router.get('/view', async (req, res) => {
//   try {
//     const products = await productManager.getAllProducts();
//     res.render('products', { products, user: req.user });
//   } catch (error) {
//     res.status(500).json({ status: 'error', message: 'Unable to retrieve products' });
//   }
// });

// router.get('/:pid', async (req, res) => {
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
// });

// router.post('/', async (req, res) => {
//   try {
//     const newProduct = await productManager.addProduct(req.body);
//     res.status(201).json(newProduct);
//   } catch (error) {
//     res.status(500).json({ error: 'Error adding new product' });
//   }
// });

// // Actualizar un producto existente con categoría y descripción
// router.put('/:id/update', async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { category, description } = req.body;
//     const updatedProduct = await productManager.updateProduct(id, { category, description });
//     if (updatedProduct) {
//       req.app.get('io').emit('product update', updatedProduct);
//       res.json(updatedProduct);
//     } else {
//       res.status(404).json({ error: 'Product not found' });
//     }
//   } catch (error) {
//     res.status(500).json({ error: 'Error updating the product' });
//   }
// });

// router.delete('/:id', async (req, res) => {
//   try {
//     await productManager.deleteProduct(req.params.id);
//     res.json({ message: 'Product deleted successfully' });
//   } catch (error) {
//     res.status(500).json({ error: 'Error deleting the product' });
//   }
// });

// module.exports = router;

const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

router.get('/', productController.getAllProducts);
router.get('/view', productController.getAllProducts); // Añadir esta línea si no está
router.get('/:pid', productController.getProductById);
router.post('/', productController.addProduct);
router.put('/:id/update', productController.updateProduct);
router.delete('/:id', productController.deleteProduct);

module.exports = router;

