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
    'TextContent',
    function ($scope, $mdToast, $window, Authentication, $http, networkTemplate, $q, TextContent) {

    $scope.networks = [];

    $scope.authentication = Authentication;

    var suggestionPage = new TextContent($scope, 'suggestion');

    $scope.textSave   = suggestionPage.save;
    $scope.textUpdate = suggestionPage.update;
    $scope.textDelete = suggestionPage.delete;
    $scope.textCancel = suggestionPage.cancel;
    $scope.getContentTemplate = suggestionPage.getContentTemplate;

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
        var suggestTemplate =  new networkTemplate;
        suggestTemplate._source.suggestedBy = 'Your Name Here (optional)';
        suggestTemplate._source.suggestedByUrl = 'Your Personal Site (optional)';
        suggestTemplate._source.email = 'Email for Icon staff to contact you (Not made public)';
        $scope.networks.unshift(suggestTemplate);
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

    $scope.update = function(oldDoc){
       console.log(oldDoc);
       oldDoc._source['_id'] = oldDoc._id;
       return $http.put('networks/saveTmpNetwork', oldDoc._source);
    };

    $scope.delete = function(doomed){
        return $http.put('/networks/deleteTmpNetwork', {id:doomed._id});
    };

    $scope.isSuggestion = true;
}]);
