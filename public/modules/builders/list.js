'use strict';

angular.module('newhomezapp.module')
	.config(['$stateProvider', function($stateProvider) {
		$stateProvider
			.state('builders', {
				url: '/builders',
				templateUrl: 'modules/builders/list.html',
				controller: 'buildersListController',
				resolve: {
				}
		});
	}])
	.controller('buildersListController', ['$rootScope', '$scope', 'Builder', 'Utils', 'ngTableParams', '$filter', function($rootScope, $scope, Builder, Utils, ngTableParams, $filter) {
		
		$rootScope.loadCurrentUser();

		$rootScope.setBreadcrumbs([{url: 'builders', title: 'Builders'}]);

		$scope.builders = [];

	  	$scope.loadBuilders = function() {
	  		Builder.query(function(builders) {
	  				$scope.builders = builders;
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

				data = params.doFilterableAction ( data );


				var orderedData = params.sorting() ?
				                $filter('orderBy')(data, params.orderBy()) :
				                data;

				params.total(orderedData.length);

				$defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
			},
			getFilteredData: function($defer, params, filterable) {
				if (!$scope.builders || !$scope.builders.length) return [];

				var data = filterBuilders($scope.filters);

				data = params.doFilterableAction ( data, filterable );

				$defer.resolve(data);
			}
		});
		var updateTable = function() {
			$scope.tableParams.total($scope.builders.length);
			$scope.tableParams.reload();
		};
  		$scope.$watch('builders', updateTable);

  		$scope.onDeleteBuilder = function(builder) {
  			if(!confirm('This process can not be rolled back. Are you sure you want to proceed?')) return;

  			Utils.showWaiting('Deleting builder...');
  			builder.$delete()
  				.then(function() {
  					Utils.hideWaiting();
  					$rootScope.setMessage('Builder has been deleted.');
  					$scope.loadBuilders();
  				}, function(err) {
  					Utils.hideWaiting();
  					$rootScope.onAPIError(err);
  				});
  		};

	  	$scope.loadBuilders();
}]);