/**
 *
 * Created by Matthias on 5/4/16.
 */

angular.module('core').controller('JsonEditController',['$scope', '$http', 'networkTemplate', '$mdToast', function($scope, $http, networkTemplate, $mdToast){
    var myTemplate = networkTemplate._source;
    myTemplate['_id'] = 'new';
    $scope.jsonData = JSON.stringify([myTemplate], null, 2);

    $scope.save = function(){
       try{
           var data = JSON.parse($scope.jsonData);
             //ensure that they input correctly formatted json

           var malFormed = false;
           data.forEach(function(d){
               if(!d._id || d._id == ''){
                   malFormed = true;
                   showMdToast('Error Doc with title: ' + d.title + 'id must be "new"');
               }
           });

           if(!malFormed) {
               if (data.constructor === Array) {
                   $http.post('/networks/updateJSON', data).then(function (ret) {
                       console.log(ret);
                       showMdToast('Save of Documents Successful');
                   }, function (err) {
                        showMdToast('ERROR: ' + err.status + ' ' + err.statusText);
                   });
               } else {
                   showMdToast('Data Must Be In An Array');
               }
           }

       }catch(e){
           console.log(e);
           showMdToast('Error converting text');
       }
    };

    function showMdToast(message){
       $mdToast.show(
          $mdToast.simple()
              .textContent(message)
              .position('bottom left')
              .hideDelay(3000)
      );
    }


}]);
