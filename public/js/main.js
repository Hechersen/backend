const socket = io();

socket.on('product update', (product) => {
  const item = document.createElement('li');
  item.textContent = `${product.name} - ${product.price}`;
  document.getElementById('productList').appendChild(item);
});

socket.on('product delete', (productId) => {
  const productList = document.getElementById('productList');
  const items = productList.getElementsByTagName('li');
  for (let item of items) {
    if (item.textContent.includes(productId)) {
      productList.removeChild(item);
      break;
    }
  }
});
