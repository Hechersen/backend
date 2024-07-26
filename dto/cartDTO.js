class CartDTO {
  constructor(cart) {
    this.id = cart._id;
    this.products = cart.products.map(p => ({
      product: p.product,
      quantity: p.quantity
    }));
  }
}

module.exports = CartDTO;
