document.addEventListener('DOMContentLoaded', () => {
  const socket = io();

  // Manejo de eventos para el formulario de agregar producto
  document.getElementById('addProductForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const title = document.getElementById('productName').value;
    const price = document.getElementById('productPrice').value;
    const code = document.getElementById('productCode').value;
    const product = { title, price, code };
    socket.emit('new product', product);
  });

  // Manejo de eventos para el formulario de eliminar producto
  document.getElementById('deleteProductForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const productId = document.getElementById('deleteProductId').value;
    socket.emit('delete product', productId);
  });

  // Actualización de la lista de productos en tiempo real
  socket.on('product update', (product) => {
    const row = document.createElement('tr');
    row.setAttribute('data-id', product.id);
    row.innerHTML = `
      <td>${product.title}</td>
      <td>${product.price}</td>
      <td>${product.id}</td>
      <td>${product.code}</td>
    `;
    document.getElementById('productList').appendChild(row);
  });

  // Eliminación de un producto de la lista en tiempo real
  socket.on('product delete', (productId) => {
    const row = document.querySelector(`tr[data-id='${productId}']`);
    if (row) {
      row.remove();
    }
  });

  // Manejo de mensajes de error
  socket.on('error', (message) => {
    alert(message);
  });

});
