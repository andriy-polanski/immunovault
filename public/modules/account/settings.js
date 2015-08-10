'use strict';

angular.module('newhomezapp.module')
	.config(['$stateProvider', function($stateProvider) {
		$stateProvider
			.state('settings', {
				url: '/settings',
				templateUrl: 'modules/account/settings.html',
				controller: 'settingsController',
				resolve: {
				}
		});
	}])
	.controller('settingsController', ['$rootScope', '$scope', 'Auth', 'Utils', function($rootScope, $scope, Auth, Utils) {
		
		$rootScope.loadCurrentUser();

		$scope.user = $rootScope.currentUser;
		$scope.password = '';
		$scope.user.password = '';

		$rootScope.setBreadcrumbs([{url: 'settings', title: 'Settings'}]);

	  	$scope.onSave = function() {
	  		$rootScope.clearMessages();
	  		if($scope.user.name === '') {
	  			return $rootScope.setError('Please enter the full name.');
	  		}
	  		else if($scope.user.password !== $scope.password) {
	  			return $rootScope.setError('Confirm password does not match.');
	  		}
	  		else if($scope.user.password !== '' && $scope.user.password.length < 6) {
	  			return $rootScope.setError('Password should be at least 6 letters.');	
	  		}
	  		Utils.showWaiting('Saving...');
	  		Auth.update({
	  			name: $scope.user.name, 
	  			password: $scope.user.password
	  		}).$promise
	  			.then(function() {
	  				Utils.hideWaiting();
	  				$rootScope.setMessage('User info has been saved.');
					$rootScope.loadCurrentUser();
	  			}, function(err) {
	  				Utils.hideWaiting();
	  				console.log(err);
	  				$scope.error = err.message;
	  			});
	  	};
}]);