'use strict';

var app = angular.module(
	ApplicationConfiguration.applicationModuleName,
	ApplicationConfiguration.applicationModuleVendorDependencies
);
//Start by defining the main module and adding the module dependencies


// Setting HTML5 Location Mode
app.config(['$locationProvider',
	function($locationProvider) {
		$locationProvider.hashPrefix('!');
	}
]);

//Load Colors
app.config(ApplicationConfiguration.angularMaterialColor);

//Allow the use of lodash in angular
app.factory('_', function($window){
	return( $window._ );
});

//Then define the init function for starting up the application
angular.element(document).ready(function() {
	//Fixing facebook bug with redirect
	if (window.location.hash === '#_=_') window.location.hash = '#!';

	//Then init the app
	angular.bootstrap(document, [ApplicationConfiguration.applicationModuleName]);
});
