require('dotenv').config();
const nodemailer = require('nodemailer');
const logger = require('./utils/logger');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

const mailOptions = {
  from: process.env.EMAIL_USER,
  to: 'hecher.giner@gmail.com',
  subject: 'Test Email',
  text: 'Si recibes este correo, tu configuración de Nodemailer funciona correctamente.'
};

transporter.sendMail(mailOptions, (error, info) => {
  if (error) {
    return logger.error('Error al enviar correo:', error);
  }
  logger.info('Correo enviado:', info.response);
});
