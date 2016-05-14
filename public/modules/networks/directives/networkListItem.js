/**
 *
 * Created by Matthias on 5/11/16.
 */

angular.module('networks').directive('networkListItem', function () {
    return {
        scope: {
            network: '=',
            authentication: '='
        },
        templateUrl: 'modules/networks/partials/listItemTemplate.html'
    };
});
