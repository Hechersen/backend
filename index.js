const ProductManager = require('./js/productManager');
const UserManager = require('./js/userManager');

const productManager = new ProductManager();
const userManager = new UserManager();

productManager.create({ title: 'Buzo de Algodón', photo: 'buzo-algodon.jpg', category: 'Ropa', price: 45.99, stock: 20 });
productManager.create({ title: 'Remera Manga Corta', photo: 'remera-manga-corta.jpg', category: 'Ropa', price: 19.99, stock: 50 });
productManager.create({ title: 'Zapatillas Deportivas', photo: 'zapatillas-deportivas.jpg', category: 'Calzado', price: 89.99, stock: 15 });

userManager.create({ photo: 'user1.png', email: 'jorge@gmail.com', password: 'jorge123', role: 'admin' });
userManager.create({ photo: 'user2.png', email: 'osvaldo@gmail.com', password: 'osvaldo123', role: 'user' });

console.log(productManager.read()); 
console.log(userManager.read()); 
