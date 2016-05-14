/**
 *
 * Created by Matthias on 5/11/16.
 */

angular.module('networks').service('UploadGML', ['Upload', function (Upload) {
    return function (file, updatedDoc, saveCb, errCb, progressCb) {
        updatedDoc._source.gml = {
            path: '',
            name: file.name
        };
        Upload.upload({
            url: 'networks/uploadGML',
            data: {file: file, oldPath: updatedDoc._source.gml.path}
        }).then(function (resp) {
            updatedDoc._source.gml.path = resp.data.path;
            saveCb(updatedDoc);
        }, function (err) {
            errCb(err)
        }, function (evt) {
            if(progressCb){
                progressCb(evt)
            }
        });
    }
}]);
