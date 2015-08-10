'use strict';

angular.module('newhomezapp.module')
  .config(['$stateProvider', function($stateProvider) {
    $stateProvider
      .state('dashboard', {
          url: '/',
          templateUrl: 'modules/landing/dashboard.html',
          controller: 'dashboardcontroller',
          resolve: {
          }
      });

  }]);

angular.module('newhomezapp.module')
  .controller('dashboardcontroller', ['$rootScope', '$scope',
  	function ($rootScope, $scope) {
      $rootScope.loadCurrentUser();

      $rootScope.setBreadcrumbs([]);

  }]);