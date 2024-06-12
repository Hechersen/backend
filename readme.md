paso a paso para no olvidarme

1-intalamos los paquetes necesarios
npm install bcryptjs passport passport-local express-session connect-flash

2-crear modelo para usuario (user.js)
3-crear archivo passport (passport.js)
4-modificamos app.js 
5-creamos rutas para login y register
6-creamos products.handlebars
7-verificar roles
8-modificamos main.handlebars

function ensureAdmin(req, res, next) {
  if (req.user && req.user.role === 'admin') {
    return next();
  }
  req.flash('error_msg', 'Admin access only');
  res.redirect('/users/login');
}

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  req.flash('error_msg', 'Please log in to view that resource');
  res.redirect('/users/login');
}
