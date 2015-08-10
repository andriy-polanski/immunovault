'use strict';

angular.module('newhomezapp.module')
  .controller('verifyUserController', ['$rootScope', '$scope', 'Auth', 'Utils',
  	function ($rootScope, $scope, Auth, Utils) {
      var init = function() {
      	$scope.verificationStatus = status;
      	$scope.message = message;
      };
      init();
  }]);