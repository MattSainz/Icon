/**
 *
 * Created by Matthias on 4/20/16.
 */


angular.module('core').controller('LinkRotController',['$scope', '$http','$window',function($scope, $http, $window){
    $scope.badLinks = [];
    var _ = $window._;

    $http.get('/networks/getLinkRot').then(function(ret){
        $scope.badLinks = _.flatten(ret.data.message);
        console.log($scope.badLinks);
    }, function(err){
       console.log(err);
    });

}]);
