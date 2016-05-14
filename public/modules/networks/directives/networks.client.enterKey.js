/**
 *
 * Created by Matthias on 5/11/16.
 */

angular.module('networks').directive('enterKey', function () {
    return {
        link: function (scope, element, attrs) {
            element.bind("keydown keypress", function (event) {
                if (event.which === 13) {
                    scope.$apply(function () {
                        scope.$eval(attrs.myEnter);
                    });

                    event.preventDefault();
                }
            });
        }
    };

});
