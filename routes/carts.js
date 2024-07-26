const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
const { ensureAuthenticated, ensureAdmin } = require('../middleware/auth');

router.post('/', ensureAuthenticated, cartController.createCart);
router.post('/:cid/products', ensureAuthenticated, cartController.addProductToCart);
router.get('/:cid', ensureAuthenticated, cartController.getCartById);
router.delete('/:cid', ensureAuthenticated, ensureAdmin, cartController.deleteCart);
router.delete('/:cid/products/:pid', ensureAuthenticated, cartController.removeProductFromCart);
router.put('/:cid', ensureAuthenticated, cartController.updateCart);
router.put('/:cid/products/:pid', ensureAuthenticated, cartController.updateProductQuantity);
router.post('/:cid/checkout', ensureAuthenticated, cartController.checkoutCart);

module.exports = router;
