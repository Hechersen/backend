{{!-- <script>
    function addToCart(productId) {
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
  </script> --}}

  {{!-- <script>
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

    function addToCart(productId) {
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
  </script> --}}