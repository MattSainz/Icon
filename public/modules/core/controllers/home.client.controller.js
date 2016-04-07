'use strict';

//TODO add authentication
angular.module('core').controller('HomeController', ['$scope', 'Authentication', 'TextContent', '$mdToast', 'dataService', 'searchService',
	function($scope, Authentication, TextContent, $mdToast, dataService, searchService) {
		// This provides Authentication context.

        $scope.data= {
            domains: {},
            properties: {},
            sizeDistMenu: {},
            sizeDistSearch: {},
            numEntries: 0,
            isLoading: true
        };

        dataService.subscribe({
            cb:function(err, data){
               $scope.data.isLoading = data.isLoading;
               if( ! data.isLoading ){
                   $scope.data.domains = data.domains;
                   $scope.data.properties = data.properties;
                   $scope.data.sizeDistSearch = data.sizeDist;
                   $scope.data.numEntries = data.numNetworks;
                   dataService.unsubscribe('home');
               }
            },
            id:'home'
        });
        searchService.doSearch();

		$scope.authentication = Authentication;

        var homePage = new TextContent($scope, 'home');

        $scope.save = homePage.save;
        $scope.update = homePage.update;
        $scope.delete = homePage.delete;
        $scope.cancel = homePage.cancel;
        $scope.getContentTemplate = homePage.getContentTemplate;

	}
]).directive('newContent', function(){
    return{
        scope:{
            entry: '=',
            cancelFunction: '&',
            saveFunction: '&',
            deleteFunction: '&',
            updateFunction: '&',
            index: '='
        },
        templateUrl: 'modules/core/partials/newContent.html'
    };
});
