document.addEventListener('DOMContentLoaded', () => {
  const socket = io();

  // Formulario para agregar productos
  document.getElementById('addProductForm')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const title = document.getElementById('productName').value;
    const price = document.getElementById('productPrice').value;
    const code = document.getElementById('productCode').value;
    const category = document.getElementById('productCategory').value;
    const description = document.getElementById('productDescription').value;
    const product = { title, price, code, category, description };
    socket.emit('new product', product);

    document.getElementById('addProductForm').reset();
  });

  // Formulario para eliminar productos
  document.getElementById('deleteProductForm')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const productId = document.getElementById('deleteProductId').value;
    console.log(`Attempting to delete product with ID: ${productId}`);
    socket.emit('delete product', productId);
  });

  // Formulario para actualizar productos
  document.getElementById('updateProductForm')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const productId = document.getElementById('updateProductId').value;
    const category = document.getElementById('updateProductCategory').value;
    const description = document.getElementById('updateProductDescription').value;
    fetch(`/api/products/${productId}/update`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ category, description })
    }).then(response => {
      if (response.ok) {
        alert('Product updated successfully');
      } else {
        alert('Error updating product');
      }
    });
  });

  // Manejo de la actualización de productos en tiempo real
  socket.on('product update', (product) => {
    const existingRow = document.querySelector(`tr[data-id='${product._id}']`);
    if (existingRow) {
      existingRow.innerHTML = `
        <td>${product.title}</td>
        <td>${product.price}</td>
        <td>${product._id}</td>
        <td>${product.code}</td>
        <td>${product.category}</td>
        <td>${product.description}</td>
        <td><button class="addToCartButton" data-product-id="${product._id}">Add to Cart</button></td>
      `;
      existingRow.querySelector('.addToCartButton').addEventListener('click', addToCart);
    } else {
      const row = document.createElement('tr');
      row.setAttribute('data-id', product._id);
      row.innerHTML = `
        <td>${product.title}</td>
        <td>${product.price}</td>
        <td>${product._id}</td>
        <td>${product.code}</td>
        <td>${product.category}</td>
        <td>${product.description}</td>
        <td><button class="addToCartButton" data-product-id="${product._id}">Add to Cart</button></td>
      `;
      document.getElementById('productList').appendChild(row);
      row.querySelector('.addToCartButton').addEventListener('click', addToCart);
    }
  });

  // Manejo de la eliminación de productos en tiempo real
  socket.on('product delete', (productId) => {
    const row = document.querySelector(`tr[data-id='${productId}']`);
    if (row) {
      row.remove();
    }
  });

  // Mostrar errores
  socket.on('error', (message) => {
    alert(message);
  });

  // Función para crear un carrito
  document.getElementById('createCartButton')?.addEventListener('click', createCart);

  // Asignar eventos a los botones existentes
  document.querySelectorAll('.addToCartButton').forEach(button => {
    button.addEventListener('click', addToCart);
  });
});

// Función para crear un carrito
function createCart() {
  fetch('/api/carts', {
    method: 'POST'
  }).then(response => response.json()).then(data => {
    localStorage.setItem('cartId', data._id);
    alert('Cart created');
  }).catch(error => {
    alert('Error creating cart');
  });
}

// Función para agregar un producto al carrito
function addToCart(event) {
  const productId = event.target.dataset.productId;
  const cartId = localStorage.getItem('cartId');
  if (!cartId) {
    alert('No cart found. Please create a cart first.');
    return;
  }
  fetch(`/api/carts/${cartId}/products`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ productId, quantity: 1 })
  }).then(response => {
    if (response.ok) {
      alert('Product added to cart');
    } else {
      alert('Error adding product to cart');
    }
  }).catch(error => {
    alert('Error adding product to cart');
  });
}
