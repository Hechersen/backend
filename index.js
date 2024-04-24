const ProductManager = require('./js/productManager');
const UserManager = require('./js/userManager');

const productManager = new ProductManager('./data/products.json');
const userManager = new UserManager();

productManager.addProduct({ code: 'BUZO001', title: 'Buzo de Algodón', thumbnail: 'buzo-algodon.jpg', description: 'Buzo de algodón cómodo', price: 45.99, stock: 20 });
productManager.addProduct({ code: 'REM002', title: 'Remera Manga Corta', thumbnail: 'remera-manga-corta.jpg', description: 'Remera manga corta casual', price: 19.99, stock: 50 });
productManager.addProduct({ code: 'ZAP003', title: 'Zapatillas Deportivas', thumbnail: 'zapatillas-deportivas.jpg', description: 'Zapatillas para todo tipo de deportes', price: 89.99, stock: 15 });

console.log(productManager.getAllProducts());
console.log(userManager.read());
