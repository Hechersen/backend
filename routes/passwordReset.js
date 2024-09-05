const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Ruta para solicitar el restablecimiento de contraseña
router.get('/request', (req, res) => {
  res.render('requestPasswordReset');
});

// Ruta para procesar la solicitud de restablecimiento de contraseña
router.post('/request', userController.requestPasswordReset);

// Ruta para restablecer la contraseña usando el token
router.get('/reset/:token', userController.renderResetPassword);

// Ruta para procesar la nueva contraseña
router.post('/reset/:token', userController.resetPassword);

module.exports = router;
