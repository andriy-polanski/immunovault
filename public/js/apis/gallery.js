'use strict';

angular.module('newhomezapp.module')
	.factory('Gallery', ['$resource', function($resource) {
		return $resource('galleries/:id', {
			id: '@id'
		});
	}]);