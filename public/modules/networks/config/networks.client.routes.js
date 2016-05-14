'use strict';

angular.module('networks').config(['$stateProvider',
    function($stateProvider) {
        // Home state routing
        $stateProvider.
        state('networks',{
            url: '/networks',
            templateUrl: 'modules/networks/views/networksHome.client.view.html'
        }).
        state('tmpNetworks', {
            url:'/suggestions',
            templateUrl: 'modules/networks/views/tmpNetwork.client.view.html'
        });
    }
]);

