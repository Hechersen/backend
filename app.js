
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const { engine } = require('express-handlebars');
const connectDB = require('./db');
// const ProductManager = require('./dao/fileSystem/productManager');
// const productManager = new ProductManager('./data/products.json');
const ProductManager = require('./dao/db/productManager'); // Asegúrate de que esta ruta es correcta
const productManager = new ProductManager();
// pal chat
const MessageManager = require('./dao/db/messageManager');
const messageManager = new MessageManager();


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

const productRoutes = require('./routes/products');
const cartRoutes = require('./routes/carts');
app.use('/api/products', productRoutes);
app.use('/api/carts', cartRoutes);

app.get('/realtimeproducts', async (req, res) => {
  const products = await productManager.getAllProducts();
  res.render('realTimeProducts', { products });
});

app.get('/chat', (req, res) => {
  res.render('chat');
});

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

  // socket.on('delete product', async (productId) => {
  //   try {
  //     const product = await productManager.getProductById(parseInt(productId));
  //     if (!product || product.error) {
  //       socket.emit('error', `Product with id ${productId} not found`);
  //     } else {
  //       await productManager.deleteProduct(parseInt(productId));
  //       io.emit('product delete', productId);
  //     }
  //   } catch (error) {
  //     socket.emit('error', `Error deleting product with id ${productId}`);
  //   }
  // });

  socket.on('delete product', async (productId) => {
    console.log(`Server received request to delete product with ID: ${productId}`);
    try {
      const result = await productManager.deleteProduct(productId);
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
