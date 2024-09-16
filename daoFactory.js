const CartManager = require('./src/dao/db/cartManager');
const ProductManager = require('./src/dao/db/productManager');
const UserManager = require('./src/dao/db/userManager');

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
