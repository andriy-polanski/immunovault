'use strict';

angular.module('newhomezapp.module')
	.controller('signInController', ['$scope', 'Auth', 'Utils', function($scope, Auth, Utils) {
	  	$scope.email = '';
	  	$scope.password = '';
	  	$scope.remember = false;
	  	$scope.error = '';

	  	$scope.onLogin = function() {
	  		$scope.error = '';
	  		Utils.showWaiting('Signing in...');
	  		Auth.signin({email: $scope.email, password: $scope.password}).$promise
	  			.then(function() {
	  				Utils.hideWaiting();

	  				document.location = '/';
	  			}, function(err) {
	  				Utils.hideWaiting();
	  				$scope.error = 'Invalid email or password.';
	  			});
	  	};
}]);