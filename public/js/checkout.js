document.addEventListener('DOMContentLoaded', () => {
    const cartId = localStorage.getItem('cartId');
    if (!cartId) {
      alert('No cart found. Please create a cart first.');
      return;
    }
  
    // Función para obtener y mostrar los productos del carrito
    function loadCartProducts() {
      fetch(`/api/carts/${cartId}`)
        .then(response => response.json())
        .then(data => {
          const productList = document.getElementById('cartProducts');
          productList.innerHTML = '';
          data.products.forEach(item => {
            const row = document.createElement('tr');
            row.innerHTML = `
              <td>${item.product.title}</td>
              <td>${item.product.price}</td>
              <td>${item.quantity}</td>
              <td>
                <button class="updateQuantity" data-product-id="${item.product._id}">Update</button>
                <button class="removeProduct" data-product-id="${item.product._id}">Remove</button>
              </td>
            `;
            productList.appendChild(row);
          });
        })
        .catch(error => console.error('Error loading cart products:', error));
    }
  
    // Cargar los productos del carrito al cargar la página
    loadCartProducts();
  
    // Actualizar la cantidad de un producto
    document.getElementById('cartProducts').addEventListener('click', (e) => {
      if (e.target.classList.contains('updateQuantity')) {
        const productId = e.target.dataset.productId;
        const quantity = prompt('Enter new quantity:');
        if (quantity) {
          fetch(`/api/carts/${cartId}/products/${productId}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ quantity: parseInt(quantity, 10) })
          }).then(response => {
            if (response.ok) {
              loadCartProducts();
            } else {
              alert('Error updating product quantity.');
            }
          });
        }
      }
  
      // Eliminar un producto del carrito
      if (e.target.classList.contains('removeProduct')) {
        const productId = e.target.dataset.productId;
        fetch(`/api/carts/${cartId}/products/${productId}`, {
          method: 'DELETE'
        }).then(response => {
          if (response.ok) {
            loadCartProducts();
          } else {
            alert('Error removing product from cart.');
          }
        });
      }
    });
  
    // Finalizar la compra
    document.getElementById('finalizePurchaseButton').addEventListener('click', () => {
      fetch(`/api/carts/${cartId}/checkout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(response => response.json())
        .then(data => {
          if (data.message) {
            alert('Purchase finalized successfully');
          }
          if (data.failedProducts && data.failedProducts.length > 0) {
            const failedProducts = data.failedProducts.map(item => `- ${item.product.title} (x${item.quantity})`).join('\n');
            alert(`Purchase completed with some failures:\n\nFailed Products:\n${failedProducts}`);
          }
        }).catch(error => {
          console.error('Error finalizing purchase:', error);
        });
    });
  });
  