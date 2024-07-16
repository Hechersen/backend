// const express = require('express');
// const router = express.Router();
// const CartManager = require('../dao/db/cartManager');
// const cartManager = new CartManager();
// const ProductManager = require('../dao/db/productManager');
// const productManager = new ProductManager();

// // Crear un nuevo carrito
// router.post('/', async (req, res) => {
//   try {
//     const newCart = await cartManager.createCart();
//     res.status(201).json(newCart);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// // Agregar producto al carrito
// router.post('/:cid/products', async (req, res) => {
//   try {
//     const { cid } = req.params;
//     const { productId, quantity } = req.body;
//     const product = await productManager.getProductById(productId);
//     if (!product) {
//       return res.status(404).json({ error: 'Product not found' });
//     }
//     const updatedCart = await cartManager.addProductToCart(cid, product, quantity);
//     res.status(200).json(updatedCart);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// // Obtener un carrito por ID
// router.get('/:cid', async (req, res) => {
//   try {
//     const { cid } = req.params;
//     const cart = await cartManager.getCartById(cid);
//     if (!cart) {
//       return res.status(404).json({ error: 'Cart not found' });
//     }
//     res.json(cart);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// // Eliminar un carrito por ID
// router.delete('/:cid', async (req, res) => {
//   try {
//     const { cid } = req.params;
//     await cartManager.deleteCart(cid);
//     res.status(204).send();
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// // Eliminar un producto del carrito
// router.delete('/:cid/products/:pid', async (req, res) => {
//   try {
//     await cartManager.removeProductFromCart(req.params.cid, req.params.pid);
//     res.json({ message: 'Product removed from cart successfully' });
//   } catch (error) {
//     res.status(500).json({ error: 'Error removing product from cart' });
//   }
// });

// // Actualizar un carrito con un arreglo de productos
// router.put('/:cid', async (req, res) => {
//   try {
//     const updatedCart = await cartManager.updateCart(req.params.cid, req.body.products);
//     res.json(updatedCart);
//   } catch (error) {
//     res.status(500).json({ error: 'Error updating cart' });
//   }
// });

// // Actualizar la cantidad de ejemplares del producto en el carrito
// router.put('/:cid/products/:pid', async (req, res) => {
//   try {
//     const updatedCart = await cartManager.updateProductQuantity(req.params.cid, req.params.pid, req.body.quantity);
//     res.json(updatedCart);
//   } catch (error) {
//     res.status(500).json({ error: 'Error updating product quantity in cart' });
//   }
// });

// module.exports = router;

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
