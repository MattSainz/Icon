'use strict';

// Init the application configuration module for AngularJS application
var ApplicationConfiguration = (function() {
	// Init module configuration options
	var applicationModuleName = 'ICON';
	var applicationModuleVendorDependencies = [
        'ngResource',
        'ngCookies',
        'ngAnimate',
        'ngTouch',
        'ngSanitize',
		'ngMaterial',
		'ngAria',
        'ui.router',
		'chart.js',
		'btford.socket-io'
    ];

	// Add a new vertical module
	var registerModule = function(moduleName, dependencies) {
		// Create angular module
		angular.module(moduleName, dependencies || []);

		// Add the module to the AngularJS configuration file
		angular.module(applicationModuleName).requires.push(moduleName);
	};

	var angularMaterialColor = function ($mdThemingProvider) {
		var customPrimary = {
			'50': '#6b6b6b',
			'100': '#5e5e5e',
			'200': '#515151',
			'300': '#444444',
			'400': '#383838',
			'500': '#2B2B2B',
			'600': '#1e1e1e',
			'700': '#111111',
			'800': '#050505',
			'900': '#000000',
			'A100': '#777777',
			'A200': '#848484',
			'A400': '#919191',
			'A700': '#000000'
		};
		$mdThemingProvider
			.definePalette('customPrimary',
			customPrimary);

		var customAccent = {
			'50': '#ffde79',
			'100': '#ffd860',
			'200': '#ffd246',
			'300': '#ffcc2d',
			'400': '#ffc513',
			'500': '#f9bc00',
			'600': '#dfa900',
			'700': '#c69500',
			'800': '#ac8200',
			'900': '#936f00',
			'A100': '#ffe593',
			'A200': '#ffebac',
			'A400': '#fff1c6',
			'A700': '#795c00'
		};
		$mdThemingProvider
			.definePalette('customAccent',
			customAccent);

		var customWarn = {
			'50': '#ffde79',
			'100': '#ffd860',
			'200': '#ffd246',
			'300': '#ffcc2d',
			'400': '#ffc513',
			'500': '#f9bc00',
			'600': '#dfa900',
			'700': '#c69500',
			'800': '#ac8200',
			'900': '#936f00',
			'A100': '#ffe593',
			'A200': '#ffebac',
			'A400': '#fff1c6',
			'A700': '#795c00'
		};
		$mdThemingProvider
			.definePalette('customWarn',
			customWarn);

		var customBackground = {
			'50': '#ffffff',
			'100': '#ffffff',
			'200': '#ffffff',
			'300': '#ffffff',
			'400': '#ffffff',
			'500': '#F6F6F6',
			'600': '#e9e9e9',
			'700': '#dcdcdc',
			'800': '#d0d0d0',
			'900': '#c3c3c3',
			'A100': '#ffffff',
			'A200': '#ffffff',
			'A400': '#ffffff',
			'A700': '#b6b6b6'
		};
		$mdThemingProvider
			.definePalette('customBackground',
			customBackground);

		$mdThemingProvider.theme('default')
			.primaryPalette('customPrimary')
			.accentPalette('customAccent')
			.warnPalette('customWarn')
			.backgroundPalette('customBackground')
	};

	return {
		applicationModuleName: applicationModuleName,
		applicationModuleVendorDependencies: applicationModuleVendorDependencies,
		registerModule: registerModule,
		angularMaterialColor: angularMaterialColor
	};
})();
