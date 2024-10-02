const bcrypt = require('bcryptjs');
const passport = require('passport');
const UserDTO = require('../../src/dto/userDTO');
const UserRepository = require('../../src/repositories/userRepository');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const PasswordResetToken = require('../models/passwordResetToken');
const logger = require('../../src/utils/logger');
const userRepository = new UserRepository();
const transporter = require('../../config/nodemailer');
const path = require('path');

exports.register = async (req, res) => {
  const { first_name, last_name, email, age, password, password2 } = req.body;
  let errors = [];

  if (password !== password2) {
    errors.push({ msg: 'Passwords do not match' });
  }

  if (errors.length > 0) {
    res.render('register', { errors, first_name, last_name, email, age, password, password2 });
  } else {
    const user = await userRepository.findUserByEmail(email);
    if (user) {
      errors.push({ msg: 'Email is already registered' });
      res.render('register', { errors, first_name, last_name, email, age, password, password2 });
    } else {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      const newUser = {
        first_name,
        last_name,
        email,
        age,
        password: hashedPassword
      };
      await userRepository.createUser(newUser);
      req.flash('success_msg', 'You are now registered and can log in');
      res.redirect('/users/login');
    }
  }
};

exports.login = (req, res, next) => {
  passport.authenticate('local', async (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.redirect('/users/login');
    }
    
    req.logIn(user, async (err) => {
      if (err) {
        return next(err);
      }
      // Actualizar la última conexión
      try {
        user.last_connection = new Date();
        await user.save();
      } catch (error) {
        console.error('Error al actualizar last_connection:', error);
      }
      return res.redirect('/realtimeproducts');
    });
  })(req, res, next);
};

exports.logout = (req, res) => {
  if (req.user) {
    req.user.last_connection = new Date();
    req.user.save()
      .then(() => {
        req.logout((err) => {
          if (err) {
            return next(err);
          }
          req.flash('success_msg', 'You are logged out');
          res.redirect('/users/login');
        });
      })
      .catch((error) => {
        console.error('Error al actualizar last_connection:', error);
        req.flash('error_msg', 'Error logging out');
        res.redirect('/users/login');
      });
  } else {
    req.flash('error_msg', 'No user is logged in');
    res.redirect('/users/login');
  }
};



exports.githubCallback = (req, res) => {
  res.redirect('/realtimeproducts');
};

exports.getCurrentUser = (req, res) => {
  if (req.isAuthenticated()) {
    const userDTO = new UserDTO(req.user);
    res.json({ user: userDTO });
  } else {
    res.status(401).json({ error: 'Not authenticated' });
  }
};

