'use strict';

angular.module('newhomezapp.module')
  .controller('signupController', ['$rootScope', '$scope', 'Auth', 'Utils',
  	function ($rootScope, $scope, Auth, Utils) {
      var init = function() {
        $scope.user = {
          firstName: '',
          lastName: '',
          email: '',
          password: '',
          company: '',
          phone: ''
        };
        $scope.password = '';
        $scope.completed = false;
      };

      $scope.onSignUp = function() {
        $rootScope.clearMessages();
        Utils.showWaiting('Registering...');
        Auth.signup($scope.user).$promise
          .then(function(user) {
            Utils.hideWaiting();
            $scope.completed = true;
          }, function(err) {
            $rootScope.onAPIError(err);
            Utils.hideWaiting();
          });
      };

      init();
  }]);