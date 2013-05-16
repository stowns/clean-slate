angular.module('resources.users', ['apiResource']);
angular.module('resources.users').factory('Users', ['apiResource', function (apiResource) {

  var userResource = apiResource('users');
  userResource.prototype.getFullName = function () {
    return this.lastName + " " + this.firstName + " (" + this.email + ")";
  };

  return userResource;
}]);
