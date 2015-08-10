'use strict';

angular.module('newhomezapp.module')
	.factory('Utils', [ '$filter', function($filter) {
		return {
			showWaiting: function(message) {
				var $elem = angular.element('.ui-waiting-spinner-container');
				if($elem.length > 0) return;

				$elem = angular.element('<div class="ui-waiting-spinner-container"><div class="overlay"></div><center><div class="spinner"><div class="spinner-container container1"><div class="circle1"></div><div class="circle2"></div><div class="circle3"></div><div class="circle4"></div></div><div class="spinner-container container2"><div class="circle1"></div><div class="circle2"></div><div class="circle3"></div><div class="circle4"></div></div><div class="spinner-container container3"><div class="circle1"></div><div class="circle2"></div><div class="circle3"></div><div class="circle4"></div></div></div></center></div>');
				
				angular.element('body').append($elem);
			},
			hideWaiting: function() {
				var $elem = angular.element('.ui-waiting-spinner-container');
				if($elem.length === 0) return;

				$elem.remove();
			},

			validateEmail: function (email) {
			    var re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
			    return re.test(email);
			}
		};
	}]);