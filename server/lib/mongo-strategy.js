var util = require('util'),
    passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy,
    models = require('../models'),
    User = models.User,
    rest = require('request'),
    mongoose;

function MongoDBStrategy(mongoose) {
  this.mongoose = mongoose;

  // Call the super constructor - passing in our user verification function
  // We use the email field for the username
  LocalStrategy.call(this, { usernameField: 'email' }, this.verifyUser.bind(this));

  // Serialize the user into a string (id) for storing in the session
  passport.serializeUser(function(user, done) {
    done(null, user._id); // Remember that MongoDB has this weird { _id: { $oid: 1234567 } } structure
  });

  // Deserialize the user from a string (id) into a user (via a cll to the DB)
  passport.deserializeUser(this.get.bind(this));

  // We want this strategy to have a nice name for use by passport, e.g. app.post('/login', passport.authenticate('mongo'));
  this.name = MongoDBStrategy.name;
}

// MongoDBStrategy inherits from LocalStrategy
util.inherits(MongoDBStrategy, LocalStrategy);

MongoDBStrategy.name = "mongo";

// Query the users collection
MongoDBStrategy.prototype.query = function(query, done) {
  User.find(function(err, users) {
    done(err, users);
  });
};

// Get a user by id
MongoDBStrategy.prototype.get = function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
};

// Find a user by their email
MongoDBStrategy.prototype.findByEmail = function(email, done) {
  User.findOne({ email : email }, function(err, user) {
    done(err, user);
  });
};

// Check whether the user passed in is a valid one
MongoDBStrategy.prototype.verifyUser = function(email, password, done) {
  User.authenticate(email, password, done);
};

module.exports = MongoDBStrategy;