var config    = require('./config'),
    mongoose  = require('mongoose'),
    models    = require('./models')
    User      = models.User;

console.log('Configuration: \n', config);

// connect the database
mongoose.connect(config.mongodb);

var adminUser = new User({ email: 'admin@abc.com', admin: true, name: { first :'Admin', last: 'User' } });
adminUser.password = 'password'

console.log('Generating admin user...', adminUser);

User.findOne({ email : 'admin@abc.com'}, function(err, admin) {
  if (err) return console.log(err);
  if (admin) admin.remove();

  adminUser.save(function(err, adminUser) {
    if (err) return console.log(err);

    console.log('admin created');
    return console.log(adminUser);
  })
});