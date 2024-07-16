// const express = require('express');
// const router = express.Router();
// const bcrypt = require('bcryptjs');
// const User = require('../models/user');

// // Register
// router.post('/register', async (req, res) => {
//   const { email, password, password2 } = req.body;
//   let errors = [];

//   if (password !== password2) {
//     errors.push({ msg: 'Passwords do not match' });
//   }

//   if (errors.length > 0) {
//     res.render('register', { errors, email, password, password2 });
//   } else {
//     const user = await User.findOne({ email });
//     if (user) {
//       errors.push({ msg: 'Email is already registered' });
//       res.render('register', { errors, email, password, password2 });
//     } else {
//       const newUser = new User({ email, password });
//       const salt = await bcrypt.genSalt(10);
//       newUser.password = await bcrypt.hash(password, salt);
//       await newUser.save();
//       req.flash('success_msg', 'You are now registered and can log in');
//       res.redirect('/users/login');
//     }
//   }
// });

// module.exports = router;

const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.post('/register', userController.register);

module.exports = router;

