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
const session = require('express-session');
const passport = require('passport');
const flash = require('connect-flash');
const errorHandler = require('./middleware/errorHandler');
require('dotenv').config();
require('./config/passport');
const User = require('./models/user');

const { ensureAuthenticated, ensureAdmin } = require('./middleware/auth');

const app = express();
const server = http.createServer(app);
const io = new Server(server);
const port = 8080;

connectDB();

const sessionMiddleware = session({
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: true,
});

app.use(sessionMiddleware);

// Configurar Socket.IO para usar el middleware de sesión
io.use((socket, next) => {
  sessionMiddleware(socket.request, {}, next);
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.engine('handlebars', engine({
  helpers: {
    eq: (a, b) => a === b
  },
  runtimeOptions: {
    allowProtoPropertiesByDefault: true,
    allowProtoMethodsByDefault: true,
  }
}));
app.set('view engine', 'handlebars');
app.set('views', './views');

app.set('io', io);

app.use(passport.initialize());
app.use(passport.session());

app.use(flash());

app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  res.locals.user = req.user || null;
  next();
});

const productRoutes = require('./routes/products');
const cartRoutes = require('./routes/carts');
const userRoutes = require('./routes/users');

app.use('/api/products', productRoutes);
app.use('/products', ensureAuthenticated, productRoutes);
app.use('/api/carts', cartRoutes);
app.use('/carts', ensureAuthenticated, cartRoutes);
app.use('/users', userRoutes);

app.get('/api/sessions/current', (req, res) => {
  if (req.isAuthenticated()) {
    res.json({ user: req.user });
  } else {
    res.status(401).json({ error: 'Not authenticated' });
  }
});

app.get('/realtimeproducts', ensureAuthenticated, async (req, res, next) => {
  try {
    const products = await productManager.getAllProducts();
    res.render('realTimeProducts', { products });
  } catch (error) {
    next(error);
  }
});

app.get('/chat', ensureAuthenticated, async (req, res, next) => {
  try {
    const messages = await messageManager.getAllMessages();
    res.render('chat', { messages });
  } catch (error) {
    next(error);
  }
});

app.get('/carts/:cid', ensureAuthenticated, async (req, res, next) => {
  try {
    const cart = await cartManager.getCartById(req.params.cid);
    if (!cart) {
      return res.status(404).json({ error: 'Cart not found' });
    }
    res.render('cart', { cart });
  } catch (error) {
    next(error);
  }
});

io.on('connection', (socket) => {
  console.log('Usuario conectado');

  socket.on('new product', async (product) => {
    try {
      const products = await productManager.getAllProducts();
      const existingProduct = products.find(p => p.code === product.code);
      if (existingProduct) {
        socket.emit('error', 'Product with this code already exists');
      } else {
        const newProduct = await productManager.addProduct(product);
        io.emit('product update', newProduct);
      }
    } catch (error) {
      console.error('Error adding product:', error);
      socket.emit('error', 'Error adding product.');
    }
  });

  socket.on('delete product', async (productId) => {
    console.log(`Server received request to delete product with ID: ${productId}`);
    try {
      await productManager.deleteProduct(productId);
      io.emit('product delete', productId);
    } catch (error) {
      console.error('Error deleting product:', error);
      socket.emit('error', `Error deleting product with id ${productId}: ${error.message}`);
    }
  });

  socket.on('chat message', async (msg) => {
    try {
      const userId = socket.request.session?.passport?.user;
      if (!userId) {
        return socket.emit('error', 'Authentication required to send messages.');
      }

      const user = await User.findById(userId);
      if (user && user.role === 'user') {
        const message = await messageManager.addMessage(msg);
        io.emit('chat message', message);
      } else {
        socket.emit('error', 'Only users can send messages.');
      }
    } catch (error) {
      console.error('Error processing message:', error);
      socket.emit('error', 'Error processing message.');
    }
  });

  socket.on('disconnect', () => {
    console.log('Usuario desconectado');
  });
});

// Integrar el manejador de errores al final
app.use(errorHandler);

server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

module.exports = app;
