'use strict';

// Setting up route
angular.module('core').config(['$stateProvider', '$urlRouterProvider',
	function($stateProvider, $urlRouterProvider) {
		// Redirect to home view when route not found
		$urlRouterProvider.otherwise('/');

		// Home state routing
		$stateProvider.
		state('home', {
			url: '/',
			templateUrl: 'modules/core/views/home.client.view.html'
		}).
		state('about',{
			url:'/about',
			templateUrl: 'modules/core/views/about.client.view.html'
		}).
		state('linkRot',{
			url:'/link_rot',
			templateUrl:'modules/core/views/link_rot.client.view.html'
		}).
		state('jsonEdit',{
			url:'/json_edit',
			templateUrl:'modules/core/views/jsonEdit.html'
		});
	}
]);
