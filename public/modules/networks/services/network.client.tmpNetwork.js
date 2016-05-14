/**
 *
 * Created by Matthias on 5/11/16.
 */

angular.module('networks').service('TmpNetworks', ['$http', function($http){

   this.getTmpNetworks = function(cb){
      $http.get('/networks/getTmpNetworks').then(function(ret){
         cb(ret);
      }, function(err){
         cb(err);
      });
   };

   this.saveSuggestion = function(newSuggestion, cb){
      $http.post('/networks/addTmpNetwork', newSuggestion).then(function(ret){
        cb(ret);
      }, function(err){
        cb(err);
      });
   }

}]);
