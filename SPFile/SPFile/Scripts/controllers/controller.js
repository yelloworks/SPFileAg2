(function () {

    angular.module('Abs', ['ngAnimate', 'ngSanitize', 'ui.bootstrap', 'TreeWidget', 'ngTouch', 'ui.grid', 'ngSelectable', 'toaster', 'ui.grid.selection', 'ui.select', "uiSwitch", "ui.indeterminate"]);

    //on page load
    angular.element(document)
        .ready(function() {
            var $inj = angular.bootstrap(document.body, ['Abs']);
            var $rootScope = $inj.get("$rootScope");

            function getParameterByName(name, url) {
                if (!url) {
                    url = window.location.href;
                }
                name = name.replace(/[\[\]]/g, "\\$&");
                var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
                    results = regex.exec(url);
                if (!results) return null;
                if (!results[2]) return '';
                return decodeURIComponent(results[2].replace(/\+/g, " "));
            }

            SP.SOD.executeFunc('SP.Runtime.js',
                'SP.ClientContext',
                function() {
                    SP.SOD.executeFunc('SP.js',
                        'SP.ClientContext',
                        function() {
                            var listId = GetUrlKeyValue("SPListId");
                            var source = GetUrlKeyValue('SPSource', false);
                            var webUrl = GetUrlKeyValue("SPAppWebUrl");
                            var decodeSourse = decodeURIComponent(source);
                            var rootFolder = getParameterByName('RootFolder', decodeSourse);
                            var folderName = GetUrlKeyValue('SPListUrlDir');
                            var relativeUrl = folderName;

                            if (rootFolder != null) {
                                relativeUrl = rootFolder;
                            }                        
                            if (relativeUrl != "/") {
                                var folderArray = relativeUrl.split('/');
                                folderName = folderArray.slice(folderArray.length - 1, folderArray.length - 0)[0];
                            } 
                            if (listId != "") {
                                $rootScope.$broadcast("pageInit", getUrl(webUrl), listId, relativeUrl, folderName);
                                $rootScope.$digest();
                            }
                        });
                });

            function getUrl(webUrl) {
                var it = webUrl.split('/');
                var itnew = it.slice(0, it.length - 1);
                var url = itnew.join('/');
                return url;
            }

        });

    angular.module('Abs')
        .controller('MainInterface',
            function($scope) {
                $scope.disabledButtons = {
                    paste: true,
                    copy: true,
                    cut: true,
                    addfolder: true,
                    lock: true,
                    unlock: true,
                    discardCheckout: true,
                    editMetadata: true,
                    permissions: true,
                    download: true,
                    upload: true,
                    del: true
                };

                $scope.setAllButtonsEnabled = function() {
                    $scope.disabledButtons.paste = false;
                    $scope.disabledButtons.copy = false;
                    $scope.disabledButtons.cut = false;
                    $scope.disabledButtons.addfolder = false;
                    $scope.disabledButtons.lock = false;
                    $scope.disabledButtons.unlock = false;
                    $scope.disabledButtons.discardCheckout = false;
                    $scope.disabledButtons.editMetadata = false;
                    $scope.disabledButtons.permissions = false;
                    $scope.disabledButtons.download = false;
                    $scope.disabledButtons.upload = false;
                    $scope.disabledButtons.del = false;
                    $scope.blockedButtons();
                };

                $scope.setAllButtonsDisabled = function() {
                    $scope.disabledButtons.paste = true;
                    $scope.disabledButtons.copy = true;
                    $scope.disabledButtons.cut = true;
                    $scope.disabledButtons.addfolder = true;
                    $scope.disabledButtons.lock = true;
                    $scope.disabledButtons.unlock = true;
                    $scope.disabledButtons.discardCheckout = true;
                    $scope.disabledButtons.editMetadata = true;
                    $scope.disabledButtons.permissions = true;
                    $scope.disabledButtons.download = true;
                    $scope.disabledButtons.upload = true;
                    $scope.disabledButtons.del = true;
                };

                $scope.blockedButtons = function() {
                    $scope.disabledButtons.lock = true;
                    $scope.disabledButtons.unlock = true;
                    $scope.disabledButtons.editMetadata = true;
                };
            });

    angular.module('Abs')
        .controller('RibbonButtonsCtrl',
        [ '$scope', 'selectedBufferService', 'bufferService', '$log', 'fileOperations', 'checkOperations',
            'loadOperations',
            '$uibModal', 'toaster', function($scope,
                selectedBufferService,
                bufferService,
                $log,
                fileOperations,
                checkOperations,
                loadOperations,
                $uibModal,
                toaster) {

                var showToast = {
                    success: function(toastTytle, toastBody) {
                        toaster.pop({
                            type: 'success',
                            title: toastTytle,
                            body: toastBody,
                            timeout: 5000,
                            bodyOutputType: 'trustedHtml'
                        });
                    },
                    error: function(toastTytle, toastBody) {
                        toaster.pop({
                            type: 'error',
                            title: toastTytle,
                            body: toastBody,
                            timeout: 5000,
                            bodyOutputType: 'trustedHtml'
                        });
                    },
                    warning: function(toastTytle, toastBody) {
                        toaster.pop({
                            type: 'warning',
                            title: toastTytle,
                            body: toastBody,
                            timeout: null,
                            bodyOutputType: 'trustedHtml'
                        });
                    }
                };

                function deleteForEachSelected(method) {
                    var sourceItems = selectedBufferService.getBuffer();
                    var sourceUrl = selectedBufferService.getUrl();
                    var sourceListId = selectedBufferService.getlistID();

                    if (sourceItems.length != 0) {
                        var modalInstance = $uibModal.open({
                            animation: true,
                            templateUrl: 'solutionModal.html',
                            controller: 'solutionModalCtrl',
                            controllerAs: '$ctrl',
                            resolve: {
                                actionToDo: function() { return "Delete"; },
                                itemsCount: function() { return sourceItems.length; }
                            }
                        });

                        modalInstance.result.then(function() {
                                sourceItems.forEach(function(item, i, arr) {
                                    method(sourceUrl, sourceListId, item.ID)
                                        .then(function() {
                                                showToast.success("Delete items", "Item deleted: " + item.name);
                                            },
                                            function(error) {
                                                showToast.error("Delete items", item.name + "\n" + error);
                                            });

                                });
                            },
                            function() {
                                $log.info('Modal dismissed at: ' + new Date());
                            });

                    }
                };

                $scope.copyBtnClicked = function() {
                    bufferService.setBuffer(selectedBufferService.getBuffer(),
                        selectedBufferService.getInfo(),
                        false);
                    toaster.clear();
                    showToast.warning("Copied", bufferService.getItemsList());
                };

                $scope.pasteBtnClicked = function() {
                    var sourceItems = bufferService.getBuffer();
                    var sourceUrl = bufferService.getUrl();
                    var sourceListId = bufferService.getListId();
                    var sourceRelativeUrl = bufferService.getClearRelativeUrl();
                    var isCuted = bufferService.getIsCuted();
                    var destinationUrl = selectedBufferService.getClearRelativeUrl();
                    var destinationListId = selectedBufferService.getlistID();
                    if (sourceItems.length != 0) {
                        sourceItems.forEach(function(item, i, arr) {
                            fileOperations.CopyOrMove(sourceUrl,
                                sourceListId,
                                sourceRelativeUrl,
                                item.ID,
                                destinationUrl,
                                destinationListId,
                                item.type,
                                item.name,
                                isCuted);
                        });

                    }
                };

                $scope.cutBtnClicked = function() {
                    bufferService.setBuffer(selectedBufferService.getBuffer(), selectedBufferService.getInfo(), false);
                    toaster.clear();
                    showToast.warning("Cuted", bufferService.getItemsList());
                };

                $scope.addFolderBtnClicked = function() {
                    var url = selectedBufferService.getUrl();
                    var listId = selectedBufferService.getlistID();
                    var modalInstance = $uibModal.open({
                        animation: true,
                        templateUrl: 'folderNameModal.html',
                        controller: 'ModalInstanceCtrl',
                        controllerAs: '$ctrl'
                    });

                    modalInstance.result.then(function(folderName) {
                            var it = selectedBufferService.getClearRelativeUrl().split('/');
                            var itnew = it.slice(2, it.length);
                            itnew.push(folderName);
                            var relativeUrl = itnew.join('/');
                            fileOperations.createNewFolder(url, listId, relativeUrl);
                        },
                        function() {
                            $log.info('Modal dismissed at: ' + new Date());
                        });


                };

                $scope.discardCheckoutBtnClicked = function() {
                    var sourceItems = selectedBufferService.getBuffer();
                    var sourceUrl = selectedBufferService.getUrl();
                    var sourceListId = selectedBufferService.getlistID();
                    var sourceRelativeUrl = selectedBufferService.getRelativeUrl();

                    if (sourceItems.length != 0) {
                        sourceItems.forEach(function(item, i, arr) {
                            checkOperations
                                .undoCheckOut(sourceUrl, sourceListId, sourceRelativeUrl, item.ID, item.type);
                        });
                    }
                };

                $scope.deleteBtnClicked = function() {
                    deleteForEachSelected(fileOperations.deleteItem);
                };

                $scope.deletePermanentBtnClicked = function() {
                    deleteForEachSelected(fileOperations.deleteItemToRecycle);
                };

                $scope.downloadFileBtnClicked = function() {
                    var sourceItems = selectedBufferService.getBuffer();
                    var sourceUrl = selectedBufferService.getUrl(); 
                    var sourceListId = selectedBufferService.getlistID();
                    if (sourceItems.length != 0) {
                        sourceItems.forEach(function(item, i, arr) {
                            if (item.type == 0) {
                                loadOperations.downloadSingleFile(sourceUrl, sourceListId, item.ID);
                            };
                        });
                    }
                };

                $scope.permissionsBtnClicked = function() {
                    if (selectedBufferService.getBuffer().length != 0) {
                        var modalInstance = $uibModal.open({
                            animation: true,
                            templateUrl: 'permissionsModal.html',
                            controller: 'permissionsModal',
                            controllerAs: '$ctrl',
                            size: "lg",
                            resolve: {
                                items: function() {
                                    return selectedBufferService.getBuffer();
                                },
                                url: function() {
                                    return selectedBufferService.getUrl();
                                },
                                listId: function() {
                                    return selectedBufferService.getlistID();
                                }
                            }
                        });
                        modalInstance.result.then(function() {
                            },
                            function() {
                                $log.info('Modal dismissed at: ' + new Date());
                            });
                    };
                };

                var input = document.getElementById("fileinput");
                input.addEventListener('change',
                    function(e) {
                        var sourceUrl = selectedBufferService.getUrl();
                        var sourceListId = selectedBufferService.getlistID();
                        var sourceRelativeUrl = selectedBufferService.getRelativeUrl();
                        var files = e.target.files;
                        loadOperations.uploadSingleFile(files, sourceUrl, sourceListId, sourceRelativeUrl);
                    });
            }
        ]);
})()