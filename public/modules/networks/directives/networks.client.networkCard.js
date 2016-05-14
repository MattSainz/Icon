/**
 *
 * Created by Matthias on 5/11/16.
 */

angular.module('networks').directive('networkCard', ['$http', '$window', function ($http, $window) {
    return {
        scope: {
            network: '=',
            authentication: '='
        },
        templateUrl: 'modules/networks/partials/cardTemplate.html',
        link: function(scope, elem , attrs){
           scope.download = function(path){
              $http.put('/networks/downloadGML',{path:path}).then(function(ret){
                  console.log(ret.headers);
              }, function(err){
                 console.log(err);
              });
           };
        }
    };
}]);
