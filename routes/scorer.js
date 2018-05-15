var express = require('express');
var router = express.Router();
var axios = require('axios');
var microservices = require('../config/microservices');

/* Passport */
var passport = require('passport');
var passportConf = require('../config/passport');

/* URL Patterns */
var interceptorURL = microservices.protocol + '://' + microservices.interceptorServer + ':' + microservices.interceptorPort;

/**
 * Internal Routes.
 */
var authentication = require('../routes/authentication');

/**
 * POST /
 * N-Interceptor method to ask N-Scorer to score based on the body.
 */
router.post('/analyze_emotion_set', passportConf.isAuthenticated, function(req, res, next) {
  var token = req.headers.authorization;
  var userID = authentication.checkToken(token)[1]['sub']
  var username = authentication.checkToken(token)[1]['username']
  var payload = req.body // Pass the body as a new payload for a new request
  // But, add to the payload information from the JWT token.
  payload['id'] = userID,
  payload['username'] = username,
  axios.post(interceptorURL + '/scorer/analyze_emotion_set/', payload)
  .then(function (response) {
    return res.send({
      "data": response.data
    })
  })
  .catch(function (error) {
    console.log(error);
    return res.send(error.data)
  });
});

/**
 * POST /
 * N-Interceptor method to ask N-Scorer to score based on the body.
 */
router.post('/analyze_role_set', passportConf.isAuthenticated, function(req, res, next) {
  var token = req.headers.authorization;
  var userID = authentication.checkToken(token)[1]['sub']
  var username = authentication.checkToken(token)[1]['username']
  var payload = req.body // Pass the body as a new payload for a new request
  // But, add to the payload information from the JWT token.
  payload['id'] = userID,
  payload['username'] = username,
  axios.post(interceptorURL + '/scorer/analyze_role_set/', payload)
  .then(function (response) {
    return res.send({
      "data": response.data
    })
  })
  .catch(function (error) {
    console.log(error);
    return res.send(error.data)
  });
});

/**
 * POST /
 * N-Interceptor method to ask N-Scorer to score based on the body.
 */
router.post('/analyze_percept_set', passportConf.isAuthenticated, function(req, res, next) {
  var token = req.headers.authorization;
  var userID = authentication.checkToken(token)[1]['sub']
  var username = authentication.checkToken(token)[1]['username']
  var payload = req.body // Pass the body as a new payload for a new request
  // But, add to the payload information from the JWT token.
  payload['id'] = userID,
  payload['username'] = username,
  axios.post(interceptorURL + '/scorer/analyze_percept_set/', payload)
  .then(function (response) {
    return res.send({
      "data": response.data
    })
  })
  .catch(function (error) {
    console.log(error);
    return res.send(error.data)
  });
});

/**
 * GET /
 * N-Interceptor method to retrieve all prior run analyses for a user based on the token.
 * Specifies params:
    collection (string)
    page (number)
    countPerPage (number)
 */
router.get('/analyses/:collection/:page/:countPerPage', passportConf.isAuthenticated, function(req, res, next) {
  var token = req.headers.authorization;
  var collection = req.params.collection,
      page = req.params.page,
      countPerPage = req.params.countPerPage;

  var config = {
    headers: {
      "Authorization": token // Set authorization header
    }
  }
  axios.get(
    interceptorURL + '/scorer/analyses/' + collection + '/' + page  + '/' + countPerPage,
    config)
  .then(function (response) {
    return res.send({
      "data": response.data
    })
  })
  .catch(function (error) {
    console.log(error);
    return res.send(error.data)
  });
});

/**
 * GET /
 * N-Interceptor method to retrieve single prior run analysis for a user based on the token.
    collection (string)
    id (string-ed hash)
 */
router.get('/analyses/:collection/:id', passportConf.isAuthenticated, function(req, res, next) {
  var token = req.headers.authorization;
  var collection = req.params.collection,
      id = req.params.id;

  var config = {
    headers: {
      "Authorization": token // Set authorization header
    }
  }
  axios.get(
    interceptorURL + '/scorer/analyses/' + collection + '/' + id,
    config)
  .then(function (response) {
    return res.send({
      "data": response.data
    })
  })
  .catch(function (error) {
    console.log(error);
    return res.send(error.data)
  });
})


/**
 *
 *** More flexible methods for the future that support more than affect analyses.
 *
 */


/**
 * GET /
 * N-Interceptor method to retrieve all prior run analyses for a user based on the token.
 * Specifies params:
    collection (string)
    page (number)
    countPerPage (number)
 */
router.get('/:database/analyses/:collection/:page/:countPerPage', passportConf.isAuthenticated, function(req, res, next) {
  var token = req.headers.authorization;
  var database = req.params.database,
      collection = req.params.collection,
      page = req.params.page,
      countPerPage = req.params.countPerPage;

  var config = {
    headers: {
      "Authorization": token // Set authorization header
    }
  }
  axios.get(
    interceptorURL + '/scorer/' + database + '/analyses/' + collection + '/' + page  + '/' + countPerPage,
    config)
  .then(function (response) {
    return res.send({
      "data": response.data
    })
  })
  .catch(function (error) {
    console.log(error);
    return res.send(error.data)
  });
});

/**
 * GET /
 * N-Interceptor method to retrieve single prior run analysis for a user based on the token.
    collection (string)
    id (string-ed hash)
 */
router.get('/:database/analyses/:collection/:id', passportConf.isAuthenticated, function(req, res, next) {
  var token = req.headers.authorization;
  var database = req.params.database,
      collection = req.params.collection,
      id = req.params.id;

  var config = {
    headers: {
      "Authorization": token // Set authorization header
    }
  }
  axios.get(
    interceptorURL + '/scorer/' + database + '/analyses/' + collection + '/' + id,
    config)
  .then(function (response) {
    return res.send({
      "data": response.data
    })
  })
  .catch(function (error) {
    console.log(error);
    return res.send(error.data)
  });
})


module.exports = router;
