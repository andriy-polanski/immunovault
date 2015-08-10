'use strict';

angular.module('newhomezapp.module')
	.config(['$stateProvider', function($stateProvider) {
		$stateProvider
			.state('users', {
				url: '/users',
				templateUrl: 'modules/users/users.html',
				controller: 'usersListController',
				resolve: {
				}
		});
	}])
	.controller('usersListController', ['$rootScope', '$scope', 'User', 'Utils', 'ngTableParams', '$filter', function($rootScope, $scope, User, Utils, ngTableParams, $filter) {
		
		$rootScope.loadCurrentUser();

		$rootScope.checkPermission('ADMIN');

		$rootScope.setBreadcrumbs([{url: 'users', title: 'Users'}]);

		$scope.users = [];

	  	$scope.loadUsers = function() {
	  		User.query(function(users) {
	  				$scope.users = users;
	  			});
	  	};

	  	var filterUsers = function(filters) {
	  		return $scope.users;
	  	};

	  	$scope.tableParams = new ngTableParams({
		    page: 1,            // show first page
		    count: 10,          // count per page
		    sorting: false
		}, {
			total: function() { return $scope.users.length; },
			getData: function($defer, params) {
				params.total($scope.users.length);

				if (!$scope.users || !$scope.users.length) return [];


				var data = filterUsers($scope.filters);


				var orderedData = params.sorting() ?
				                $filter('orderBy')(data, params.orderBy()) :
				                data;

				$defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
			},
			getFilteredData: function($defer, params, filterable) {
				if (!$scope.users || !$scope.users.length) return [];

				var data = filterUsers($scope.filters);

				data = params.doFilterableAction ( data, filterable );

				$defer.resolve(data);
			}
		});
		var updateTable = function() {
			$scope.tableParams.total($scope.users.length);
			$scope.tableParams.reload();
		};
  		$scope.$watch('users', updateTable);

  		$scope.onDeleteUser = function(user) {
  			if(!confirm('This process can not be rolled back. Are you sure you want to proceed?')) return;

  			Utils.showWaiting('Deleting user...');

  			user.$delete()
  				.then(function() {
  					Utils.hideWaiting();
  					$rootScope.setMessage('User has been deleted.');
  					$scope.loadUsers();
  				}, function(err) {
  					Utils.hideWaiting();
  					$rootScope.onAPIError(err);
  				});
  		};

	  	$scope.loadUsers();
}]);