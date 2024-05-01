const fs = require('fs/promises');

class ProductManager {
  constructor(filePath) {
    this.path = filePath;
    this.init();
  }

  async init() {
    try {
      await fs.access(this.path);
      const products = await this.getAllProducts();
      this.quantity = products.length > 0 ? products[products.length - 1].id : 0;
    } catch (error) {
      await fs.writeFile(this.path, JSON.stringify([]));
      this.quantity = 0;
    }
  }

  async saveProducts(products) {
    await fs.writeFile(this.path, JSON.stringify(products, null, 2));
  }

  async addProduct({ title, description, price, thumbnail, code, stock }) {
    const products = await this.getAllProducts();
    if (products.some(product => product.code === code)) {
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
    await this.saveProducts(products);
    return product;
  }

  async getAllProducts() {
    try {
      const data = await fs.readFile(this.path, 'utf-8');
      return JSON.parse(data);
    } catch (error) {
      await fs.writeFile(this.path, JSON.stringify([]));
      return [];
    }
  }

  async getProductById(id) {
    const products = await this.getAllProducts();
    const product = products.find(product => product.id === id);
    return product || { error: 'Product not found' };
  }

  async updateProduct(id, newData) {
    const products = await this.getAllProducts();
    const index = products.findIndex(product => product.id === id);
    if (index === -1) {
      return { error: 'Product not found' };
    }
    newData.id = id;
    products[index] = { ...products[index], ...newData };
    await this.saveProducts(products);
    return products[index];
  }

  async deleteProduct(id) {
    const products = await this.getAllProducts();
    const index = products.findIndex(product => product.id === id);
    if (index === -1) {
      return { error: 'Product not found' };
    }
    const updatedProducts = products.filter(product => product.id !== id);
    await this.saveProducts(updatedProducts);
    return { message: 'Product deleted successfully' };
  }
}

module.exports = ProductManager;
