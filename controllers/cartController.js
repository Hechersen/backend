const CartRepository = require('../repositories/cartRepository');
const cartRepository = new CartRepository();
const ProductManager = require('../dao/db/productManager');
const productManager = new ProductManager();
const { v4: uuidv4 } = require('uuid');
const Ticket = require('../models/ticket');
const transporter = require('../config/nodemailer');
const logger = require('../utils/logger'); 

// exports.createCart = async (req, res) => {
//   try {
//     // Verificar si el usuario es premium
//     if (req.user.role === 'premium') {
//       logger.info(`Attempt to create cart blocked for premium user: ${req.user._id}`);
//       return res.status(403).json({ error: 'Premium users cannot create carts.' });
//     }

//     const newCart = await cartRepository.createCart();
//     logger.info(`Cart created successfully for user: ${req.user._id}`);
//     res.status(201).json(newCart);
//   } catch (error) {
//     logger.error('Error creating cart:', error);
//     res.status(500).json({ error: error.message });
//   }
// };

// // Restricción para agregar productos al carrito
// exports.addProductToCart = async (req, res) => {
//   try {
//     const { cid } = req.params;
//     const { productId, quantity } = req.body;
//     const product = await productManager.getProductById(productId);
//     if (!product) {
//       return res.status(404).json({ error: 'Product not found' });
//     }

//     // Impedir que un usuario premium agregue su propio producto al carrito
//     if (req.user.role === 'premium' && product.owner.toString() === req.user._id.toString()) {
//       return res.status(403).json({ error: 'Cannot add your own product to the cart as a premium user.' });
//     }

//     const updatedCart = await cartRepository.addProductToCart(cid, product, quantity);
//     res.status(200).json(updatedCart);
//   } catch (error) {
//     logger.error('Error adding product to cart:', error);
//     res.status(500).json({ error: error.message });
//   }
// };

exports.createCart = async (req, res) => {
  try {
    const newCart = await cartRepository.createCart();
    logger.info(`Cart created successfully for user: ${req.user._id}`);
    res.status(201).json(newCart);
  } catch (error) {
    logger.error('Error creating cart:', error);
    res.status(500).json({ error: error.message });
  }
};

// Restricción para agregar productos al carrito
exports.addProductToCart = async (req, res) => {
  try {
    const { cid } = req.params;
    const { productId, quantity } = req.body;
    const product = await productManager.getProductById(productId);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Impedir que un usuario premium agregue su propio producto al carrito
    if (req.user.role === 'premium' && product.owner.toString() === req.user._id.toString()) {
      return res.status(403).json({ error: 'Cannot add your own product to the cart as a premium user.' });
    }

    const updatedCart = await cartRepository.addProductToCart(cid, product, quantity);
    res.status(200).json(updatedCart);
  } catch (error) {
    logger.error('Error adding product to cart:', error);
    res.status(500).json({ error: error.message });
  }
};


exports.getCartById = async (req, res) => {
  try {
    const { cid } = req.params;
    const cart = await cartRepository.getCartById(cid);
    if (!cart) {
      return res.status(404).json({ error: 'Cart not found' });
    }
    res.json(cart);
  } catch (error) {
    logger.error('Error fetching cart by ID:', error);
    res.status(500).json({ error: error.message });
  }
};

exports.deleteCart = async (req, res) => {
  try {
    const { cid } = req.params;
    await cartRepository.deleteCart(cid);
    res.status(204).send();
  } catch (error) {
    logger.error('Error deleting cart:', error);
    res.status(500).json({ error: error.message });
  }
};

exports.removeProductFromCart = async (req, res) => {
  try {
    await cartRepository.removeProductFromCart(req.params.cid, req.params.pid);
    res.json({ message: 'Product removed from cart successfully' });
  } catch (error) {
    logger.error('Error removing product from cart:', error);
    res.status(500).json({ error: 'Error removing product from cart' });
  }
};

exports.updateCart = async (req, res) => {
  try {
    const updatedCart = await cartRepository.updateCart(req.params.cid, req.body.products);
    res.json(updatedCart);
  } catch (error) {
    logger.error('Error updating cart:', error);
    res.status(500).json({ error: 'Error updating cart' });
  }
};

exports.updateProductQuantity = async (req, res) => {
  try {
    const updatedCart = await cartRepository.updateProductQuantity(req.params.cid, req.params.pid, req.body.quantity);
    res.json(updatedCart);
  } catch (error) {
    logger.error('Error updating product quantity in cart:', error);
    res.status(500).json({ error: 'Error updating product quantity in cart' });
  }
};

exports.checkoutCart = async (req, res) => {
  try {
    const { cid } = req.params;
    const cart = await cartRepository.getCartById(cid);
    if (!cart) {
      return res.status(404).json({ error: 'Cart not found' });
    }

    let totalAmount = 0;
    const productsToPurchase = [];
    const failedProducts = [];

    for (const item of cart.products) {
      const product = await productManager.getProductById(item.product._id);

      if (!product) {
        return res.status(404).json({ error: `Product with ID ${item.product._id} not found` });
      }

      if (product.stock >= item.quantity) {
        totalAmount += product.price * item.quantity;
        productsToPurchase.push({
          product: item.product._id,
          quantity: item.quantity
        });
      } else {
        failedProducts.push(item);
      }
    }

    if (productsToPurchase.length === 0) {
      return res.status(400).json({ error: 'No products available for purchase due to insufficient stock' });
    }

    const ticket = new Ticket({
      code: uuidv4(),
      purchaseDate: new Date(),
      amount: totalAmount,
      purchaser: req.user._id,
      products: productsToPurchase
    });

    await ticket.save();

    // Actualizar el stock de los productos una vez que se ha confirmado la compra
    for (const item of productsToPurchase) {
      const product = await productManager.getProductById(item.product);
      product.stock -= item.quantity;
      await product.save();

      // Emitir evento de WebSocket para actualizar el stock en tiempo real
      req.app.get('io').emit('stock update', {
        productId: product._id,
        stock: product.stock
      });
    }

    // Actualizar el carrito con los productos no comprados
    const updatedCart = await cartRepository.updateCart(cid, failedProducts);

    // Enviar correo electrónico con el ticket
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: req.user.email,
      subject: 'Your Purchase Ticket',
      text: `Thank you for your purchase! Here are the details of your ticket: \n\nTicket Code: ${ticket.code}\nAmount: $${ticket.amount}\nPurchase Date: ${ticket.purchaseDate}\n\nProducts:\n${productsToPurchase.map(item => `- ${item.product} (x${item.quantity})`).join('\n')}`
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        logger.error('Error sending email:', error);
      } else {
        logger.info('Email sent:', info.response);
      }
    });

    res.json({ message: 'Purchase finalized, ticket created and cart updated with failed products', ticket, failedProducts });
  } catch (error) {
    logger.error('Error during checkout:', error);
    res.status(500).json({ error: error.message });
  }
};
