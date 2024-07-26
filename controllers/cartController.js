const CartRepository = require('../repositories/cartRepository');
const cartRepository = new CartRepository();
const ProductManager = require('../dao/db/productManager');
const productManager = new ProductManager();
const { v4: uuidv4 } = require('uuid');
const Ticket = require('../models/ticket');
const transporter = require('../config/nodemailer');

exports.createCart = async (req, res) => {
  try {
    const newCart = await cartRepository.createCart();
    res.status(201).json(newCart);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.addProductToCart = async (req, res) => {
  try {
    const { cid } = req.params;
    const { productId, quantity } = req.body;
    const product = await productManager.getProductById(productId);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    const updatedCart = await cartRepository.addProductToCart(cid, product, quantity);
    res.status(200).json(updatedCart);
  } catch (error) {
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
    res.status(500).json({ error: error.message });
  }
};

exports.deleteCart = async (req, res) => {
  try {
    const { cid } = req.params;
    await cartRepository.deleteCart(cid);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.removeProductFromCart = async (req, res) => {
  try {
    await cartRepository.removeProductFromCart(req.params.cid, req.params.pid);
    res.json({ message: 'Product removed from cart successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error removing product from cart' });
  }
};

exports.updateCart = async (req, res) => {
  try {
    const updatedCart = await cartRepository.updateCart(req.params.cid, req.body.products);
    res.json(updatedCart);
  } catch (error) {
    res.status(500).json({ error: 'Error updating cart' });
  }
};

exports.updateProductQuantity = async (req, res) => {
  try {
    const updatedCart = await cartRepository.updateProductQuantity(req.params.cid, req.params.pid, req.body.quantity);
    res.json(updatedCart);
  } catch (error) {
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
        return res.status(400).json({ error: `Not enough stock for product ${product.title}` });
      }
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

    // Eliminar el carrito después de la compra
    await cartRepository.deleteCart(cid);

    // Enviar correo electrónico con el ticket
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: req.user.email,
      subject: 'Your Purchase Ticket',
      text: `Thank you for your purchase! Here are the details of your ticket: \n\nTicket Code: ${ticket.code}\nAmount: $${ticket.amount}\nPurchase Date: ${ticket.purchaseDate}\n\nProducts:\n${productsToPurchase.map(item => `- ${item.product} (x${item.quantity})`).join('\n')}`
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log('Error sending email:', error);
      } else {
        console.log('Email sent:', info.response);
      }
    });

    res.json({ message: 'Purchase finalized, ticket created and cart deleted', ticket });
  } catch (error) {
    console.error('Error during checkout:', error);
    res.status(500).json({ error: error.message });
  }
};

