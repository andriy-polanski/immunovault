'use strict';

angular
  .module('newhomezapp', [
    'theme',
    'newhomezapp.module'
  ])
  .config(['$provide', '$routeProvider', function($provide, $routeProvider) {
    
    $routeProvider
      .otherwise({
        redirectTo: '/'
      });
  }])
  .directive('demoOptions', function () {
    return {
      restrict: 'C',
      link: function (scope, element, attr) {
        element.find('.demo-options-icon').click( function () {
          element.toggleClass('active');
        });
      }
    };
  });