const express = require('express');
const router = express.Router();
const upload = require('../../middleware/multer');
const userController = require('../../controllers/userController');

// Ruta para cambiar el rol de un usuario a premium
router.post('/premium/:uid', userController.changeUserRole);

// Ruta para subir documentos
router.post('/:uid/documents', upload.array('documents', 10), userController.uploadDocuments);

// Renderizar handlebars
router.get('/:uid/upload-documents', (req, res) => {
  res.render('uploadDocuments', { userId: req.params.uid });
});

// Ruta para obtener todos los usuarios
router.get('/', userController.getAllUsers);

// Ruta para eliminar usuarios inactivos
router.delete('/', userController.deleteInactiveUsers);

module.exports = router;
