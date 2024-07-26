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

// Ruta para obtener el usuario actual
router.get('/current', userController.getCurrentUser);

module.exports = router;

