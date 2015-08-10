'use strict';

angular.module('newhomezapp.module')
	.factory('Listing', ['$resource', function($resource) {
		return $resource('listings/:id', {
			id: '@id'
		}, {
			update: {
				method: 'PUT',
				url: 'listings/:id'
			}
		});
	}]);