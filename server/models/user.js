
var mongoose = exports.mongoose = require('mongoose')
  , mongooseTypes = require('mongoose-types')
  , bcrypt = require('bcrypt')
  , Schema = mongoose.Schema
  , config = require('../config');

mongooseTypes.loadTypes(mongoose, "email");
var Email = Schema.Types.Email;

exports = module.exports = new Schema({

  name : { 
      first: { type: String, required: true },
      last: { type: String, required: true }
    },
  email: { type: Email, unique: true },
  salt: { type: String, required: true },
  hash: { type: String, required: true },
  admin : { type: Boolean }

});

exports.virtual('password')
  .set(function(password) {
    var salt = this.salt = bcrypt.genSaltSync(10);
    this.hash = bcrypt.hashSync(password, salt);
  })
;

exports.method('verifyPassword', function(password, callback) {
  bcrypt.compare(password, this.hash, callback);
});

exports.static('authenticate', function(email, password, callback) {
  this.findOne({ email: email }, function(err, user) {
      if (err) { return callback(err); }
      if (!user) { return callback(null, false); }
      user.verifyPassword(password, function(err, passwordCorrect) {
        if (err) { return callback(err); }
        if (!passwordCorrect) { return callback(null, false); }
        return callback(null, user);
      });
    });
});