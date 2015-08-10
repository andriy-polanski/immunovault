'use strict';

angular.module('newhomezapp.module')
	.controller('appController', ['$rootScope', '$state', 'Auth', function($rootScope, $state, Auth) {
		$rootScope.loadCurrentUser = function(redirect) {
			Auth.me().$promise
				.then(function(user) {
					$rootScope.currentUser = user;
				}, function(err) {
					if(redirect === true) {
						window.location='/login';
					}
				});
		};

		$rootScope.setBreadcrumbs = function(breadcrumbs) {
			$rootScope.breadcrumbs = breadcrumbs;
		};

		$rootScope.setError = function(error) {
			$rootScope.error = error;
		};

		$rootScope.setMessage = function(msg) {
			$rootScope.message = msg;
		};

		$rootScope.clearMessages = function() {
			$rootScope.setError('');
			$rootScope.setMessage('');
		};

		$rootScope.checkPermission = function(role) {
			if($rootScope.currentUser.role !== role) {
				$state.go('dashboard');
			}
		};

		$rootScope.onAPIError = function(err) {
			if(typeof err.data.message !== 'undefined') {
				$rootScope.setError(err.data.message);
			}
			else {
				$rootScope.setError('Unexpected server error occured. Please contact to administrator.');
			}
		};

		$rootScope.$on('$stateChangeSuccess', 
			function(event, toState, toParams, fromState, fromParams){
				$rootScope.onInitPage();
		});

		$rootScope.onInitPage = function() {
			$rootScope.clearMessages();
			$rootScope.globalSearchKeyword = '';
			$rootScope.onGlobalSearch = function() {
			};
		};

		var init = function() {
			$rootScope.breadcrumbs = [];

			$rootScope.onInitPage();

			$rootScope.loadCurrentUser();
		};

		init();
	}]);