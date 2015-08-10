'use strict';

angular.module('newhomezapp.module')
	.factory('Builder', ['$resource', function($resource) {
		return $resource('builders/:id', {
			id: '@id'
		}, {
			update: {
				method: 'PUT',
				url: 'builders/:id'
			},
			assignUser: {
				method: 'POST',
				url: 'builders/assign/:id'
			},
			rejectUser: {
				method: 'POST',
				url: 'builders/reject/:id'
			}
		});
	}]);