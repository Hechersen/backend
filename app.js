const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const { engine } = require('express-handlebars');
const connectDB = require('./db');
const ProductManager = require('./dao/db/productManager'); 
const productManager = new ProductManager();
const MessageManager = require('./dao/db/messageManager');
const messageManager = new MessageManager();
const CartManager = require('./dao/db/cartManager');
const cartManager = new CartManager();  

const app = express();
const server = http.createServer(app);
const io = new Server(server);
const port = 8080;

connectDB();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// Configuración de Handlebars
app.engine('handlebars', engine({
  runtimeOptions: {
    allowProtoPropertiesByDefault: true,
    allowProtoMethodsByDefault: true,
  }
}));
app.set('view engine', 'handlebars');
app.set('views', './views');

app.set('io', io);

// Rutas
const productRoutes = require('./routes/products');
const cartRoutes = require('./routes/carts');
app.use('/api/products', productRoutes);
app.use('/products', productRoutes);
app.use('/api/carts', cartRoutes);

app.get('/realtimeproducts', async (req, res) => {
  const products = await productManager.getAllProducts();
  res.render('realTimeProducts', { products });
});

app.get('/chat', async (req, res) => {
  const messages = await messageManager.getAllMessages();
  res.render('chat', { messages });
});

app.get('/carts/:cid', async (req, res) => {
  try {
    const cart = await cartManager.getCartById(req.params.cid);
    if (!cart) {
      return res.status(404).json({ error: 'Cart not found' });
    }
    res.render('cart', { cart });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Socket
io.on('connection', (socket) => {
  console.log('Usuario conectado');

  socket.on('new product', async (product) => {
    const products = await productManager.getAllProducts();
    const existingProduct = products.find(p => p.code === product.code);
    if (existingProduct) {
      socket.emit('error', 'Product with this code already exists');
    } else {
      const newProduct = await productManager.addProduct(product);
      io.emit('product update', newProduct);
    }
  });
  
  socket.on('delete product', async (productId) => {
    console.log(`Server received request to delete product with ID: ${productId}`);
    try {
      await productManager.deleteProduct(productId);
      io.emit('product delete', productId);
    } catch (error) {
      socket.emit('error', `Error deleting product with id ${productId}: ${error.message}`);
    }
  });

  socket.on('chat message', async (msg) => {
    const message = await messageManager.addMessage(msg);
    io.emit('chat message', message);
  });

  socket.on('disconnect', () => {
    console.log('Usuario desconectado');
  });
});

server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

module.exports = app;
