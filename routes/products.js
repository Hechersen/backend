const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { ensureAdmin } = require('../middleware/auth');

router.get('/', productController.getAllProducts);
router.get('/view', productController.getAllProducts);
router.get('/:pid', productController.getProductById);

router.post('/', ensureAdmin, productController.addProduct);
router.put('/:id/update', ensureAdmin, productController.updateProduct);
router.delete('/:id', ensureAdmin, productController.deleteProduct);

module.exports = router;



