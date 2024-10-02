document.addEventListener('DOMContentLoaded', () => {
  const socket = io();


  // Función para actualizar el total por producto y el total general
  function updateTotals() {
    const cartItems = document.querySelectorAll('#cartItems tr');
    let totalAmount = 0;

    cartItems.forEach((row) => {
      const price = parseFloat(row.querySelector('td:nth-child(2)').textContent);
      const quantity = parseInt(row.querySelector('.quantity-input').value);
      const productTotal = price * quantity;

      // Actualizar el total por producto
      row.querySelector('.product-total').textContent = productTotal.toFixed(2);

      // Sumar al total general
      totalAmount += productTotal;
    });

    // Actualizar el total general en la vista
    document.getElementById('totalAmount').textContent = totalAmount.toFixed(2);
  }

  // Escuchar cambios en las cantidades de los productos
  document.querySelectorAll('.quantity-input').forEach(input => {
    input.addEventListener('input', updateTotals);
  });

  // **Formulario para agregar productos**
  const addProductForm = document.getElementById('addProductForm');
  if (addProductForm) {
    addProductForm.addEventListener('submit', (e) => {
      e.preventDefault();
      try {
        const title = document.getElementById('productName').value;
        const price = document.getElementById('productPrice').value;
        const code = document.getElementById('productCode').value;
        const category = document.getElementById('productCategory').value;
        const description = document.getElementById('productDescription').value;
        const stock = document.getElementById('productStock').value;

        const product = { title, price, code, category, description, stock };

        // Emitir el evento 'new product' al servidor
        socket.emit('new product', product);

        // Reiniciar el formulario después de agregar el producto
        addProductForm.reset();
      } catch (error) {
        handleClientError(error, 'Error adding product');
      }
    });
  }

  // **Formulario para eliminar productos**
  const deleteProductForm = document.getElementById('deleteProductForm');
  if (deleteProductForm) {
    deleteProductForm.addEventListener('submit', (e) => {
      e.preventDefault();
      try {
        const productId = document.getElementById('deleteProductId').value;
        socket.emit('delete product', productId);
      } catch (error) {
        handleClientError(error, 'Error deleting product');
      }
    });
  }

  // **Formulario para actualizar productos**
  const updateProductForm = document.getElementById('updateProductForm');
  if (updateProductForm) {
    updateProductForm.addEventListener('submit', (e) => {
      e.preventDefault();
      try {
        const productId = document.getElementById('updateProductId').value;
        const category = document.getElementById('updateProductCategory').value;
        const description = document.getElementById('updateProductDescription').value;
        const stock = document.getElementById('updateProductStock').value;

        fetch(`/api/products/${productId}/update`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ category, description, stock })
        }).then(response => {
          if (response.ok) {
            alert('Product updated successfully');
          } else {
            alert('Error updating product');
          }
        }).catch(error => {
          handleClientError(error, 'Error updating product');
        });
      } catch (error) {
        handleClientError(error, 'Error updating product');
      }
    });
  }

  // **Escuchar evento de actualización de stock**
  socket.on('stock update', (data) => {
    try {
      const productRow = document.querySelector(`tr[data-id='${data.productId}']`);
      if (productRow) {
        const stockElement = productRow.querySelector('.product-stock');
        if (stockElement) {
          stockElement.textContent = data.stock;
        }
      }
    } catch (error) {
      handleClientError(error, 'Error updating stock');
    }
  });

  // **Manejo de la actualización de productos en tiempo real**
  socket.on('product update', (product) => {
    try {
      const existingRow = document.querySelector(`tr[data-id='${product._id}']`);
      if (existingRow) {
        existingRow.innerHTML = `
          <td>${product.title}</td>
          <td>${product.price}</td>
          <td>${product._id}</td>
          <td>${product.code}</td>
          <td>${product.category}</td>
          <td>${product.description}</td>
          <td class="product-stock">${product.stock}</td>
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
          <td>${product.stock}</td>
          <td><button class="addToCartButton" data-product-id="${product._id}">Add to Cart</button></td>
        `;
        document.getElementById('productList').appendChild(row);
        row.querySelector('.addToCartButton').addEventListener('click', addToCart);
      }
    } catch (error) {
      handleClientError(error, 'Error handling product update');
    }
  });

  // **Manejo de la eliminación de productos en tiempo real**
  socket.on('product delete', (productId) => {
    try {
      const row = document.querySelector(`tr[data-id='${productId}']`);
      if (row) {
        row.remove();
      }
    } catch (error) {
      handleClientError(error, 'Error handling product delete');
    }
  });

  // **Mostrar errores**
  socket.on('error', (message) => {
    alert(message);
  });

  // **Función para crear un carrito**
  const createCartButton = document.getElementById('createCartButton');
  if (createCartButton) {
    createCartButton.addEventListener('click', createCart);
  }

  // **Asignar eventos a los botones existentes**
  document.querySelectorAll('.addToCartButton').forEach(button => {
    button.addEventListener('click', addToCart);
  });

  const checkoutViewButton = document.getElementById('checkoutViewButton');
  if (checkoutViewButton) {
    checkoutViewButton.addEventListener('click', () => {
      const cartId = localStorage.getItem('cartId');
      if (!cartId) {
        alert('No cart found. Please create a cart first.');
        return;
      }
      window.location.href = `/checkout?cartId=${cartId}`;
    });
  }

  // **Finalizar compra**
  const finalizePurchaseButton = document.getElementById('finalizePurchaseButton');
  if (finalizePurchaseButton) {
    finalizePurchaseButton.addEventListener('click', finalizePurchase);
  }
});

