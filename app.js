const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const { engine } = require('express-handlebars');
const fs = require('fs');
const path = require('path');

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

const productsFilePath = path.join(__dirname, 'data', 'products.json');

const readProducts = () => {
  try {
    const data = fs.readFileSync(productsFilePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
};

const saveProducts = (products) => {
  fs.writeFileSync(productsFilePath, JSON.stringify(products, null, 2), 'utf8');
};

const productRoutes = require('./routes/products');
const cartRoutes = require('./routes/carts');
app.use('/api/products', productRoutes);
app.use('/api/carts', cartRoutes);

io.on('connection', (socket) => {
  console.log('Usuario conectado');

  socket.on('new product', (product) => {
    const products = readProducts();
    const existingProduct = products.find(p => p.code === product.code);
    if (existingProduct) {
      socket.emit('error', 'Product with this code already exists');
    } else {
      products.push(product);
      saveProducts(products);
      io.emit('product update', product);
    }
  });

  socket.on('delete product', (productId) => {
    const products = readProducts();
    const filteredProducts = products.filter(p => p.id !== productId);
    saveProducts(filteredProducts);
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
