'use strict';

angular.module('newhomezapp.module')
	.factory('User', ['$resource', function($resource) {
		return $resource('users/:id', {
			id: '@id'
		}, {
			update: {
				method: 'PUT',
				url: 'users/:id'
			}
		});
	}]);