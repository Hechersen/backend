const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

router.get('/', productController.getAllProducts);
router.get('/view', productController.getAllProducts);
router.get('/:pid', productController.getProductById);
router.post('/', productController.addProduct);
router.put('/:id/update', productController.updateProduct);
router.delete('/:id', productController.deleteProduct);

module.exports = router;

