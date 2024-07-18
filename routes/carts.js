const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');

router.post('/', cartController.createCart);
router.post('/:cid/products', cartController.addProductToCart);
router.get('/:cid', cartController.getCartById);
router.delete('/:cid', cartController.deleteCart);
router.delete('/:cid/products/:pid', cartController.removeProductFromCart);
router.put('/:cid', cartController.updateCart);
router.put('/:cid/products/:pid', cartController.updateProductQuantity);

module.exports = router;
