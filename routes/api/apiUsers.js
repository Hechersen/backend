const express = require('express');
const router = express.Router();
const upload = require('../../middleware/multer'); // Importamos multer correctamente desde middleware
const userController = require('../../controllers/userController');

// Ruta para cambiar el rol de un usuario a premium
router.post('/premium/:uid', userController.changeUserRole);

// Ruta para subir documentos
router.post('/:uid/documents', upload.array('documents', 10), userController.uploadDocuments);

// Renderizar handlebars
router.get('/:uid/upload-documents', (req, res) => {
    res.render('uploadDocuments', { userId: req.params.uid });
  });  

module.exports = router;
