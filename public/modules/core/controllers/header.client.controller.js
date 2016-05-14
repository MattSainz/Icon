'use strict';

angular.module('core').controller('HeaderController', ['$scope', 'Authentication', 'Menus',
	function($scope, Authentication, Menus) {

        $scope.authentication = Authentication;
        $scope.isCollapsed = false;
        $scope.menu = Menus.getMenu('topbar');

        //find a better place for this
        Menus.addMenuItem(
            'topbar',
            'Networks',
            '#!/networks',
            'item',
            '#!/networks',
             true
        );

        Menus.addMenuItem(
            'topbar',
            'About',
            '#!/about',
            'item',
            '#!/about',
             true
        );

        Menus.addMenuItem(
            'topbar',
            'Link Rot',
            '#!/link_rot',
            'item',
            '#!/link_rot',
            false
        );

        Menus.addMenuItem(
            'topbar',
            'Json Edit',
            '#!/json_edit',
            'item',
            '#!/json_edit',
            false
        );

        Menus.addMenuItem(
            'topbar',
            'Suggestions',
            '#!/suggestions',
            'item',
            '#!/suggestions',
            true
        );

	}
]);
