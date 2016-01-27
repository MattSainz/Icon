/**
 *
 * Created by Matthias on 1/13/16.
 */

angular.module('networks').service('fileSCon', function(){

    var sizes = [
        'b',
        'kb',
        'mb',
        'gb',
        'tb',
        'pb'
    ];

    this.convert = function(rawSize){
       if( rawSize == null) return 'n/a';
       var parseNum = 0;
       if( typeof rawSize === 'string'){
           parseNum = parseInt(rawSize);
       }else if( typeof rawSize === 'number'){
           parseNum = rawSize;
       }else{
           return 'n/a';
       }

       for( var i in sizes ){
           if(parseNum / 1000 < 1){
               return parseNum.toString() + sizes[i];
           }
           parseNum /= 1000;
       }
    };
});
