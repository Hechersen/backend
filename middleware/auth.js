function ensureAdmin(req, res, next) {
    if (req.user && req.user.role === 'admin') {
      return next();
    }
    req.flash('error_msg', 'Admin access only');
    res.redirect('/users/login');
  }
  
  module.exports = { ensureAdmin };
  