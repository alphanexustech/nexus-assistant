var _ = require('lodash');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var User = require('../models/User');

/**
 * Internal Routes.
 */
var authentication = require('../routes/authentication');

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});

/**
 * Sign in using Email and Password.
 */
passport.use(new LocalStrategy(
  function(username, password, done) {
  User.findOne({ username: username }, function(err, user) {
    if (err) {
      return done(err);
    }
    if (!user) {
      return done(null, false, { message: 'Sorry, the username and password do not match.'});
    } else {
      user.comparePassword(password, function(err, isMatch) {
        if (isMatch) {
          return done(null, user);
        } else {
          return done(null, false, { message: 'Sorry, the username and password do not match.'});
        }
      });
    }
  });
}));

/**
 * Login Required middleware.
 */
exports.isAuthenticated = function(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  } else if (req.headers.authorization != null) {
    // Check for a JWT token, and make sure it is authorized
    var token = req.headers.authorization;
    if (authentication.checkToken(token)[0] == true) {
      return next();
    } else {
      return res.sendStatus(401);
    }
  } else {
    return res.sendStatus(401);
  }
};

/**
 * Authorization Required middleware.
 */
exports.isAuthorized = function(req, res, next) {
  var provider = req.path.split('/').slice(-1)[0];

  if (_.find(req.user.tokens, { kind: provider })) {
    next();
  } else {
    res.sendStatus(401);
  }
};
