// const express = require('express');
// const router = express.Router();
// const passport = require('passport');
// const User = require('../models/user');
// const bcrypt = require('bcryptjs');

// // para github
// router.get('/github', passport.authenticate('github'));

// router.get('/github/callback', 
//   passport.authenticate('github', { failureRedirect: '/users/login' }),
//   (req, res) => {
//     res.redirect('/products/view');
//   });

// // Ruta para la vista de login (GET)
// router.get('/login', (req, res) => {
//   res.render('login'); 
// });

// // Ruta para procesar el login (POST)
// router.post('/login', (req, res, next) => {
//   passport.authenticate('local', {
//     successRedirect: '/products/view',
//     failureRedirect: '/users/login',
//     failureFlash: true
//   })(req, res, next);
// });

// // Ruta para logout
// router.get('/logout', (req, res, next) => {
//   req.logout((err) => {
//     if (err) { return next(err); }
//     req.flash('success_msg', 'You are logged out');
//     res.redirect('/users/login');
//   });
// });

// // Ruta para la vista de registro (GET)
// router.get('/register', (req, res) => {
//   res.render('register');
// });

// // Ruta para procesar el registro (POST)
// router.post('/register', async (req, res) => {
//   // Agregar los nuevos campos del modelo de usuario
//   const { first_name, last_name, email, age, password, password2 } = req.body;
//   let errors = [];

//   if (password !== password2) {
//     errors.push({ msg: 'Passwords do not match' });
//   }

//   if (errors.length > 0) {
//     res.render('register', { errors, first_name, last_name, email, age, password, password2 });
//   } else {
//     const user = await User.findOne({ email });
//     if (user) {
//       errors.push({ msg: 'Email is already registered' });
//       res.render('register', { errors, first_name, last_name, email, age, password, password2 });
//     } else {
//       // Agregar los nuevos campos al crear un nuevo usuario
//       const newUser = new User({ first_name, last_name, email, age, password });
//       const salt = await bcrypt.genSalt(10);
//       newUser.password = await bcrypt.hash(password, salt);
//       await newUser.save();
//       req.flash('success_msg', 'You are now registered and can log in');
//       res.redirect('/users/login');
//     }
//   }
// });

// module.exports = router;

const express = require('express');
const router = express.Router();
const passport = require('passport');
const userController = require('../controllers/userController');

// para github
router.get('/github', passport.authenticate('github'));

router.get('/github/callback', 
  passport.authenticate('github', { failureRedirect: '/users/login' }),
  userController.githubCallback);

// Ruta para la vista de login (GET)
router.get('/login', (req, res) => {
  res.render('login');
});

// Ruta para procesar el login (POST)
router.post('/login', userController.login);

// Ruta para logout
router.get('/logout', userController.logout);

// Ruta para la vista de registro (GET)
router.get('/register', (req, res) => {
  res.render('register');
});

// Ruta para procesar el registro (POST)
router.post('/register', userController.register);

module.exports = router;
