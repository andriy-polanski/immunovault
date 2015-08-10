'use strict';

angular.module('newhomezapp.module')
	.config(['$stateProvider', function($stateProvider) {
		$stateProvider
			.state('listings', {
				url: '/listings/:builder',
				templateUrl: 'modules/listings/list.html',
				controller: 'listingsListController',
				resolve: {
					search: ['$stateParams', function($stateParams) {
						return {
							builder: typeof($stateParams.builder) !== 'undefined' ? $stateParams.builder : ''
						};
					}]
				}
		});
	}])
	.controller('listingsListController', ['$rootScope', '$scope', 'Listing', 'Utils', 'ngTableParams', '$filter', 'search', function($rootScope, $scope, Listing, Utils, ngTableParams, $filter, search) {
		
		$rootScope.loadCurrentUser();

		$rootScope.setBreadcrumbs([{url: 'listings({builder:""})', title: 'Listings'}]);

		$scope.listings = [];

	  	$scope.loadListings = function() {
	  		Utils.showWaiting('Loading...');
	  		Listing.query(function(listings) {
	  				Utils.hideWaiting();
	  				$scope.listings = _.filter(listings,
	  					function(listing) {
	  						if(search.builder !== '' && listing.builderID != search.builder) return false;

	  						return true;
	  					});
	  			});
	  	};


	  	$scope.tableParams = new ngTableParams({
		    page: 1,            // show first page
		    count: 10,          // count per page
		    sorting: false
		}, {
			total: function() { 
				if (!$scope.listings || !$scope.listings.length) return 0;

				var data = params.doFilterableAction ( $scope.listings );

				return data.length;
			},
			getData: function($defer, params) {
				params.total($scope.listings.length);

				if (!$scope.listings || !$scope.listings.length) return [];

				var data = params.doFilterableAction ( $scope.listings );

				var orderedData = params.sorting() ?
				                $filter('orderBy')(data, params.orderBy()) :
				                data;

				params.total(orderedData.length);

				$defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
			},
			getFilteredData: function($defer, params, filterable) {
				if (!$scope.listings || !$scope.listings.length) return [];

				var data = params.doFilterableAction ( $scope.listings, filterable );

				$defer.resolve(data);
			}
		});
		var updateTable = function() {
			$scope.tableParams.total($scope.listings.length);
			$scope.tableParams.reload();
		};
  		$scope.$watch('listings', updateTable);

  		$scope.onDeleteListing = function(listing) {
  			if(!confirm('This process can not be rolled back. Are you sure you want to proceed?')) return;

  			Utils.showWaiting('Deleting listing...');
  			listing.$delete()
  				.then(function() {
  					Utils.hideWaiting();
  					$rootScope.setMessage('Listing has been deleted.');
  					$scope.loadListings();
  				}, function(err) {
  					Utils.hideWaiting();
  					$rootScope.onAPIError(err);
  				});
  		};

	  	$scope.loadListings();
}]);