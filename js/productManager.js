const fs = require('fs');
const path = require('path');

class ProductManager {
  constructor(filePath) {
    this.path = filePath;
    this.init();
  }

  init() {
    if (!fs.existsSync(this.path)) {
      fs.writeFileSync(this.path, JSON.stringify([]));
      this.quantity = 0;
    } else {
      const products = this.getAllProducts();
      this.quantity = products.length > 0 ? products[products.length - 1].id : 0;
    }
  }

  saveProducts(products) {
    fs.writeFileSync(this.path, JSON.stringify(products, null, 2));
  }

  addProduct({ title, description, price, thumbnail, code, stock }) {
    const products = this.getAllProducts();
    const productExists = products.some(product => product.code === code);
    if (productExists) {
      throw new Error('Product with the given code already exists.');
    }
    const product = {
      id: ++this.quantity,
      title,
      description,
      price,
      thumbnail,
      code,
      stock
    };
    products.push(product);
    this.saveProducts(products);
    return product;
  }

  getAllProducts() {
    if (fs.existsSync(this.path)) {
      const productsData = fs.readFileSync(this.path, 'utf-8');
      return JSON.parse(productsData);
    }
    return [];
  }

  getProductById(id) {
    const products = this.getAllProducts();
    const product = products.find(product => product.id === id);
    return product || { error: 'Product not found' };
  }

  updateProduct(id, newData) {
    const products = this.getAllProducts();
    const index = products.findIndex(product => product.id === id);
    if (index === -1) {
      return { error: 'Product not found' };
    }

    newData.id = id;
    products[index] = { ...products[index], ...newData };
    this.saveProducts(products);
    return products[index];
  }

  deleteProduct(id) {
    let products = this.getAllProducts();
    const index = products.findIndex(product => product.id === id);
    if (index === -1) {
      return { error: 'Product not found' };
    }
    products = products.filter(product => product.id !== id);
    this.saveProducts(products);
    return { message: 'Product deleted successfully' };
  }
}

module.exports = ProductManager;

