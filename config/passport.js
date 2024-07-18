  const passport = require('passport');
  const LocalStrategy = require('passport-local').Strategy;
  const bcrypt = require('bcryptjs');
  const User = require('../models/user');
  const GitHubStrategy = require('passport-github').Strategy;
  const { githubClientID, githubClientSecret } = require('../config');
  
  passport.use(new GitHubStrategy({
    clientID: githubClientID,
    clientSecret: githubClientSecret,
    callbackURL: 'http://localhost:8080/users/github/callback'
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      const email = profile.emails && profile.emails.length > 0 ? profile.emails[0].value : `${profile.username}@github.com`;
  
      let user = await User.findOne({ githubId: profile.id });
      if (user) {
        return done(null, user);
      } else {
        user = new User({
          first_name: profile.name?.givenName || 'N/A',
          last_name: profile.name?.familyName || 'N/A',
          email: email,
          age: 0,
          password: '',
          cart: null,
          role: 'user',
          githubId: profile.id
        });
        await user.save();
        return done(null, user);
      }
    } catch (err) {
      return done(err);
    }
  }));
  
  passport.use(new LocalStrategy({ usernameField: 'email' }, async (email, password, done) => {
    try {
      const user = await User.findOne({ email });
      if (!user) {
        return done(null, false, { message: 'No user with that email' });
      }
  
      const isMatch = await bcrypt.compare(password, user.password);
      if (isMatch) {
        return done(null, user);
      } else {
        return done(null, false, { message: 'Password incorrect' });
      }
    } catch (err) {
      return done(err);
    }
  }));
  
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });
  
  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id).exec();
      done(null, user);
    } catch (err) {
      done(err, null);
    }
  });
  
  module.exports = passport;
  
