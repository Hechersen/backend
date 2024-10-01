// const express = require('express');
// const router = express.Router();
// const passport = require('passport');
// const userController = require('../controllers/userController');

// // para github
// router.get('/github', passport.authenticate('github'));

// router.get('/github/callback',
//   passport.authenticate('github', { failureRedirect: '/users/login' }),
//   userController.githubCallback);

// // Ruta para la vista de login (GET)
// router.get('/login', (req, res) => {
//   res.render('login');
// });

// // Ruta para procesar el login (POST)
// router.post('/login', userController.login);

// // Ruta para logout
// router.get('/logout', userController.logout);

// // Ruta para la vista de registro (GET)
// router.get('/register', (req, res) => {
//   res.render('register');
// });

// // Ruta para procesar el registro (POST)
// router.post('/register', userController.register);

// // Ruta para obtener el usuario actual
// router.get('/current', userController.getCurrentUser);

// // Nueva ruta para solicitar el restablecimiento de contraseña
// router.post('/request-password-reset', userController.requestPasswordReset);

// // Nueva ruta para procesar el restablecimiento de contraseña
// router.post('/reset-password', userController.resetPassword);

// // Ruta para cambiar el rol de un usuario (necesita autenticación y rol de administrador)
// router.post('/:uid/role', userController.changeUserRole);

// // Ruta para eliminar un usuario
// router.post('/:uid/delete', userController.deleteUser);

// // Ruta para renderizar la vista administrativa
// router.get('/admin', userController.renderAdminUsers);

// // Nueva ruta para handlebars
// // router.get('/admin', async (req, res) => {
// //   try {
// //     const users = await userRepository.findAllUsers();
// //     res.render('adminUsers', { users });
// //   } catch (error) {
// //     res.status(500).json({ error: 'Error loading admin page' });
// //   }
// // });

// router.post('/:id/role', ensureAuthenticated, ensureAdmin, async (req, res, next) => {
//   try {
//     const userId = req.params.id;
//     const newRole = req.body.role;

//     const user = await userRepository.findUserById(userId);
//     if (!user) {
//       return res.status(404).json({ error: 'User not found' });
//     }

//     user.role = newRole;
//     await user.save();
//     res.redirect('/users/admin');
//   } catch (error) {
//     logger.error('Error changing user role:', error);
//     next(error);
//   }
// });


// module.exports = router;

const express = require('express');
const router = express.Router();
const passport = require('passport');
const userController = require('../controllers/userController');
const { ensureAuthenticated, ensureAdmin } = require('../middleware/auth'); // Importar funciones de autenticación

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

// Nueva ruta para solicitar el restablecimiento de contraseña
router.post('/request-password-reset', userController.requestPasswordReset);

// Nueva ruta para procesar el restablecimiento de contraseña
router.post('/reset-password', userController.resetPassword);

// Ruta para cambiar el rol de un usuario (necesita autenticación y rol de administrador)
router.post('/:uid/role', ensureAuthenticated, ensureAdmin, userController.changeUserRole);

// Ruta para eliminar un usuario
router.post('/:uid/delete', ensureAuthenticated, ensureAdmin, userController.deleteUser);

// Ruta para renderizar la vista administrativa
router.get('/admin', ensureAuthenticated, ensureAdmin, userController.renderAdminUsers);

// Ruta para eliminar usuarios inactivos
router.post('/delete-inactive', userController.deleteInactiveUsers);

module.exports = router;

