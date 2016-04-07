/**
 *
 * Created by Matthias on 3/25/16.
 */

angular.module('core').controller('AboutController',[
    '$scope',
    'TextContent',
    'Authentication',
    function($scope, TextContent, Authentication){

        var about = new TextContent($scope, 'about');

        $scope.authentication = Authentication;

        $scope.save = about.save;
        $scope.update = about.update;
        $scope.delete = about.delete;
        $scope.cancel = about.cancel;
        $scope.getContentTemplate = about.getContentTemplate;

    }
]);