// Nueva función para solicitar el restablecimiento de contraseña
exports.requestPasswordReset = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await userRepository.findUserByEmail(email);
    if (!user) {
      req.flash('error_msg', 'No user found with that email address.');
      return res.redirect('/password-reset/request');
    }

    // Generar un token de restablecimiento
    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 3600000); // 1 hora

    // Guardar el token en la base de datos
    const resetToken = new PasswordResetToken({
      userId: user._id,
      token,
      expiresAt
    });
    await resetToken.save();

    // Enviar el correo electrónico con el enlace de restablecimiento
    const resetUrl = `http://${req.headers.host}/password-reset/reset/${token}`;
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: 'Password Reset',
      text: `Please click on the following link to reset your password: ${resetUrl}`
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return res.status(500).json({ error: 'Error sending email' });
      }
      req.flash('success_msg', 'Password reset email sent.');
      res.redirect('/password-reset/request');
    });

  } catch (error) {
    logger.error('Error requesting password reset:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Nueva función para restablecer la contraseña
exports.resetPassword = async (req, res) => {
  const { token, password } = req.body;

  try {
    const resetToken = await PasswordResetToken.findOne({ token });
    if (!resetToken) {
      return res.status(400).json({ error: 'Invalid or expired token' });
    }

    if (resetToken.expiresAt < Date.now()) {
      return res.status(400).json({ error: 'Token has expired' });
    }

    const user = await userRepository.findUserById(resetToken.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (await bcrypt.compare(password, user.password)) {
      return res.status(400).json({ error: 'Cannot use the same password' });
    }

    // Actualizar la contraseña del usuario
    user.password = await bcrypt.hash(password, 10);
    await user.save();

    // Eliminar el token después de su uso
    await PasswordResetToken.deleteOne({ _id: resetToken._id });

    res.status(200).json({ message: 'Password reset successfully' });

  } catch (error) {
    logger.error('Error resetting password:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Función para renderizar la página de restablecimiento de contraseña
exports.renderResetPassword = async (req, res) => {
  const { token } = req.params;

  try {
    const resetToken = await PasswordResetToken.findOne({ token });

    if (!resetToken || resetToken.expiresAt < Date.now()) {
      return res.status(400).json({ error: 'Token is invalid or has expired' });
    }

    res.render('resetPassword', { token });
  } catch (error) {
    logger.error('Error rendering reset password page:', error);
    res.status(500).json({ error: 'Server error' });
  }
};


// Cambiar el rol del usuario
exports.changeUserRole = async (req, res) => {
  const { uid } = req.params;
  const { role } = req.body;

  try {
    // Actualizar solo el campo "role" sin validar el resto del documento
    const user = await userRepository.updateUser(uid, { role });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.redirect('/users/admin'); // Redirigir a la vista de administración
  } catch (error) {
    logger.error('Error changing user role:', error);
    res.status(500).json({ error: 'Server error' });
  }
};



exports.uploadDocuments = async (req, res) => {
  try {
    const { uid } = req.params;
    const user = await userRepository.findUserById(uid);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'No files uploaded' });
    }

    // Añadir los documentos sin validar otros campos
    req.files.forEach(file => {
      user.documents.push({ name: file.originalname, reference: file.filename });
    });

    // Guardar el usuario sin validar otros campos
    await user.save({ validateBeforeSave: false });
    res.status(200).json({ message: 'Documents uploaded successfully', user });
  } catch (error) {
    logger.error('Error uploading documents:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Método para obtener todos los usuarios
exports.getAllUsers = async (req, res) => {
  try {
    const users = await userRepository.findAllUsers();
    const usersData = users.map(user => ({
      id: user._id,
      name: `${user.first_name} ${user.last_name}`.trim(),
      email: user.email,
      role: user.role,
    }));
    res.json(usersData);
  } catch (error) {
    logger.error('Error getting users:', error);
    res.status(500).json({ error: 'Server error' });
  }
};


exports.deleteInactiveUsers = async (req, res) => {
  try {
    // Obtener la fecha actual menos 2 días
    const cutoffDate = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000);
    
    // Buscar usuarios inactivos
    const inactiveUsers = await userRepository.findUsersByLastConnectionBefore(cutoffDate);

    if (inactiveUsers.length === 0) {
      return res.status(200).json({ message: 'No inactive users found for deletion.' });
    }

    // Enviar correos y eliminar los usuarios
    for (const user of inactiveUsers) {
      // Enviar correo al usuario
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: user.email,
        subject: 'Cuenta eliminada por inactividad',
        text: `Hola ${user.first_name}, tu cuenta ha sido eliminada debido a la inactividad de los últimos 2 días.`
      };

      try {
        await transporter.sendMail(mailOptions);
      } catch (emailError) {
        logger.error(`Error sending email to ${user.email}:`, emailError);
        continue; // Continuar con la eliminación incluso si hay error al enviar el correo
      }

      // Eliminar el usuario
      await userRepository.deleteUserById(user._id);
      logger.info(`User ${user.email} has been deleted due to inactivity.`);
    }

    res.status(200).json({ message: `${inactiveUsers.length} inactive users deleted and notified.` });
  } catch (error) {
    logger.error('Error deleting inactive users:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Función para renderizar la vista de administración
exports.renderAdminUsers = async (req, res) => {
  try {
    const users = await userRepository.findAllUsers();
    res.render('adminUsers', { users });
  } catch (error) {
    logger.error('Error loading admin page:', error);
    res.status(500).json({ error: 'Error loading admin page' });
  }
};

// Eliminar usuario
exports.deleteUser = async (req, res) => {
  const { uid } = req.params;

  try {
    const user = await userRepository.findUserById(uid);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    await userRepository.deleteUser(uid);

    // Responder con un código de estado 200 y un mensaje de éxito
    return res.status(200).json({ message: 'Usuario eliminado correctamente' });
  } catch (error) {
    logger.error('Error deleting user:', error);
    return res.status(500).json({ error: 'Server error' });
  }
};
