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
    default: '',
    unique: true
  },
	displayName: {
		type: String,
		trim: true
	},
  email: { type: String, lowercase: true },
  password: String,
  tokens: Array, // <-- This is for the future
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
	},
  /* For user preferences */
  affectiveData: {
    type: String,
    default: "0"
  },
  emailSub: {
    type: String,
    default: "0"
  },
  interfaceComplexity: {
    type: String,
    default: "0"
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