// **Función para crear un carrito**
function createCart() {
  fetch('/api/carts', {
    method: 'POST'
  }).then(response => response.json()).then(data => {
    localStorage.setItem('cartId', data.id);
    alert('Cart created');
  }).catch(error => {
    handleClientError(error, 'Error creating cart');
  });
}

// **Función para agregar un producto al carrito**
function addToCart(event) {
  try {
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
      handleClientError(error, 'Error adding product to cart');
    });
  } catch (error) {
    handleClientError(error, 'Error adding product to cart');
  }
}

function finalizePurchase() {
  try {
    const cartId = localStorage.getItem('cartId');
    if (!cartId) {
      alert('No cart found. Please create a cart first.');
      return;
    }

    let requestBody = {}; // Objeto para el cuerpo de la solicitud

    // Detectar si estamos en la vista de checkout
    const isCheckoutView = document.querySelector('#cartItems') !== null;

    if (isCheckoutView) {
      // Si estamos en la vista de checkout, obtenemos las cantidades actualizadas
      let updatedProducts = [];
      document.querySelectorAll('#cartItems tr').forEach(row => {
        const productId = row.getAttribute('data-id');
        const quantity = parseInt(row.querySelector('.quantity-input').value);
        updatedProducts.push({ productId, quantity });
      });

      // Incluir los productos actualizados en el cuerpo de la solicitud
      requestBody = { products: updatedProducts };
    }

    // Enviar la solicitud de compra al servidor
    fetch(`/api/carts/${cartId}/checkout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: isCheckoutView ? JSON.stringify(requestBody) : null // Solo enviar el cuerpo si estamos en checkout
    })
      .then(response => response.json())
      .then(data => {
        if (data.message) {
          alert('Purchase finalized successfully');
        }
        if (data.failedProducts && data.failedProducts.length > 0) {
          const failedProducts = data.failedProducts.map(item => `- ${item.product.title} (x${item.quantity})`).join('\n');
          alert(`Purchase completed with some failures:\n\nFailed Products:\n${failedProducts}`);
        }
      })
      .catch(error => {
        handleClientError(error, 'Error finalizing purchase');
      });
  } catch (error) {
    handleClientError(error, 'Error finalizing purchase');
  }
}


// **Función para manejar errores del cliente**
function handleClientError(error, context) {
  console.error(`${context}:`, error);
  fetch('/api/logerror', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ message: `${context}: ${error.message}`, stack: error.stack })
  });
}
