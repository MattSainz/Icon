/**
 * Created by Matthias on 5/11/16.
 */
angular.module('networks').directive('editCard', [function () {
    return {
        scope: {
            network: '=',
            networks: '=',
            saveButtonTxt: '@',
            save: '&',
            delete: '&'
        },
        replace: true,
        templateUrl: 'modules/networks/partials/editTemplate.html',
        controller: [
            '$scope',
            '$mdDialog',
            'UploadGML',
            '$element',
            '$attrs',
            function ($scope, $mdDialog, UploadGML, $element, $attrs) {

                //Directive specific functions
                $scope.file = {
                    name: null
                };

                //Add sub graph
                $scope.add = function (graphArr) {
                    graphArr.push({
                        name: 'New Name',
                        edges: 'Edge Count',
                        nodes: 'Node Count',
                        fileSize: 'File Size',
                        fileType: 'File Type',
                        downloadLink: 'http://'
                    });
                };

                //Remove sub graph
                $scope.remove = function (index, graphArr) {
                    graphArr.splice(index, 1);
                };

                function showPopup(popupInfo, ev) {
                    $mdDialog.show(
                        $mdDialog.alert()
                            .parent(angular.element(document.querySelector('#popupContainer')))
                            .clickOutsideToClose(true)
                            .title(popupInfo.title)
                            .content(popupInfo.content)
                            .ok('Got it!')
                            .targetEvent(ev)
                    );
                }

                //Configurable functions
                $scope.saveWrapper = function (updatedDoc, ev) {

                    function _saveWrapper(updatedDoc) {
                        $scope.save(updatedDoc).then(function (ret) {
                            console.log(ret);
                            showPopup({
                                title: 'Save Successful!',
                                content: 'Document Saved Successfully'
                            }, ev);
                            updatedDoc._id = ret.data.id;
                            updatedDoc.state = 'list';
                        }, function (err) {
                            console.log(err);
                            showPopup({
                                title: 'Save Error',
                                content: 'There was an issue saving your document'
                            }, ev);
                        });
                    }

                    if ($scope.file.name != null) {
                        UploadGML($scope.file, updatedDoc, function (docWithFile) {
                            _saveWrapper(docWithFile)
                        }, function (err) {
                            showPopup({title: 'File Error', content: 'There was an error uploading your file'}, ev)
                        });
                    } else {
                        _saveWrapper(updatedDoc);
                    }

                };

                $scope.deleteWrapper = function (doomed, ev) {
                    var confirm = $mdDialog.confirm()
                        .title('Delete Network')
                        .content('Are you sure this cannot be undone!')
                        .ariaLabel('Delete')
                        .targetEvent(ev)
                        .ok('DELETE')
                        .cancel('cancel');
                    $mdDialog.show(confirm).then(function () {
                        $scope.delete(doomed).then(function (ret) {
                            $scope.networks.splice($scope.networks.indexOf(doomed), 1);
                            showPopup({
                                title: 'Delete Successful',
                                content: 'The network has been deleted'
                            }, ev);
                        }, function (err) {
                            showPopup({
                                title: 'Delete Error',
                                content: 'An Error occurred when trying to save'
                            }, ev);
                        });
                    });
                };

                $scope.cancel = function (network) {
                    if (network._id == 'new') {
                        $scope.networks.splice($scope.networks.indexOf(network), 1);
                    }
                    network.state = 'list';
                };

            }]
    }
}]);

