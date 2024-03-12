class ProductManager {
  static quantity = 0;
  static #products = [];

  create({ title, photo, category, price, stock }) {
    if (!title || !photo || !category || price == null || stock == null) {
      throw new Error('All fields except id are required');
    }
    const product = {
      id: ++ProductManager.quantity,
      title,
      photo,
      category,
      price,
      stock
    };
    ProductManager.#products.push(product);
    return product;
  }

  read() {
    return ProductManager.#products;
  }

  readOne(id) {
    return ProductManager.#products.find(product => product.id === id) || null;
  }

  update(id, newData) {
    const index = ProductManager.#products.findIndex(product => product.id === id);
    if (index === -1) return null;

    ProductManager.#products[index] = { ...ProductManager.#products[index], ...newData };
    return ProductManager.#products[index];
  }

  destroy(id) {
    const index = ProductManager.#products.findIndex(product => product.id === id);
    if (index === -1) return false;

    ProductManager.#products.splice(index, 1);
    return true;
  }
}

module.exports = ProductManager;
