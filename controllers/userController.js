const bcrypt = require('bcryptjs');
const passport = require('passport');
const UserDTO = require('../dto/userDTO');
const UserRepository = require('../repositories/userRepository');
const userRepository = new UserRepository();

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
