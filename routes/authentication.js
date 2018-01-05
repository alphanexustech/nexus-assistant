var express = require('express');
var router = express.Router();
var secrets = require('../config/secrets')
var jwt = require('jsonwebtoken');

/**
 *
 * This authentication.js file does not have logic to sign tokens!
 * This file is purposely internal to the application!
 *
 **/


/* GET JWT Token and verify it. */
exports.checkToken = function(token) {
  token = token.split('Bearer ')[1];
  try {
    var decoded = jwt.verify(token, secrets.sessionSecret);
  } catch(err) {
    console.log(err);
    return [false];
  }
  if (!decoded || decoded['iss'] != secrets.issuerSecret) {
    return [false];
  } else {
    return [true, decoded]
  }
};

/**
 *
 * This authentication.js file does not have logic to sign tokens!
 * This file is purposely internal to the application!
 *
 **/
