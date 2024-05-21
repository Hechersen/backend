const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const { engine } = require('express-handlebars');
const ProductManager = require('./models/productManager');
const productManager = new ProductManager('./data/products.json');

const app = express();
const server = http.createServer(app);
const io = new Server(server);
const port = 8080;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.engine('handlebars', engine());
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
    await productManager.deleteProduct(parseInt(productId));
    io.emit('product delete', productId);
  });

  socket.on('disconnect', () => {
    console.log('Usuario desconectado');
  });
});

server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

module.exports = app;
