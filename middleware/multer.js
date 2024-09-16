const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const { fieldname } = file;

    // Definir diferentes carpetas según el tipo de archivo
    let folder = 'documents';
    if (fieldname === 'profile') folder = 'profiles';
    else if (fieldname === 'product') folder = 'products';

    cb(null, path.join(__dirname, `../uploads/${folder}`));
  },
  filename: function (req, file, cb) {
    cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
  }
});

const upload = multer({ storage });
module.exports = upload;
