// const express = require('express');
// const router = express.Router();
// const productController = require('../controllers/productController');
// const { ensureAdmin, ensureAuthenticated } = require('../middleware/auth');

// // Función mockProducts
// router.get('/mockingproducts', ensureAuthenticated , productController.mockProducts);

// router.get('/', productController.getAllProducts);
// router.get('/view', productController.getAllProducts);
// router.get('/:pid', productController.getProductById);

// // Permitir que tanto admin como premium puedan agregar productos
// router.post('/', ensureAuthenticated, productController.addProduct);

// // Permitir que solo el dueño del producto o admin puedan actualizar o eliminar productos
// router.put('/:id/update', ensureAuthenticated, productController.updateProduct);
// router.delete('/:id', ensureAuthenticated, productController.deleteProduct);

// module.exports = router;


const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { ensureAdmin, ensureAuthenticated } = require('../middleware/auth');

/**
 * @swagger
 * tags:
 *   name: Products
 *   description: API to manage products
 */

/**
 * @swagger
 * /products/mockingproducts:
 *   get:
 *     summary: Generate mock products
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of mock products
 *       500:
 *         description: Internal server error
 */
router.get('/mockingproducts', ensureAuthenticated, productController.mockProducts);

/**
 * @swagger
 * /products:
 *   get:
 *     summary: Get all products
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: Return all products
 *       500:
 *         description: Internal server error
 */
router.get('/', productController.getAllProducts);

/**
 * @swagger
 * /products/{pid}:
 *   get:
 *     summary: Get a product by ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: pid
 *         schema:
 *           type: string
 *         required: true
 *         description: Product ID
 *     responses:
 *       200:
 *         description: Return the product
 *       404:
 *         description: Product not found
 *       500:
 *         description: Internal server error
 */
router.get('/:pid', productController.getProductById);

/**
 * @swagger
 * /products:
 *   post:
 *     summary: Add a new product
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: body
 *         name: product
 *         description: Product data
 *         schema:
 *           type: object
 *           properties:
 *             title:
 *               type: string
 *             price:
 *               type: number
 *             code:
 *               type: string
 *             category:
 *               type: string
 *             description:
 *               type: string
 *             stock:
 *               type: number
 *     responses:
 *       201:
 *         description: Product created successfully
 *       500:
 *         description: Internal server error
 */
router.post('/', ensureAuthenticated, productController.addProduct);

/**
 * @swagger
 * /products/{id}/update:
 *   put:
 *     summary: Update a product
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Product ID
 *       - in: body
 *         name: product
 *         description: New product data
 *         schema:
 *           type: object
 *           properties:
 *             category:
 *               type: string
 *             description:
 *               type: string
 *             stock:
 *               type: number
 *     responses:
 *       200:
 *         description: Product updated successfully
 *       404:
 *         description: Product not found
 *       500:
 *         description: Internal server error
 */
router.put('/:id/update', ensureAuthenticated, productController.updateProduct);

/**
 * @swagger
 * /products/{id}:
 *   delete:
 *     summary: Delete a product
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Product ID
 *     responses:
 *       200:
 *         description: Product deleted successfully
 *       404:
 *         description: Product not found
 *       500:
 *         description: Internal server error
 */
router.delete('/:id', ensureAuthenticated, productController.deleteProduct);

module.exports = router;