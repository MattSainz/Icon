/**
 * Created by Matthias on 9/22/15.
 */

"use strict";

angular.module('core').service('homeContentModel', ['$rootScope', '$http', function($rootScope, $http) {

    function entry(_id, title, contentBody, page, dateCreated){
        this._id         = _id         || '0';
        this.title       = title       || '';
        this.contentBody = contentBody || '';
        this.page        = page        || 'home';
        this.dateCreated = dateCreated || 0;
        this.oldEntry= false;
    }

    this.entry = entry;

    this.getEntries = function() {
        return $http.get('/textContent/getContent').then(function (entries) {
            return entries.data.message;
        });
    };

    this.saveNewEntry = function(entry){
        delete entry._id;
            //the id property is useful for updating but causes issues when generating new entries
        entry.oldEntry = true;
            //Allows us to identify entires saved in the db

        $http({
            url: '/textContent/addContent',
            method: 'POST',
            data: entry,
            headers: {'Content-Type': 'application/json'}
        }).success(function (data, status, headers, config) {
            console.log(status);
        }).error(function (data, status, headers, config) {
            console.log(status);
        });

    };

    this.deleteEntry = function(entry){
        return $http.delete('/textContent/deleteContent/'+entry._id).then(function(ret){
            console.log(ret);
        });
    };

    this.updateEntry = function(entry){
        $http.put('/textContent/updateEntry', entry).then(function(ret){
            console.log(ret);
        });
    };

}]);
