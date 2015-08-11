'use strict';

angular.module('newhomezapp.module')
  .controller('forgetPasswordController', ['$rootScope', '$scope', 'Auth', 'Utils',
  	function ($rootScope, $scope, Auth, Utils) {
      var init = function() {
      	$scope.user = {
      		email: ''
      	};
      	$scope.completed = false;
      };

      $scope.onSend = function() {

        $rootScope.clearMessages();
        Utils.showWaiting('Sending...');
        Auth.forget($scope.user).$promise
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