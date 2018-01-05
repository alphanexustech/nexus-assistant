var bcrypt = require('bcryptjs');
var mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
  firstName: {
		type: String,
		trim: true,
		default: '',
	},
	lastName: {
		type: String,
		trim: true,
		default: '',
	},
  username: {
    type: String,
    trim: true,
    unique: true
  },
	displayName: {
		type: String,
		trim: true
	},
  email: { type: String, lowercase: true },
  password: String,
  tokens: Array,
  profile: {
    name: { type: String, default: '' },
  },
  updated: {
		type: Date
	},
	created: {
		type: Date,
		default: Date.now
	},
	/* For reset password */
	resetPasswordToken: {
		type: String
	},
	resetPasswordExpires: {
		type: Date
	}
});

/**
 * Password hash middleware.
 */
userSchema.pre('save', function(next) {
  var user = this;
  if (!user.isModified('password')) {
    return next();
  } else {
    bcrypt.genSalt(10, function(err, salt) {
      if (err) return next(err);
      bcrypt.hash(user.password, salt, function(err, hash) {
        if (err) {
          return next(err);
        } else {
          user.password = hash;
          return next();
        }
      });
    });
  }
});

/**
 * Helper method for validating user's password.
 */
userSchema.methods.comparePassword = function(candidatePassword, cb) {
  bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
    if (err) return cb(err);
    cb(null, isMatch);
  });
};

module.exports = mongoose.model('User', userSchema);