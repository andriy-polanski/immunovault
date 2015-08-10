'use strict';

angular.module('newhomezapp.module')
	.config(['$stateProvider', function($stateProvider) {
		$stateProvider
			.state('users/edit', {
				url: '/users/edit/:id',
				templateUrl: 'modules/users/edit.html',
				controller: 'usersEditController',
				resolve: {
					user: ['$stateParams', '$q', 'User', function($stateParams, $q, User) {
						var deferred = $q.defer();

						User.get({id: $stateParams.id}).$promise.then(function(user) {
							user.password = '';
							deferred.resolve(user);
						}, function(err) {
							deferred.resolve(null);
						});

						return deferred.promise;
					}]
				}
		});
	}])
	.config(['$stateProvider', function($stateProvider) {
		$stateProvider
			.state('users/add', {
				url: '/users/add',
				templateUrl: 'modules/users/edit.html',
				controller: 'usersEditController',
				resolve: {
					user: ['$stateParams', '$q', 'User', function($stateParams, $q, User) {
						var deferred = $q.defer();

						deferred.resolve(new User({
							id: null,
							email: '',
							password: '',
							name: '',
							status: 'ACTIVE',
							role: 'USER',
							Builders: []
						}));

						return deferred.promise;
					}]
				}
		});
	}])
	.controller('usersEditController', ['$rootScope', '$scope', '$filter', 'ngTableParams', 'User', 'Builder', 'Utils', 'user',
		function($rootScope, $scope, $filter, ngTableParams, User, Builder, Utils, user) {
		
		$rootScope.loadCurrentUser();

		$rootScope.checkPermission('ADMIN');

		$rootScope.setBreadcrumbs([{url: 'users', title: 'Users'}]);

		var init = function() {
			$scope.user = user;
			$scope.builders = [];
			$scope.USER_STATUSES = ['ACTIVE', 'INACTIVE'];
			$scope.USER_ROLES = ['USER', 'ADMIN'];

			Builder.query().$promise.then(function(builders) {
					_.each(builders, function(builder, index) {
						if( _.where(user.Builders, {id: builder.id}).length > 0) {
							builders[index].isAssigned = true;
						}
						else {
							builders[index].isAssigned = false;
						}

						$scope.$watch('builders[' + index + '].isAssigned', function(newVal, oldVal) {
							if((typeof oldVal === 'undefined') || (typeof newVal === 'undefined') || newVal === oldVal) return;

							$scope.onAssignBuilder(builders[index], builders[index].isAssigned);
						});
					});

					$scope.builders = builders;
					$scope.tableParams.reload();
				}, function(err) {
				});
			
		};

		var filterBuilders = function(filters) {
	  		return $scope.builders;
	  	};

	  	$scope.tableParams = new ngTableParams({
		    page: 1,            // show first page
		    count: 10,          // count per page
		    sorting: false
		}, {
			total: function() { return $scope.builders.length; },
			getData: function($defer, params) {
				params.total($scope.builders.length);
				if (!$scope.builders || !$scope.builders.length) return [];

				var data = filterBuilders($scope.filters);

				var orderedData = params.sorting() ?
				                $filter('orderBy')(data, params.orderBy()) :
				                data;

				$defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
			},
			getFilteredData: function($defer, params, filterable) {
				if (!$scope.builders || !$scope.builders.length) return [];

				var data = filterBuilders($scope.filters);

				data = params.doFilterableAction ( data, filterable );

				$defer.resolve(data);
			}
		});

		$scope.onSave = function() {
			$rootScope.clearMessages();

			if($scope.user.email === '') {
				return $rootScope.setError('Please enter email address.');
			}
			else if(!Utils.validateEmail($scope.user.email)) {
				return $rootScope.setError('Please enter valid email address.');	
			}
			else if($scope.user.name === '') {
				return $rootScope.setError('Please enter full name.');
			}
			else if( (!user.id || $scope.user.password !== '') && $scope.user.password.length < 6) {
				return $rootScope.setError('Password should be at least 6 letters.');	
			}

			Utils.showWaiting('Saving...');

			var $promise = null;
			if($scope.user.id) $promise = $scope.user.$update();
			else $promise = $scope.user.$save();
			
			$promise
				.then(function(user) {
					$rootScope.setMessage('User info saved.');
					Utils.hideWaiting();
				}, function(err) {
					Utils.hideWaiting();
					$rootScope.onAPIError(err);
				});
		};

		$scope.onAssignBuilder = function(builder, assigned) {
			var $promise = null;
			builder.userId = user.id;
			
			delete builder.Listings;
			delete builder.Users;

			if(assigned) $promise = builder.$assignUser();
			else $promise = builder.$rejectUser();

			$promise
				.then(function() {
					builder.isAssigned = assigned;
				});
		};

		init();
}]);