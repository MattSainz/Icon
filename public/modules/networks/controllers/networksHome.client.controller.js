/**
 * Created by Matthias on 9/12/15.
 */

'use strict';

angular.module('networks').controller('NetworksController', [
    '$scope',
    'Authentication',
    'Menus',
    'dataService',
    'searchService',
    'networkTemplate',
    function(
        $scope,
        Authentication,
        Menus,
        dataService,
        searchService,
        networkTemplate
    ) {

        $scope.authentication = Authentication;
        $scope.menu = Menus.getMenu('topbar');

        $scope.searchData = {
            attrArr : [{attrCat:'Loading', attrs:[]}],
            sizeInfo : [],
            searchField:''
        };

        $scope.pageData = {
            isCollapsed : false,
            loadingNetworks : true,
            loadingProgress : 0,
            showMore : false,
            networks : []
        };

        $scope.graphData = {
            domains: {},
            properties: {},
            sizeDistMenu: {},
            sizeDistSearch: {}
        };

        $scope.filterData = {
            selection : '',
            reverse: false
        };

        dataService.subscribe(function(err, data){
           $scope.pageData.loadingProgress = data.loadingProgress;
           $scope.pageData.networks = data.networks;
           $scope.pageData.numEntries = data.numNetworks;
           $scope.pageData.loadingNetworks = data.isLoading;
           if( ! data.isLoading ){
               $scope.graphData.domains = data.domains;
               $scope.graphData.properties = data.properties;
               $scope.graphData.sizeDistSearch = data.sizeDist;
               console.log($scope.pageData.networks);
           }
        });


        searchService.getMenuOptions(function(err, data){
            $scope.searchData.attrArr = data.attrArr;
            $scope.searchData.sizeInfo = data.sizeInfo;
            console.log(data);
            $scope.graphData.sizeDistMenu = {
                data : [data.sizeInfo[0].attrs.data, data.sizeInfo[3].attrs.data],
                labels : data.sizeInfo[0].attrs.labels
            };
        });

        $scope.doSearch = function(){
            searchService.doSearch($scope.searchData);
        };

        $scope.addNewNetworkTemplate = function(){
            $scope.pageData.networks.unshift(networkTemplate);
        };

        $scope.showSearchInfo = function(ev){
            searchService.searchInfoDia(ev);
        };

        $scope.resetFilter = function(){
            console.log("Resetting");
            $scope.searchData.searchField = '';
            _.forEach($scope.searchData.attrArr, function(attr){
                _.forEach(attr.attrs, function(a){
                    a.state = "";
                });
            });

            _.forEach($scope.searchData.sizeInfo, function(size){
                size.attrs.state = "";
            });

            searchService.doSearch($scope.searchData);
        };

    }

]);


