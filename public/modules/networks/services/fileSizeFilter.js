/**
 *
 * Created by Matthias on 4/5/16.
 */

angular.module('networks').filter('fileSize', function () {
    var sizes = [
        'b',
        'kb',
        'mb',
        'gb',
        'tb',
        'pb'
    ];
    return function (rawSize) {

        if (rawSize == null) return 'n/a';

        var parseNum = 0;
        if (typeof rawSize === 'string') {
            parseNum = parseInt(rawSize);
        } else if (typeof rawSize === 'number') {
            parseNum = rawSize;
        } else {
            return 'n/a';
        }

        for (var i in sizes) {
            if (parseNum / 1000 < 1) {
                return parseNum.toString() + sizes[i];
            }
            parseNum /= 1000;
        }
    }
});
