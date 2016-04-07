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

	}
]);
