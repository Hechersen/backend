const errorDictionary = {
    PRODUCT_NOT_FOUND: 'The product you are looking for does not exist.',
    CART_NOT_FOUND: 'The cart you are looking for does not exist.',
    OUT_OF_STOCK: 'The product is out of stock.',
    INVALID_REQUEST: 'The request is invalid.'    
  };
  
  function errorHandler(err, req, res, next) {
    const errorMessage = errorDictionary[err.message] || 'An unexpected error occurred.';
    const statusCode = err.status || 500;
    res.status(statusCode).json({ error: errorMessage });
  }
  
  module.exports = errorHandler;
  