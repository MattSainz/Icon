/**
 *
 * Created by Matthias on 1/13/16.
 */

angular.module('networks').service('searchService',[
    'dataService',
    'networkModel',
    'socket',
    '$mdDialog',
    function(dataService, networkModel, socket, $mdDialog){

        var data = {
            attrArr : [],
            sizeInfo: [],
            searchField : ''
        };

        this.getMenuOptions = function(cb){
            networkModel.getAttrs().then(function(attrs){
                data.attrArr = attrs.checkbox;
                data.sizeInfo = attrs.size;
                defaultSearch = data;
            }).finally(function(){
                cb(null, data);
                doSearch(data);
            });
        };

        /*
            Formats checkbox selections into elasticsearch query
         */
        function doSearch(updatedData){
            dataService.reset();
            if( !updatedData ){
                socket.emit('doSearch', {query:{'match_all':{}}});
                return;
            }
            var toRet;

            var checkBoxOr = {
                'or':{
                    'filters':[]
                }
            };

            var queryObj = {};
            if(updatedData.searchField.length === 0){
                queryObj.match_all = {}
            }else{
                queryObj.query_string = {"query": updatedData.searchField}
            }

            var elasticQuery = {
               'filtered':{'query': queryObj, 'filter':{'and':[]}}
            };

            toRet = elasticQuery;

            var textOnlyQuery = {
               'filtered':{
                   'query':{'query_string':{'query': updatedData.searchField}}
               }
            };

            _.each(updatedData.sizeInfo, function(e){
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

            _.each(updatedData.attrArr, function(o){
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

            if(elasticQuery.filtered.filter.and.length == 0 && updatedData.searchField.length == 0){
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

        this.doSearch = doSearch;

        this.searchInfoDia = function(ev){
             $mdDialog.show(
             $mdDialog.alert()
                 .parent(angular.element(document.querySelector('#browseCard')))
                 .clickOutsideToClose(true)
                 .title('Search Info')
                 .content(
                     'See <a href="https://www.elastic.co/guide/en/elasticsearch/reference/current/' +
                     'query-dsl-query-string-query.html#query-string-syntax">Elasticsearch Query String</a>' +
                     ' for search operations provided'
                 )
                 .ariaLabel('Search Info')
                 .ok('Got it!')
                 .targetEvent(ev)
            );
        };

    }
]);
