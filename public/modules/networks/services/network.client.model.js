/**
 *
 * Created by Matthias on 11/5/15.
 */

angular.module('networks').service('networkModel', ['$rootScope', '$http', 'Authentication', function($rootScope, $http, Authentication) {


    this.getAttrs = function(){
        return $http.get('/networks/getUniqueAttrs').then(function(res){
            return res.data;
        });
    };

    this.doSearch = function(query){
        return $http.post('/networks/doSearch',query).then(function(res){
           return res.data.message.hits;
        });
    };

    this.updateDocument = function(doc){
        return $http.put('/networks/updateNetwork', doc, function(res){
            return res;
        });
    };

    this.addNetwork = function(doc){
        return $http.post('/networks/addNetwork', doc, function(res){
            return res;
        });
    };

    this.deleteNetwork = function(id){
        return $http.put('/networks/deleteNetwork', {id:id}, function(res){
            return res;
        });
    };

}]);
