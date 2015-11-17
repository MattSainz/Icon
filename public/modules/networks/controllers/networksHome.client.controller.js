/**
 * Created by Matthias on 9/12/15.
 */

angular.module('networks').controller('NetworksController', ['$scope', 'Authentication', 'Menus','networkModel',
    '$window', '$timeout', 'socket',
    function($scope, Authentication, Menus, networkModel, $window, $timeout, socket ) {

        var _ = $window._;
        var initializing = true;


        $scope.authentication = Authentication;
        $scope.isCollapsed = false;
        $scope.menu = Menus.getMenu('topbar');
        $scope.loading = true;
        $scope.loadingNetworks = true;
        $scope.loadingProgress = 0;

        $scope.attrArr = [{attrCat:'Loading', attrs:[]}];
        $scope.searchField = "";
        $scope.networks = [];

        $scope.options = {
            datasetFill: true,
            scaleShowGridLines: false,
            pointDot: false,
            responsive: true
        };
        $scope.type = 'Line';

        var hits = 0.0;
        socket.on('dataSegment', function(data){
            hits += data.hits.hits.length;
            $scope.loadingProgress = (hits / data.hits.total)*100;
            $scope.networks = _.union($scope.networks, _.map(data.hits.hits, function(network){
                //Allows us to switch from card to list mode
                network['state'] = 'list';
                return network;
            }));
            socket.emit('scroll', data._scroll_id);
            if(hits === data.hits.total){
                console.log($scope.networks);
                $scope.loadingNetworks = false;
            }
        });

        networkModel.getAttrs().then(function(attrs){
            $scope.attrArr = attrs.checkbox;
            $scope.sizeInfo = attrs.size;
            $scope.labels= attrs.size[0].attrs.labels;
            $scope.data = [attrs.size[0].attrs.data,attrs.size[3].attrs.data]
        }).finally(function(){
            $scope.loading = false;
            $scope.$watch('sizeInfo', function(newVal, oldVal){
                if(initializing){
                    $timeout(function(){initializing = false})
                }else{
                    processSearch();
                }
            },true);

            $scope.$watch('attrArr', function(newVal, oldVal){
                if(initializing){
                    $timeout(function(){initializing = false})
                }else{
                    processSearch();
                }
            },true);

            processSearch();
            //Load Defaults
        });

        $scope.searchButton = function(){
            processSearch();
        };

        function processSearch(){
            hits = 0;
            $scope.loadingProgress = 0;
            $scope.loadingNetworks = true;
            $scope.networks = [];
            var toRet;

            var checkBoxOr = {
                "or":{
                    "filters":[]
                }
            };

            var queryObj = {};
            if($scope.searchField.length == 0){
                queryObj['match_all'] = {}
            }else{
                queryObj['query_string'] = {"query":$scope.searchField}
            }

            var elasticQuery = {
               "filtered":{"query": queryObj, "filter":{"and":[]}}
            };

            toRet = elasticQuery;

            var textOnlyQuery = {
               "filtered":{
                   "query":{"query_string":{"query":$scope.searchField}}
               }
            };

            _.each($scope.sizeInfo, function(e){
               if(e.attrs.state != ''){
                   var tmpOpj = {};
                   var tmpObj2 = {};
                   tmpObj2[e.attrs.comparison] = e.attrs.state;
                   tmpOpj[e.attrCat] = tmpObj2;
                   elasticQuery.filtered.filter.and.push({
                        "range": tmpOpj
                   });
               }
            });

            _.each($scope.attrArr, function(o){
                var tmpObj = {};
                var checkboxCategory = o.attrCat;
                _.each(o.attrs, function (c) {
                    if (c.state == true) {
                        tmpObj = {};
                        if(c.value.split(' ').length)
                        tmpObj[checkboxCategory] = c.value.toLowerCase().split(' ');
                        tmpObj['execution'] = 'and';
                        checkBoxOr.or.filters.push({
                            'terms': tmpObj
                        });
                    }
                });

            });

            if(checkBoxOr.or.filters.length > 0 ){
                elasticQuery.filtered.filter.and.push(checkBoxOr);
            }

            if(elasticQuery.filtered.filter.and.length == 0 && $scope.searchField.length == 0){
                //Nothing selected default to load everything
                toRet = {"match_all":{}};
            }else{
                if(elasticQuery.filtered.filter.and.length == 0){
                    //only search terms present
                    toRet = textOnlyQuery;
                }
            }//otherwise default is used

            socket.emit('doSearch', {query:toRet});
        }

        $scope.addNewNetworkTemplate = function(){
            $scope.networks.push({
                _id:'new',
                state:'edit',
                _source:{
                    citation:'Where you found this network(s)',
                    description:'Something about these networks ',
                    edgeType:'Edge Tybe',
                    fileType: null,
                    graphProperties: "i.e Directed",
                    graphs: [{
                       downloadLink:'http://',
                       edges:0,
                       nodes:0,
                       fileSize:'0',
                       fileType:'0',
                       name:'New Network'
                    }],
                    maxEdges: 0,
                    maxNodes: 0,
                    networkDomain: "New",
                    nodeType: "New",
                    sourceUrl: "URL to where more info is",
                    subDomain: "New",
                    title: "New"
                }
            });
        }
    }

]);


