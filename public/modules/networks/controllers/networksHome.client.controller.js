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
    '$q',
    '$http',
    function(
        $scope,
        Authentication,
        Menus,
        dataService,
        searchService,
        networkTemplate,
        $q,
        $http
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
            networks : [],
            fileTypes: []
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

        dataService.subscribe({
            cb: function (err, data) {
                $scope.pageData.loadingProgress = data.loadingProgress;
                $scope.pageData.networks = data.networks;
                $scope.pageData.numNetworks = data.numNetworks;
                $scope.pageData.numEntries = data.numEntries;
                $scope.pageData.loadingNetworks = data.isLoading;
                if (!data.isLoading) {
                    $scope.graphData.domains = data.domains;
                    $scope.graphData.properties = data.properties;
                    $scope.graphData.sizeDistSearch = data.sizeDist;
                    $scope.pageData.fileTypes = data.fileTypes;
                }
            },
            id:'networksHome'
        });

        searchService.getMenuOptions(function(err, data){
            $scope.searchData.attrArr = data.attrArr;
            $scope.searchData.sizeInfo = data.sizeInfo;
            $scope.graphData.sizeDistMenu = {
                data : [data.sizeInfo[0].attrs.data, data.sizeInfo[3].attrs.data],
                labels : data.sizeInfo[0].attrs.labels
            };
        });

        $scope.doSearch = function(){
            searchService.doSearch($scope.searchData);
        };

        //Hack for file type filtering
        $scope.filterFileTypes = function(){
            var oneSet = false;
            _.forEach($scope.pageData.networks, function(n){
                n.state = 'list';
                var enabledFileType = _.some($scope.pageData.fileTypes, {fileType: n.fileType, active:true});
                console.log(enabledFileType);
                if( !enabledFileType ){n.state = 'disabled'}
                oneSet = enabledFileType || oneSet;
            });

            if(!oneSet){
                _.forEach($scope.pageData.networks, function(n){
                    n.state = 'list';
                });
            }
        };

        $scope.addNewNetworkTemplate = function(){
            $scope.pageData.networks.unshift(networkTemplate);
        };

        $scope.save = function(updatedDoc){
            return $http.put('/networks/saveNetwork', updatedDoc._source);
        };

        $scope.delete = function(doomedDoc){
            return $http.put('/networks/deleteNetwork', {id: doomedDoc._id});
        };

        $scope.showSearchInfo = function(ev){
            searchService.searchInfoDia(ev);
        };

        $scope.resetFilter = function(){
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


