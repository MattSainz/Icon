/**
 *
 * Created by Matthias on 3/25/16.
 */

angular.module('core').factory('TextContent',[
    '$http',
    '$window',
    '$mdToast',
    function($http, $window, $mdToast){
        var _ = $window._;

        function Entry(_id, title, contentBody, page, edit, dateCreated){
            this._id         = _id         || -1;
            this.title       = title       || '';
            this.contentBody = contentBody || '';
            this.contentType = page        || 'about';
            this.edit = false;
            this.dateCreated = dateCreated || Date.now();
        }

        return function($scope, page){
           $scope.entries = [];

           $http.get('/textContent/getContent', {params:{page:page}}).then(function(ret){
               _.forEach(ret.data.message, function(entry){
                   console.log(entry);
                  $scope.entries.push(new Entry(entry._id, entry.title, entry.contentBody, entry.contentType))
               })
           },function(err){
              console.error(err);
           });


           this.save = function(index){
                var entry = $scope.entries[index];
                var newEntry = new Entry(0, entry.title, entry.contentBody, page, true, Date.now());

                delete newEntry._id;
                delete newEntry.edit;

                $http.post('/textContent/addContent', newEntry).success(function(ret){
                    console.log(ret);
                    entry.edit = false;
                    entry._id = ret.message._id;
                    $mdToast.show(
                        $mdToast.simple()
                           .textContent('Save Successful!')
                           .position('bottom left')
                           .hideDelay(3000)
                    );
                },function(err){
                    $mdToast.show(
                        $mdToast.simple()
                           .textContent('ERROR: ' + err.status + ' ' + err.statusText)
                           .position('bottom left')
                           .hideDelay(3000)
                    );
                });
           };

           this.update = function(index){
                var entry = $scope.entries[index];
                $http.put('/textContent/updateEntry', entry).then(function(ret){
                    entry.edit = false;
                    $mdToast.show(
                        $mdToast.simple()
                           .textContent('Update Successful!')
                           .position('bottom left')
                           .hideDelay(3000)
                    );
                },function(err){
                    $mdToast.show(
                        $mdToast.simple()
                           .textContent('ERROR: ' + err.status + ' ' + err.statusText)
                           .position('bottom left')
                           .hideDelay(3000)
                    );
                });
           };

           this.delete = function(index){
                var entry = $scope.entries[index];
                $http.delete('/textContent/deleteContent/', {params:{id:entry._id}}).then(function(ret){
                    $scope.entries.splice(index, 1);
                    $mdToast.show(
                        $mdToast.simple()
                           .textContent('Delete Successful!')
                           .position('bottom left')
                           .hideDelay(3000)
                    );
                },function(err){
                    $mdToast.show(
                        $mdToast.simple()
                           .textContent('ERROR: ' + err.status + ' ' + err.statusText)
                           .position('bottom left')
                           .hideDelay(3000)
                    );
                });
           };

           this.cancel = function(index){
               var entry = $scope.entries[index];

               if (entry._id == -1 ){
                   $scope.entries.splice(index, 1);
               }else{
                   entry.edit = false;
               }

           };

           this.getContentTemplate = function(){
               $scope.entries.push(new Entry(0,'New Entry', 'new content goes here.', true));
           };
        }
    }
]);
