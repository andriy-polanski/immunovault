'use strict';

angular.module('newhomezapp.module')
	.config(['$stateProvider', function($stateProvider) {
		$stateProvider
			.state('listings/edit', {
				url: '/listings/edit/:id',
				templateUrl: 'modules/listings/edit.html',
				controller: 'listingsEditController',
				resolve: {
					listing: ['$stateParams', '$q', 'Listing', function($stateParams, $q, Listing) {
						var deferred = $q.defer();

						Listing.get({id: $stateParams.id}).$promise.then(function(listing) {
							deferred.resolve(listing);
						}, function(err) {
							deferred.resolve(null);
						});

						return deferred.promise;
					}],
					builders: ['$q', 'Builder', function($q, Builder) {
						var deferred = $q.defer();

						Builder.query(function(builders) {
			  				deferred.resolve(builders);
			  			}, function(err) {
			  				deferred.resolve([]);
			  			});

			  			return deferred.promise;
					}]
				}
		});
	}])
	.config(['$stateProvider', function($stateProvider) {
		$stateProvider
			.state('listings/add', {
				url: '/listings/add',
				templateUrl: 'modules/listings/edit.html',
				controller: 'listingsEditController',
				resolve: {
					listing: ['$stateParams', '$q', 'Listing', function($stateParams, $q, Listing) {
						var deferred = $q.defer();

						deferred.resolve(new Listing({
							id: null,
							listingID: 0, 
							listing: '',
							propType: '',
							community: '',
							city: '',
							county: 0,
							state: '',
							zip: 0,
							description: '',
							email: '',
							phone: '',
							priceTxt: '',
							priceLow: 0,
							priceHigh: 0,
							sqftLow: 0,
							sqftHigh: 0,
							bedLow: 0,
							bedHigh: 0,
							bathLow: 0,
							bathHigh: 0,
							hoa: 0,
							tax: 0,
							payment: 0,
							lat: 0,
							lng: 0,
							photo: '',
							photo2: '',
							active: 0,
							website: '',
							masterplanId: 0,
							status: 'ACTIVE'
						}));

						return deferred.promise;
					}],
					builders: ['$q', 'Builder', function($q, Builder) {
						var deferred = $q.defer();

						Builder.query(function(builders) {
			  				deferred.resolve(builders);
			  			}, function(err) {
			  				deferred.resolve([]);
			  			});

			  			return deferred.promise;
					}]
				}
		});
	}])
	.controller('listingsEditController', ['$rootScope', '$scope', '$q', 'Listing', 'Gallery', 'Utils', 'listing', 'builders',
		function($rootScope, $scope, $q, Listing, Gallery, Utils, listing, builders) {
		
		$rootScope.loadCurrentUser();

		$rootScope.setBreadcrumbs([{url: 'listings', title: 'Listings'}]);

		var init = function() {
			$scope.listing = listing;
			$scope.builders = builders;
			$scope.LISTING_STATUSES = ['ACTIVE', 'INACTIVE'];			
		};

		$scope.onSave = function() {
			$rootScope.clearMessages();

			if($scope.listing.listing === '') {
				return $rootScope.setError('Please enter listing name.');
			}
			// else if($scope.listing.phone === '') {
			// 	return $rootScope.setError('Please enter phone no.');
			// }
			// else if(!Utils.validateEmail($scope.listing.email)) {
			// 	return $rootScope.setError('Please enter valid email address.');	
			// }

			Utils.showWaiting('Saving...');

			delete $scope.listing.Listings;
			delete $scope.listing.Users;

			var $promise = null;
			if($scope.listing.id) $promise = $scope.listing.$update();
			else $promise = $scope.listing.$save();
			
			$promise
				.then(function(listing) {
					$rootScope.setMessage('Listing info saved.');
					Utils.hideWaiting();
				}, function(err) {
					Utils.hideWaiting();
					$rootScope.onAPIError(err);
				});
		};

		$scope.onPhotoUploadFinished = function(url) {
			Utils.hideWaiting();
			$scope.listing.photo = url;
		};

		$scope.onPhotoBeforeUpload = function() {
			Utils.showWaiting('Uploading...');
		};

		$scope.onPhotoUploadFailed = function() {
			Utils.hideWaiting();
		};

		$scope.onRemovePhotoCallback = function() {
			$scope.$apply(function() {
				$scope.listing.photo = '';
			});			
		};

		$scope.onPhoto2UploadFinished = function(url) {
			Utils.hideWaiting();
			$scope.listing.photo2 = url;
		};

		$scope.onPhoto2BeforeUpload = function() {
			Utils.showWaiting('Uploading...');
		};

		$scope.onPhoto2UploadFailed = function() {
			Utils.hideWaiting();
		};

		$scope.onRemovePhoto2Callback = function() {
			$scope.$apply(function() {
				$scope.listing.photo2 = '';
			});
		};

		$scope.onGalleryBeforeUpload= function() {
			Utils.showWaiting('Uploading...');
		};
		$scope.onGalleryUploadFinished= function(urls) {
			var $promises = [];

			var uploadGallery = function(url) {
				var deferred = $q.defer();

				var gallery = new Gallery({
					cID: $scope.listing.id,
					caption: '',
					photo: url
				});
				gallery.$save()
					.then(function() {
						$scope.listing.Galleries.push(gallery);
						deferred.resolve(gallery);
					}, function(err) {
						$rootScope.onAPIError(err);
						deferred.resolve(null);
					});

				return deferred.promise;
			};

			_.each(urls, function(url) {
				$promises.push(uploadGallery(url));
			});

			$q.all($promises)
				.then(function() {
					Utils.hideWaiting();
				}, function(err) {
					Utils.hideWaiting();
				});
		};
		$scope.onGalleryUploadFailed= function() {
			Utils.hideWaiting();
		};
		$scope.removeGallery = function($index) {
			Utils.showWaiting('Removing...');
			Gallery.get({id: $scope.listing.Galleries[$index].id}).$promise
				.then(function(gallery) {
					gallery.$delete()
						.then(function() {
							Listing.get({id: $scope.listing.id}).$promise.then(function(listing) {
								$scope.listing = listing;
								Utils.hideWaiting();
							}, function(err) {
								Utils.hideWaiting();
								$rootScope.onAPIError(err);
							});
						}, function(err) {
							Utils.hideWaiting();
							$rootScope.onAPIError(err);
						});
				}, function(err) {
					Utils.hideWaiting();
					$rootScope.onAPIError(err);
				});
		};

		init();
}]);