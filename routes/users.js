var express = require('express');
var router = express.Router();
var axios = require('axios');
var User = require('../models/User');
var microservices = require('../config/microservices');

/* Passport */
var passport = require('passport');
var passportConf = require('../config/passport');

/* URL Patterns */
var checkerURL = 'http://' + microservices.checkerServer + ':' + microservices.checkerPort;

/**
 * Internal Routes.
 */
var authentication = require('../routes/authentication');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('Hello world, the users endpoint works!');
});

/**
 * POST /login
 * Sign in using email and password.
 */
router.post('/login', function(req, res, next) {
  req.assert('username', 'Please enter your username.').notEmpty();
  req.assert('password', 'Please enter your password.').notEmpty();

  var errors = req.validationErrors();

  if (errors) {
    return res.status(401).send({
      'status': 'Unauthorized',
      'errors': errors
    });
  }

  passport.authenticate('local', function(err, user, info) {
    if (err) return next(err);
    if (!user) {
      return res.status(401).send({
        'status': 'Unauthorized',
        'errors': info.message
      });
    }
    req.login(user, function(err) {
      if (err) {
        return next(err);
      } else {
        // Create a JWT token (via Checker) so users don't have to ask the assistant to check login.
        var payload = {
          "username": user.username,
          "sub": user.id,
          "scopes": ['everything'],
          "admin": false
        }
        axios.post(checkerURL + '/authentication/sign', payload)
        .then(function (response) {
          return res.send({
            "accessToken": response.data
          })
        })
        .catch(function (error) {
          console.log(error);
          return res.send(error.data)
        });
      }
    });
  })(req, res, next);
})

/**
 * GET /logout
 * Log out.
 */
router.get('/logout', function(req, res, next) {
  req.logout();
  res.redirect('/');
});

/**
 * POST /signup
 * Create a new local account.
 */
router.post('/signup', function(req, res, next) {
  req.assert('email', 'The E-mail is not valid').isEmail();
  req.assert('username', 'The username must be at least 3 characters long').len(3);
  req.assert('password', 'The password must be at least 4 characters long').len(4);
  req.assert('confirmPassword', 'The confirmation password must match the password').equals(req.body.password);

  var errors = req.validationErrors();

  if (errors) {
    return res.status(401).send({
      'status': 'Unauthorized',
      'errors': errors
    });
  }

  var user = new User({
    username: req.body.username,
    email: req.body.email,
    password: req.body.password
  });

  User.findOne({ username: req.body.username }, function(err, existingUser) {
    if (existingUser) {
      return res.status(401).send({
        'status': 'Unauthorized',
        'errors': 'Sorry, an account with that username exists.'
      });
    }
    user.save(function(err) {
      if (err) return next(err);
      req.login(user, function(err) {
        if (err) {
          return next(err);
        } else {
          // Create a JWT token (via Checker) so users don't have to ask the assistant to check login.
          var payload = {
            "username": user.username,
            "sub": user.id,
            "scopes": ['everything'],
            "admin": false
          }
          axios.post(checkerURL + '/authentication/sign', payload)
          .then(function (response) {
            return res.send({
              "accessToken": response.data
            })
          })
          .catch(function (error) {
            console.log(error);
            return res.send(error.data)
          });
        }
      });
    });
  });
});

/**
 * POST /account/delete
 * Delete user account.
 */
router.delete('/account/delete', passportConf.isAuthenticated, function(req, res, next) {
  var token = req.headers.authorization;
  var userID = authentication.checkToken(token)[1]['sub']
  User.findOne({ _id: userID  }, function(err, existingUser) {
    if (existingUser) {
      User.remove({ _id: userID }, function(err) {
        if (err) {
          return next(err);
        } else {
          req.logout();
          console.log('Your account has been deleted.');
          res.redirect('/');
        }
      });
    } else {
      return res.status(404).send({
        'status': 'Not Found'
      });
    }
  });
});

module.exports = router;
