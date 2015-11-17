'use strict';
var networkModule = angular.module('networks');

/*
 * Config
 */
/*
networkModule.config(['ChartJsProvider'], function(ChartJsProvider){
   ChartJsProvider.setOptions({
      responsive:true,
      datasetFill: true
   });
});
*/

networkModule.directive('networkCard', function(){
   return{
      scope:{
        network:'='
      },
      templateUrl:'modules/networks/partials/cardTemplate.html'
   };
});

networkModule.directive('networkListItem', function(){
   return{
      scope:{
        network:'=',
        authentication: '=',
      },
      templateUrl:'modules/networks/partials/listItemTemplate.html'
   };
});

networkModule.directive('editCard',['networkModel','$mdDialog', function(networkModel, $mdDialog){
  return{
     scope:{
        network:'=',
        networks:'=',
        add: '&'
     },
     replace: true,
     templateUrl:'modules/networks/partials/editTemplate.html',
     link: function(scope, elem, attrs){
         scope.add = function(graphArr){
            graphArr.push({
                name:'New Name',
                edges: 'Edge Count',
                nodes: 'Edge Count',
                fileSize:'File Size',
                fileType: 'File Type',
                downloadLink: 'http://'
            });
        };

        scope.remove = function(index, graphArr){
            graphArr.splice(index, 1);
        };

        scope.save = function(updatedDoc, ev){
            networkModel.updateDocument({id: updatedDoc._id, data: updatedDoc._source}).then(function(res){
                $mdDialog.show(
                    $mdDialog.alert()
                        .parent(angular.element(document.querySelector('#popupContainer')))
                        .clickOutsideToClose(true)
                        .title('Save Status')
                        .content(res.data.message)
                        .ariaLabel('Save Status')
                        .ok('Got it!')
                        .targetEvent(ev)
                );
            });
        };

         scope.delete = function(doomed, doomedArr, ev){
             var confirm = $mdDialog.confirm()
                 .title('Delete Network')
                 .content('Are you sure this cannot be undone!')
                 .ariaLabel('Delete')
                 .targetEvent(ev)
                 .ok('DELETE')
                 .cancel('cancel');
             $mdDialog.show(confirm).then(function() {
                doomedArr.splice(doomedArr.indexOf(doomed), 1);
                 networkModel.deleteNetwork(doomed._id).then(function(res){
                     console.log(res);
                 });
             });
         };

         scope.saveNew = function(newDoc, ev){
             networkModel.addNetwork(newDoc).then(function(res){
                 $mdDialog.show(
                    $mdDialog.alert()
                        .parent(angular.element(document.querySelector('#popupContainer')))
                        .clickOutsideToClose(true)
                        .title('Save Status')
                        .content(res.data.message)
                        .ariaLabel('Save Status')
                        .ok('Got it!')
                        .targetEvent(ev)
                );
             });
         };

         scope.cancel = function(network, networks){
             if(network._id = 'new'){
                 networks.splice(networks.indexOf(network),1);
             }
             network.state = 'list';
         }

     }
  }
}]);

networkModule.directive('enterKey', function () {
    return function (scope, element, attrs) {
        element.bind("keydown keypress", function (event) {
            if(event.which === 13) {
                scope.$apply(function (){
                    scope.$eval(attrs.myEnter);
                });

                event.preventDefault();
            }
        });
    };
});
