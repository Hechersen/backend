const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const { engine } = require('express-handlebars');
const connectDB = require('./db');
const ProductManager = require('./src/dao/db/productManager');
const MessageManager = require('./src/dao/db/messageManager');
const CartManager = require('./src/dao/db/cartManager');

const transporter = require('./config/nodemailer');
const session = require('express-session');
const UserManager = require('./src/dao/db/userManager');
const userManager = new UserManager();

const passport = require('passport');
const flash = require('connect-flash');
const errorHandler = require('./src/middleware/errorHandler');
const logger = require('./src/utils/logger');
require('dotenv').config();
require('./config/passport');
const User = require('./src/models/user');

const { ensureAuthenticated, ensureAdmin } = require('./src/middleware/auth');

const app = express();
const server = http.createServer(app);
const io = new Server(server);
const port = process.env.PORT || 8080;

connectDB();

const sessionMiddleware = session({
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: true,
});

app.use(sessionMiddleware);

// Integración de Swagger
const swaggerConfig = require('./config/swagger');
swaggerConfig(app);

// Configurar Socket.IO para usar el middleware de sesión
io.use((socket, next) => {
  sessionMiddleware(socket.request, {}, next);
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.engine('handlebars', engine({
  helpers: {
    eq: (a, b) => a === b,
    or: function () {
      return Array.prototype.slice.call(arguments, 0, -1).some(Boolean);
    },
    multiply: (a, b) => a * b,
    calculateTotal: (products) => {
      return products.reduce((total, item) => {
        return total + item.product.price * item.quantity;
      }, 0).toFixed(2);
    }
  },
  runtimeOptions: {
    allowProtoPropertiesByDefault: true,
    allowProtoMethodsByDefault: true,
  },
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



// Redirigir la raíz ('/') a '/users/login'
app.get('/', (req, res) => {
  res.redirect('/users/login');
});

// Manejador para rutas no encontradas (404)
app.use((req, res, next) => {
  const error = new Error('Not Found');
  error.status = 404;
  next(error);
});



// Rutas
const productRoutes = require('./src/routes/products');
const cartRoutes = require('./src/routes/carts');
const userRoutes = require('./src/routes/users');
const passwordResetRoutes = require('./src/routes/passwordReset');

// Rutas para productos y carritos
app.use('/api/products', productRoutes);
app.use('/products', ensureAuthenticated, productRoutes);
app.use('/api/carts', cartRoutes);
app.use('/carts', ensureAuthenticated, cartRoutes);
app.use('/api/users', userRoutes);

// Rutas para usuarios y restablecimiento de contraseñas
app.use('/users', userRoutes);
app.use('/password-reset', passwordResetRoutes);
app.use('/api/users', require('./src/routes/api/apiUsers')); // Nueva ruta

// Nueva ruta para cambiar el rol del usuario
app.post('/users/:id/change-role', ensureAuthenticated, ensureAdmin, async (req, res, next) => {
  try {
    const userId = req.params.id;
    const newRole = req.body.role;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    user.role = newRole;
    await user.save();
    res.status(200).json({ message: 'User role updated successfully', user });
  } catch (error) {
    logger.error('Error changing user role:', error);
    next(error);
  }
});

app.get('/api/sessions/current', (req, res) => {
  if (req.isAuthenticated()) {
    res.json({ user: req.user });
  } else {
    res.status(401).json({ error: 'Not authenticated' });
  }
});

app.get('/realtimeproducts', ensureAuthenticated, async (req, res, next) => {
  try {
    const products = await new ProductManager().getAllProducts();
    res.render('realTimeProducts', { products });
  } catch (error) {
    next(error);
  }
});

app.get('/chat', ensureAuthenticated, async (req, res, next) => {
  try {
    const messages = await new MessageManager().getAllMessages();
    res.render('chat', { messages });
  } catch (error) {
    next(error);
  }
});

// Ruta para probar el logger
app.get('/loggertest', (req, res, next) => {
  try {
    logger.debug('Debug log');
    logger.http('HTTP log');
    logger.info('Info log');
    logger.warning('Warning log');
    logger.error('Error log');
    logger.fatal('Fatal log');
    res.send('Logger test completed. Check your logs.');
  } catch (error) {
    logger.error('Error in /loggertest route:', error);
    next(error);
  }
});

// Nueva ruta para registrar errores del cliente
app.post('/api/logerror', (req, res) => {
  const { message, stack } = req.body;
  logger.error(`Client-side error: ${message} - ${stack}`);
  res.status(204).send();
});

app.get('/carts/:cid', ensureAuthenticated, async (req, res, next) => {
  try {
    const cart = await new CartManager().getCartById(req.params.cid);
    if (!cart) {
      return res.status(404).json({ error: 'Cart not found' });
    }
    res.render('cart', { cart });
  } catch (error) {
    next(error);
  }
});

// Nueva ruta para el checkout
app.get('/checkout', ensureAuthenticated, async (req, res, next) => {
  try {
    // Obtener el cartId desde los parámetros de la consulta
    const cartId = req.query.cartId;
    if (!cartId) {
      return res.status(400).json({ error: 'No cart ID found in query parameters' });
    }

    const cart = await new CartManager().getCartById(cartId);
    if (!cart) {
      return res.status(404).json({ error: 'Cart not found' });
    }

    res.render('checkout', { cart });
  } catch (error) {
    logger.error('Error retrieving cart by ID:', error);
    next(error);
  }
});

io.on('connection', (socket) => {
  logger.info('Usuario conectado');

  socket.on('new product', async (product) => {
    try {
      const userId = socket.request.session?.passport?.user;
      if (!userId) {
        return socket.emit('error', 'User not authenticated.');
      }

      product.owner = userId;

      const newProduct = await new ProductManager().addProduct(product);
      io.emit('product update', newProduct);
    } catch (error) {
      logger.error('Error adding product:', error);
      socket.emit('error', 'Error adding product.');
    }
  });

  // Actualizar la lógica para eliminar producto
  socket.on('delete product', async (productId) => {
    logger.info(`Server received request to delete product with ID: ${productId}`);
    try {
      const productManager = new ProductManager();
      const existingProduct = await productManager.getProductById(productId);

      if (!existingProduct) {
        return socket.emit('error', 'Product not found.');
      }

      // Obtener al propietario del producto
      const owner = await userManager.findUserById(existingProduct.owner);

      // Verificar si el propietario es un usuario premium
      if (owner && owner.role === 'premium') {
        logger.info(`Sending email to premium user: ${owner.email}`);

        const mailOptions = {
          from: process.env.EMAIL_USER,
          to: owner.email,
          subject: 'Producto eliminado',
          text: `Hola ${owner.first_name}, tu producto "${existingProduct.title}" ha sido eliminado.`,
        };

        try {
          await transporter.sendMail(mailOptions);
          logger.info('Email sent successfully');
        } catch (emailError) {
          logger.error(`Error sending email to ${owner.email}:`, emailError);
        }
      }

      // Eliminar el producto
      await productManager.deleteProduct(productId);
      io.emit('product delete', productId);
    } catch (error) {
      logger.error('Error deleting product:', error);
      socket.emit('error', `Error deleting product with id ${productId}: ${error.message}`);
    }
  });

  socket.on('disconnect', () => {
    logger.info('Usuario desconectado');
  });
});


// Manejador para rutas no encontradas (404)
app.use((req, res, next) => {
  const error = new Error('Not Found');
  error.status = 404;
  next(error);
});

// Integrar el manejador de errores al final
app.use(errorHandler);

server.listen(port, () => {
  logger.info(`Server running on port ${port}`);
});

module.exports = { app, server };
