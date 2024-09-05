const bcrypt = require('bcryptjs');
const passport = require('passport');
const UserDTO = require('../dto/userDTO');
const UserRepository = require('../repositories/userRepository');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const PasswordResetToken = require('../models/passwordResetToken');
const logger = require('../utils/logger');
const userRepository = new UserRepository();
const transporter = require('../config/nodemailer');

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
  passport.authenticate('local', {
    successRedirect: '/realtimeproducts',
    failureRedirect: '/users/login',
    failureFlash: true
  })(req, res, next);
};

exports.logout = (req, res) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    req.flash('success_msg', 'You are logged out');
    res.redirect('/users/login');
  });
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

// Nueva función para cambiar el rol del usuario
exports.changeUserRole = async (req, res) => {
  const { uid } = req.params;

  try {
    const user = await userRepository.findUserById(uid);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Cambiar el rol del usuario de "user" a "premium" o viceversa
    user.role = user.role === 'user' ? 'premium' : 'user';
    await user.save();

    res.json({ message: `User role updated to ${user.role}` });
  } catch (error) {
    logger.error('Error changing user role:', error);
    res.status(500).json({ error: 'Server error' });
  }
};
