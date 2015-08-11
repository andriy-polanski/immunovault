'use strict';

angular.module('newhomezapp.module')
  .controller('resetPasswordController', ['$rootScope', '$scope', 'Auth', 'Utils',
  	function ($rootScope, $scope, Auth, Utils) {
		var init = function() {
			$scope.status = status;
			$scope.token = token;
			$scope.message = message;
			$scope.user = {
				password: '',
				token: token
			};
			$scope.password = '';
		};
		$scope.isFormValid= function() {
			if($scope.user.password == '') return false;
			if($scope.user.password != $scope.password) return false;

			return true;
		};
		$scope.onReset = function() {
			$rootScope.clearMessages();
			Utils.showWaiting('Reseting...');
			Auth.reset($scope.user).$promise
				.then(function(user) {
					Utils.hideWaiting();
					window.location = '/login';
				}, function(err) {
					$rootScope.onAPIError(err);
					Utils.hideWaiting();
				});
		};
		init();
  }]);