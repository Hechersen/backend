const mongoose = require('mongoose');
const Product = require('../../models/product');
const logger = require('../../utils/logger');

class ProductManager {
  async addProduct(productData) {
    try {
      const product = new Product(productData);
      await product.save();
      return product;
    } catch (error) {
      logger.error('Error adding product:', error);
      throw new Error('Error adding product');
    }
  }

  async getAllProducts() {
    try {
      return await Product.find();
    } catch (error) {
      logger.error('Error retrieving products:', error);
      throw new Error('Error retrieving products');
    }
  }

  async getProducts(queryFilter, options) {
    try {
      const products = await Product.paginate(queryFilter, options);
      return products;
    } catch (error) {
      logger.error('Error retrieving products with pagination:', error);
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
      logger.error('Error retrieving product by ID:', error);
      throw new Error('Product not found');
    }
  }

  async updateProduct(id, newData) {
    try {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new Error('Invalid product ID format');
      }
      const objectId = new mongoose.Types.ObjectId(id);
      return await Product.findByIdAndUpdate(objectId, newData, { new: true });
    } catch (error) {
      logger.error('Error updating product:', error);
      throw new Error('Error updating product');
    }
  }

  async deleteProduct(id) {
    try {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new Error('Invalid product ID format');
      }
      const objectId = new mongoose.Types.ObjectId(id);
      const result = await Product.findByIdAndDelete(objectId);
      if (!result) {
        throw new Error('Product not found');
      }
      return { message: 'Product deleted successfully' };
    } catch (error) {
      logger.error('Error deleting product:', error);
      throw new Error(`Error deleting product with id ${id}`);
    }
  }
}

module.exports = ProductManager;
