'use strict';

angular.module('newhomezapp.module')
	.factory('Auth', ['$resource', function($resource) {
		return $resource('auth', {

		}, {
			signin: {
				method: 'POST',
				url: 'auth/signin'
			},
			signout: {
				method: 'GET',
				url: 'auth/signout'
			},
			me: {
				method: 'GET',
				url: 'auth/me'
			},
			update: {
				method: 'PUT',
				url: 'auth/me'
			},
			signup: {
				method: 'POST',
				url: '/auth/signup'
			},
			forget: {
				method: 'POST',
				url: '/auth/forgot'
			},
			reset: {
				method: 'POST',
				url: '/auth/reset'
			}
		});
	}]);