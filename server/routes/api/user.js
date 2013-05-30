var models = require('../../models'),
    User = models.User,
    LOG_TAG = 'User API: ',
    w = require('winston');

exports.list = function(req, res, next) {
  w.info(LOG_TAG + 'list');

  User.find(function(err, users) {
    if (err) return res.send(401);
    
    res.jsonData = users;
    next();
  })
}

exports.get = function(req, res, next) {
  w.info(LOG_TAG + 'get');

  User.findById(req.param('id'), function(err, user) {
    if (err) return res.send(401);
    
    res.jsonData = user;
    next();
  })
}