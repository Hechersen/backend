const CartManager = require('./dao/db/cartManager');
const ProductManager = require('./dao/db/productManager');
const UserManager = require('./dao/db/userManager');

class DAOFactory {
    static getDAO(entity) {
        switch (entity) {
            case 'cart':
                return new CartManager();
            case 'product':
                return new ProductManager();
            case 'user':
                return new UserManager();
            default:
                throw new Error('Unknown entity type');
        }
    }
}

module.exports = DAOFactory;
