const fs = require('fs/promises');

class CartManager {
    constructor(filePath) {
        this.filePath = filePath;
    }

    async init() {
        try {
            await fs.access(this.filePath);
        } catch {
            await fs.writeFile(this.filePath, JSON.stringify([]));
        }
    }

    async getCarts() {
        const data = await fs.readFile(this.filePath, 'utf-8');
        return JSON.parse(data);
    }

    async getCartById(cartId) {
        const carts = await this.getCarts();
        return carts.find(cart => cart.id === cartId) || null;
    }

    async addProductToCart(cartId, product, quantity) {
        const carts = await this.getCarts();
        const cart = carts.find(cart => cart.id === cartId);
        if (!cart) {
            throw new Error('Cart not found');
        }
        const existingProduct = cart.products.find(p => p.id === product.id);
        if (existingProduct) {
            existingProduct.quantity += quantity;
        } else {
            product.quantity = quantity;
            cart.products.push(product);
        }
        await this.saveCarts(carts);
    }

    async saveCarts(carts) {
        await fs.writeFile(this.filePath, JSON.stringify(carts, null, 2));
    }

    async createCart() {
        const carts = await this.getCarts();
        const newCart = { id: Date.now(), products: [] };
        carts.push(newCart);
        await this.saveCarts(carts);
        return newCart;
    }

    async removeProductFromCart(cartId, productId) {
        const carts = await this.getCarts();
        const cart = carts.find(cart => cart.id === cartId);
        if (!cart) {
            throw new Error('Cart not found');
        }
        cart.products = cart.products.filter(product => product.id !== productId);
        await this.saveCarts(carts);
    }
}

module.exports = CartManager;
