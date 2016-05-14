/**
 *
 * Created by Matthias on 5/12/16.
 */

angular.module('networks').controller('TmpNetworkController', [
    '$scope',
    '$mdToast',
    '$window',
    'Authentication',
    '$http',
    'networkTemplate',
    '$q',
    function ($scope, $mdToast, $window, Authentication, $http, networkTemplate, $q) {

    $scope.networks = [];

    $scope.authentication = Authentication;

    $http.get('/networks/getTmpNetworks').then(function (ret) {
        //Map to format used for results returned from elastic
        $scope.networks = $window._.map(ret.data.message, function(network){
            return {
                _id: network._id,
                _source: network,
                state: 'list'
            }
        });
    }, function (err) {
        $mdToast.show(
            $mdToast.simple()
                .textContent('ERROR: ' + err.status + ' ' + err.statusText)
                .position('bottom left')
                .hideDelay(3000)
        );
    });

    $scope.addNewNetworkTemplate = function () {
        $scope.networks.unshift(networkTemplate);
    };

    $scope.save = function(newDoc){
       newDoc._source['_id'] = newDoc._id;
       if(Authentication.user){
           return $q(function(resolve, reject){
               $http.put('/networks/makeTmpPublic', newDoc._source).then(function(ret){
                   //Move to main page successful remove from suggestion view
                   $scope.networks.splice($scope.networks.indexOf(newDoc), 1);
                   resolve(ret);
               }, function(err){
                   reject(err);
               });
           });
       } else {
           return $http.put('/networks/saveTmpNetwork', newDoc._source);
       }
    };

    $scope.delete = function(doomed){
        return $http.put('/networks/deleteTmpNetwork')
    };
}]);
