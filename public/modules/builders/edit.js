'use strict';

angular.module('newhomezapp.module')
	.config(['$stateProvider', function($stateProvider) {
		$stateProvider
			.state('builders/edit', {
				url: '/builders/edit/:id',
				templateUrl: 'modules/builders/edit.html',
				controller: 'buildersEditController',
				resolve: {
					builder: ['$stateParams', '$q', 'Builder', function($stateParams, $q, Builder) {
						var deferred = $q.defer();

						Builder.get({id: $stateParams.id}).$promise.then(function(builder) {
							if(builder.paid == 1) builder.paid = true;
							else builder.paid = false;
							deferred.resolve(builder);
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
			.state('builders/add', {
				url: '/builders/add',
				templateUrl: 'modules/builders/edit.html',
				controller: 'buildersEditController',
				resolve: {
					builder: ['$stateParams', '$q', 'Builder', function($stateParams, $q, Builder) {
						var deferred = $q.defer();

						deferred.resolve(new Builder({
							id: null,
							builder: '',
							phone: '',
							fax: '',
							email: '',
							image: '',
							paid: false,
							photo: '',
							website: '',
							status: 'ACTIVE'
						}));

						return deferred.promise;
					}]
				}
		});
	}])
	.controller('buildersEditController', ['$rootScope', '$scope', 'Builder', 'Utils', 'builder',
		function($rootScope, $scope, Builder, Utils, builder) {
		
		$rootScope.loadCurrentUser();

		// $rootScope.checkPermission('ADMIN');

		$rootScope.setBreadcrumbs([{url: 'builders', title: 'Builders'}]);

		var init = function() {
			$scope.builder = builder;
			$scope.BUILDER_STATUSES = ['ACTIVE', 'INACTIVE'];			
		};

		$scope.onSave = function() {
			$rootScope.clearMessages();

			if($scope.builder.builder === '') {
				return $rootScope.setError('Please enter builder name.');
			}
			// else if($scope.builder.phone === '') {
			// 	return $rootScope.setError('Please enter phone no.');
			// }
			// else if(!Utils.validateEmail($scope.builder.email)) {
			// 	return $rootScope.setError('Please enter valid email address.');	
			// }

			Utils.showWaiting('Saving...');

			delete $scope.builder.Listings;
			delete $scope.builder.Users;

			var $promise = null;
			if($scope.builder.id) $promise = $scope.builder.$update();
			else $promise = $scope.builder.$save();
			
			$promise
				.then(function(builder) {
					$rootScope.setMessage('Builder info saved.');
					Utils.hideWaiting();
				}, function(err) {
					Utils.hideWaiting();
					$rootScope.onAPIError(err);
				});
		};

		$scope.onPhotoUploadFinished = function(url) {
			Utils.hideWaiting();
			$scope.builder.photo = url;
		};

		$scope.onPhotoBeforeUpload = function() {
			Utils.showWaiting('Uploading...');
		};

		$scope.onPhotoUploadFailed = function() {
			Utils.hideWaiting();
		};

		init();
}]);