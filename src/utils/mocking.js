// Función para generar un producto simulado
function generateMockProduct() {
  return {
    title: `Product ${Math.floor(Math.random() * 1000)}`,
    price: parseFloat((Math.random() * 100).toFixed(2)),
    code: `CODE${Math.floor(Math.random() * 1000)}`,
    category: 'Mock Category',
    description: 'This is a mock product description.',
    stock: Math.floor(Math.random() * 100),
  };
}

// Función para generar múltiples productos simulados
function generateMockProducts(count) {
  const products = [];
  for (let i = 0; i < count; i++) {
    products.push(generateMockProduct());
  }
  return products;
}

module.exports = { generateMockProducts };
