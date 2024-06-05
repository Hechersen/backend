const mongoose = require('mongoose');
const Product = require('../../models/product');

class ProductManager {
  async addProduct(productData) {
    try {
      const product = new Product(productData);
      await product.save();
      return product;
    } catch (error) {
      throw new Error('Error adding product');
    }
  }

  async getAllProducts() {
    try {
      return await Product.find();
    } catch (error) {
      throw new Error('Error retrieving products');
    }
  }

  async getProducts(queryFilter, options) {
    try {
      const products = await Product.paginate(queryFilter, options);
      return products;
    } catch (error) {
      throw new Error('Error retrieving products');
    }
  }

  async getProductById(id) {
    try {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new Error('Invalid product ID format');
      }
      return await Product.findById(id);
    } catch (error) {
      throw new Error('Product not found');
    }
  }

  async updateProduct(id, newData) {
    try {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new Error('Invalid product ID format');
      }
      const objectId = mongoose.Types.ObjectId(id);
      return await Product.findByIdAndUpdate(objectId, newData, { new: true });
    } catch (error) {
      throw new Error('Error updating product');
    }
  }

  async deleteProduct(id) {
    try {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        console.error('Invalid product ID format');
        throw new Error('Invalid product ID format');
      }
      const objectId = new mongoose.Types.ObjectId(id);
      const result = await Product.findByIdAndDelete(objectId);
      if (!result) {
        console.error('Product not found');
        throw new Error('Product not found');
      }
      return { message: 'Product deleted successfully' };
    } catch (error) {
      throw new Error(`Error deleting product with id ${id}`);
    }
  }
}

module.exports = ProductManager;
