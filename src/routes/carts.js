// const express = require('express');
// const router = express.Router();
// const cartController = require('../controllers/cartController');
// const { ensureAuthenticated, ensureAdmin } = require('../middleware/auth');

// router.post('/', ensureAuthenticated, cartController.createCart);
// router.post('/:cid/products', ensureAuthenticated, cartController.addProductToCart);
// router.get('/:cid', ensureAuthenticated, cartController.getCartById);
// router.delete('/:cid', ensureAuthenticated, ensureAdmin, cartController.deleteCart);
// router.delete('/:cid/products/:pid', ensureAuthenticated, cartController.removeProductFromCart);
// router.put('/:cid', ensureAuthenticated, cartController.updateCart);
// router.put('/:cid/products/:pid', ensureAuthenticated, cartController.updateProductQuantity);
// router.post('/:cid/checkout', ensureAuthenticated, cartController.checkoutCart);

// module.exports = router;

const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
const { ensureAuthenticated, ensureAdmin } = require('../middleware/auth');

/**
 * @swagger
 * tags:
 *   name: Carts
 *   description: API to manage carts
 */

/**
 * @swagger
 * /carts:
 *   post:
 *     summary: Create a new cart
 *     tags: [Carts]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Cart created successfully
 *       403:
 *         description: Premium users cannot create carts
 *       500:
 *         description: Internal server error
 */
router.post('/', ensureAuthenticated, cartController.createCart);

/**
 * @swagger
 * /carts/{cid}/products:
 *   post:
 *     summary: Add a product to a cart
 *     tags: [Carts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: cid
 *         schema:
 *           type: string
 *         required: true
 *         description: Cart ID
 *       - in: body
 *         name: product
 *         description: Product ID and quantity
 *         schema:
 *           type: object
 *           properties:
 *             productId:
 *               type: string
 *             quantity:
 *               type: number
 *     responses:
 *       200:
 *         description: Product added to cart successfully
 *       404:
 *         description: Cart or product not found
 *       500:
 *         description: Internal server error
 */
router.post('/:cid/products', ensureAuthenticated, cartController.addProductToCart);

/**
 * @swagger
 * /carts/{cid}:
 *   get:
 *     summary: Get cart by ID
 *     tags: [Carts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: cid
 *         schema:
 *           type: string
 *         required: true
 *         description: Cart ID
 *     responses:
 *       200:
 *         description: Return the cart
 *       404:
 *         description: Cart not found
 *       500:
 *         description: Internal server error
 */
router.get('/:cid', ensureAuthenticated, cartController.getCartById);

/**
 * @swagger
 * /carts/{cid}:
 *   delete:
 *     summary: Delete a cart
 *     tags: [Carts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: cid
 *         schema:
 *           type: string
 *         required: true
 *         description: Cart ID
 *     responses:
 *       204:
 *         description: Cart deleted successfully
 *       403:
 *         description: Admin access only
 *       404:
 *         description: Cart not found
 *       500:
 *         description: Internal server error
 */
router.delete('/:cid', ensureAuthenticated, ensureAdmin, cartController.deleteCart);

/**
 * @swagger
 * /carts/{cid}/products/{pid}:
 *   delete:
 *     summary: Remove a product from a cart
 *     tags: [Carts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: cid
 *         schema:
 *           type: string
 *         required: true
 *         description: Cart ID
 *       - in: path
 *         name: pid
 *         schema:
 *           type: string
 *         required: true
 *         description: Product ID
 *     responses:
 *       200:
 *         description: Product removed from cart successfully
 *       404:
 *         description: Cart or product not found
 *       500:
 *         description: Internal server error
 */
router.delete('/:cid/products/:pid', ensureAuthenticated, cartController.removeProductFromCart);

/**
 * @swagger
 * /carts/{cid}:
 *   put:
 *     summary: Update a cart
 *     tags: [Carts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: cid
 *         schema:
 *           type: string
 *         required: true
 *         description: Cart ID
 *       - in: body
 *         name: products
 *         description: List of products
 *         schema:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               productId:
 *                 type: string
 *               quantity:
 *                 type: number
 *     responses:
 *       200:
 *         description: Cart updated successfully
 *       404:
 *         description: Cart not found
 *       500:
 *         description: Internal server error
 */
router.put('/:cid', ensureAuthenticated, cartController.updateCart);

/**
 * @swagger
 * /carts/{cid}/products/{pid}:
 *   put:
 *     summary: Update the quantity of a product in a cart
 *     tags: [Carts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: cid
 *         schema:
 *           type: string
 *         required: true
 *         description: Cart ID
 *       - in: path
 *         name: pid
 *         schema:
 *           type: string
 *         required: true
 *         description: Product ID
 *       - in: body
 *         name: quantity
 *         description: New quantity
 *         schema:
 *           type: object
 *           properties:
 *             quantity:
 *               type: number
 *     responses:
 *       200:
 *         description: Product quantity updated successfully
 *       404:
 *         description: Cart or product not found
 *       500:
 *         description: Internal server error
 */
router.put('/:cid/products/:pid', ensureAuthenticated, cartController.updateProductQuantity);

/**
 * @swagger
 * /carts/{cid}/checkout:
 *   post:
 *     summary: Checkout a cart
 *     tags: [Carts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: cid
 *         schema:
 *           type: string
 *         required: true
 *         description: Cart ID
 *     responses:
 *       200:
 *         description: Purchase finalized, ticket created and cart updated with failed products
 *       404:
 *         description: Cart not found
 *       500:
 *         description: Internal server error
 */
router.post('/:cid/checkout', ensureAuthenticated, cartController.checkoutCart);

module.exports = router;
