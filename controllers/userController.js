const bcrypt = require('bcryptjs');
const User = require('../models/user');
const passport = require('passport'); // Asegúrate de importar passport aquí

exports.register = async (req, res) => {
  const { first_name, last_name, email, age, password, password2 } = req.body;
  let errors = [];

  if (password !== password2) {
    errors.push({ msg: 'Passwords do not match' });
  }

  if (errors.length > 0) {
    res.render('register', { errors, first_name, last_name, email, age, password, password2 });
  } else {
    const user = await User.findOne({ email });
    if (user) {
      errors.push({ msg: 'Email is already registered' });
      res.render('register', { errors, first_name, last_name, email, age, password, password2 });
    } else {
      const newUser = new User({ first_name, last_name, email, age, password });
      const salt = await bcrypt.genSalt(10);
      newUser.password = await bcrypt.hash(password, salt);
      await newUser.save();
      req.flash('success_msg', 'You are now registered and can log in');
      res.redirect('/users/login');
    }
  }
};

exports.login = (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/products/view',
    failureRedirect: '/users/login',
    failureFlash: true
  })(req, res, next);
};

exports.logout = (req, res) => {
  req.logout();
  req.flash('success_msg', 'You are logged out');
  res.redirect('/users/login');
};

exports.githubCallback = (req, res) => {
  res.redirect('/products/view');
};
