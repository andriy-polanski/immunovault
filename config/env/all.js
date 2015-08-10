'use strict';
var path = require('path'),
	rootPath = path.normalize(__dirname + '/../..');

module.exports = {
	app: {
		title: 'MEAN.JS',
		description: 'Full-Stack JavaScript with MongoDB, Express, AngularJS, and Node.js',
		keywords: 'mongodb, express, angularjs, node.js, mongoose, passport'
	},
	rootPath: rootPath,
	publicPath: rootPath + '/public',
	modelsDir : rootPath + '/app/models',
	uploadDir: rootPath + '/public/upload',
	templateEngine: 'swig',
	// The secret should be set to a non-guessable string that
	// is used to compute a session hash
	sessionSecret: 'MEAN',
	// The name of the MongoDB collection to store sessions in
	sessionCollection: 'sessions',
	// The session cookie settings
	sessionCookie: {
		path: '/',
		httpOnly: true,
		// If secure is set to true then it will cause the cookie to be set
		// only when SSL-enabled (HTTPS) is used, and otherwise it won't
		// set a cookie. 'true' is recommended yet it requires the above
		// mentioned pre-requisite.
		secure: false,
		// Only set the maxAge to null if the cookie shouldn't be expired
		// at all. The cookie will expunge when the browser is closed.
		maxAge: null,
		// To set the cookie in a specific domain uncomment the following
		// setting:
		// domain: 'yourdomain.com'
	},
	// The session cookie name
	sessionName: 'connect.sid',
	log: {
		// Can specify one of 'combined', 'common', 'dev', 'short', 'tiny'
		format: 'combined',
		// Stream defaults to process.stdout
		// Uncomment to enable logging to a log on the file system
		options: {
			stream: 'access.log'
		}
	},
	assets: {
		lib: {
			css: [
				'public/lib/font-awesome/css/font-awesome.css',
				'public/lib/seiyria-bootstrap-slider/dist/css/bootstrap-slider.min.css',
				'public/lib/angular-ui-tree/dist/angular-ui-tree.min.css',
				'public/lib/bower-jvectormap/jquery-jvectormap-1.2.2.css',
				'public/lib/ng-grid/ng-grid.css',
				'public/lib/angular-xeditable/dist/css/xeditable.css',
				'public/lib/pnotify/pnotify.core.css',
				'public/lib/pnotify/pnotify.buttons.css',
				'public/lib/pnotify/pnotify.history.css',
				'public/lib/nanoscroller/bin/css/nanoscroller.css',
				'public/lib/textAngular/src/textAngular.css',
				'public/lib/angular-ui-grid/ui-grid.css',
				'public/lib/switchery/dist/switchery.css',
				'public/lib/fullcalendar/dist/fullcalendar.css',
				'public/lib/angular-ui-select/dist/select.css',
				'public/lib/animate.css/animate.css',
				'public/lib/bootstrap-daterangepicker/daterangepicker-bs3.css',
				'public/lib/nvd3/src/nv.d3.css',
				'public/lib/skylo/vendor/styles/skylo.css',
				'public/lib/themify-icons/themify-icons.css',
				'public/lib/angular-rangeslider/angular.rangeSlider.css',
				'public/assets/plugins/form-fseditor/fseditor.css',
				'public/assets/plugins/jcrop/css/jquery.Jcrop.min.css',
				'public/assets/plugins/iCheck/skins/all.css',
				'public/assets/plugins/google-code-prettify/prettify.css'
			],
			js: [
				'public/lib/modernizr/modernizr.js',
				'public/lib/jquery/dist/jquery.js',
				'public/lib/underscore/underscore.js',
				'public/lib/angular/angular.js',
				'public/lib/angular-resource/angular-resource.js',
				'public/lib/angular-cookies/angular-cookies.js',
				'public/lib/angular-sanitize/angular-sanitize.js',
				'public/lib/angular-route/angular-route.js',
				'public/lib/angular-animate/angular-animate.js',
				'public/lib/bootstrap/dist/js/bootstrap.js',
				'public/lib/seiyria-bootstrap-slider/js/bootstrap-slider.js',
				'public/lib/angular-bootstrap/ui-bootstrap-tpls.js',
				'public/lib/jquery.ui/ui/jquery.ui.core.js',
				'public/lib/jquery.ui/ui/jquery.ui.widget.js',
				'public/lib/jquery.ui/ui/jquery.ui.mouse.js',
				'public/lib/jquery.ui/ui/jquery.ui.draggable.js',
				'public/lib/jquery.ui/ui/jquery.ui.sortable.js',
				'public/lib/jquery.ui/ui/jquery.ui.resizable.js',
				'public/lib/jquery.easing/js/jquery.easing.js',
				'public/lib/flot/jquery.flot.js',
				'public/lib/flot/jquery.flot.stack.js',
				'public/lib/flot/jquery.flot.pie.js',
				'public/lib/flot/jquery.flot.resize.js',
				'public/lib/flot.tooltip/js/jquery.flot.tooltip.js',
				'public/lib/angular-ui-tree/dist/angular-ui-tree.js',
				'public/lib/moment/moment.js',
				'public/lib/bower-jvectormap/jquery-jvectormap-1.2.2.min.js',
				'public/lib/bower-jvectormap/jquery-jvectormap-world-mill-en.js',
				'public/lib/ng-grid/build/ng-grid.js',
				'public/lib/angular-xeditable/dist/js/xeditable.js',
				'public/lib/iCheck/icheck.min.js',
				'public/lib/google-code-prettify/src/prettify.js',
				'public/lib/bootbox.js/bootbox.js',
				'public/lib/jquery-autosize/jquery.autosize.js',
				'public/lib/gmaps/gmaps.js',
				'public/lib/jquery.pulsate/jquery.pulsate.js',
				'public/lib/jquery.knob/js/jquery.knob.js',
				'public/lib/jquery.sparkline/index.js',
				'public/lib/flow.js/dist/flow.js',
				'public/lib/ng-flow/dist/ng-flow.js',
				'public/lib/enquire/dist/enquire.js',
				'public/lib/shufflejs/dist/jquery.shuffle.js',
				'public/lib/pnotify/pnotify.core.js',
				'public/lib/pnotify/pnotify.buttons.js',
				'public/lib/pnotify/pnotify.callbacks.js',
				'public/lib/pnotify/pnotify.confirm.js',
				'public/lib/pnotify/pnotify.desktop.js',
				'public/lib/pnotify/pnotify.history.js',
				'public/lib/pnotify/pnotify.nonblock.js',
				'public/lib/nanoscroller/bin/javascripts/jquery.nanoscroller.js',
				'public/lib/angular-nanoscroller/scrollable.js',
				'public/lib/rangy/rangy-core.min.js',
				'public/lib/rangy/rangy-cssclassapplier.min.js',
				'public/lib/rangy/rangy-selectionsaverestore.min.js',
				'public/lib/rangy/rangy-serializer.min.js',
				'public/lib/textAngular/src/textAngular.js',
				'public/lib/textAngular/src/textAngular-sanitize.js',
				'public/lib/textAngular/src/textAngularSetup.js',
				'public/lib/rangy/rangy-selectionsaverestore.js',
				'public/lib/angular-ui-grid/ui-grid.js',
				'public/lib/transitionize/dist/transitionize.js',
				'public/lib/fastclick/lib/fastclick.js',
				'public/lib/switchery/dist/switchery.js',
				'public/lib/ng-switchery/src/ng-switchery.js',
				'public/lib/angular-ui-select/dist/select.js',
				'public/lib/skycons/skycons.js',
				'public/lib/angular-skycons/angular-skycons.js',
				'public/lib/bootstrap-daterangepicker/daterangepicker.js',
				'public/lib/d3/d3.js',
				'public/lib/nvd3/nv.d3.js',
				'public/lib/angularjs-nvd3-directives/dist/angularjs-nvd3-directives.js',
				'public/lib/oclazyload/dist/ocLazyLoad.min.js',
				'public/lib/skylo/vendor/scripts/skylo.js',
				'public/lib/bootstrap-datepicker/js/bootstrap-datepicker.js',
				'public/lib/jquery.easy-pie-chart/dist/angular.easypiechart.js',
				'public/lib/card/lib/js/jquery.card.js',
				'public/lib/velocity/velocity.js',
				'public/lib/velocity/velocity.ui.js',
				'public/lib/angular-ui-router/release/angular-ui-router.min.js',
				'public/lib/lodash/dist/lodash.min.js',
				'public/lib/angular-lodash/angular-lodash.js',
				'public/lib/checklist-model/checklist-model.js',
				'public/lib/ng-file-upload/ng-file-upload.min.js',
				'public/lib/ng-file-upload/ng-file-upload-shim.min.js',
				'public/lib/angular-rangeslider/angular.rangeSlider.js',
				'public/lib/ng-table-export/ng-table-export.js',
				'public/assets/plugins/form-colorpicker/js/bootstrap-colorpicker.min.js',
				'public/assets/plugins/form-fseditor/jquery.fseditor-min.js',
				'public/assets/plugins/form-jasnyupload/fileinput.min.js',
				'public/assets/plugins/flot/jquery.flot.spline.js',
				'public/assets/plugins/flot/jquery.flot.orderBars.js',
				'public/assets/plugins/wijets/wijets.js',
				'public/assets/plugins/bootstrap-tabdrop/js/bootstrap-tabdrop.js'
			]
		},
		css: [
			'public/assets/css/styles.css',
			'public/assets/css/style-blessed3.css',
			'public/assets/css/style-blessed2.css',
			'public/assets/css/style-blessed1.css',
			'public/assets/css/main.css',
			'public/js/*.css',
			'public/js/*/*.css',
			'public/js/*/*/*.css',
		],
		js: [
			'public/*.js',
			'public/core/*.js',
			'public/core/*/*.js',
			'public/js/*.js',
			'public/js/*/*.js',
			'public/js/*/*/*.js',
			'public/modules/*.js',
			'public/modules/*/*.js',
			'public/modules/*/*[!tests]*/*.js'
		],
		tests: [
		]
	}
};
