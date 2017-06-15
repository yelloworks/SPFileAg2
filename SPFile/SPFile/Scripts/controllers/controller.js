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
                            var ListId = GetUrlKeyValue("SPListId");
                            var ItemId = GetUrlKeyValue("SPItemId");
                            var ItemUrl = GetUrlKeyValue("SPItemUrl");
                            var SiteUrl = GetUrlKeyValue("SPSiteUrl");
                            var ListUrlDir = GetUrlKeyValue("SPListUrlDir");
                            var Source = GetUrlKeyValue('SPSource', false);
                            var SelectedListId = GetUrlKeyValue("SPSelectedListId");
                            var SelectedItemId = GetUrlKeyValue("SPSelectedItemId");
                            var HostUrl = GetUrlKeyValue("SPHostUrl");
                            var Title = GetUrlKeyValue("SPTitle");
                            var someTmp = GetUrlKeyValue("SPAppWebUrl");


                            var decodeSourse = decodeURIComponent(Source);
                            var rootFolder = getParameterByName('RootFolder', decodeSourse);
                            var AppWebUrl2 = getParameterByName('SPSource');
                            var folderName = GetUrlKeyValue('SPListUrlDir');
                            //var url = window.location.protocol +
                            //    "//" +
                            //    window.location.host +
                            //    _spPageContextInfo.siteServerRelativeUrl;

                            var relativeUrl = folderName;
                            if (rootFolder != null) {
                                relativeUrl = rootFolder;
                            }
                            

                            //Вынести в метод что ли но потом. Плохой код

                            var it = someTmp.split('/');
                            var itnew = it.slice(0, it.length-1);
                            var url = itnew.join('/');

                            if (relativeUrl != "/") {
                                var folderArray = relativeUrl.split('/');
                                folderName = folderArray.slice(folderArray.length - 1, folderArray.length - 0)[0];
                            } 

                            if (ListId != "") {
                                $rootScope.$broadcast("pageInit", url, ListId, relativeUrl, folderName);
                                $rootScope.$digest();
                            }
                        });
                });
        });

    angular.module('Abs')
        .controller('MainInterface',
            function($scope, toaster) {
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

                $scope.blockedButtons = function () {
                    $scope.disabledButtons.lock = true;
                    $scope.disabledButtons.unlock = true;
                    $scope.disabledButtons.editMetadata = true;
                   // $scope.disabledButtons.permissions = true;

                };
            });

    angular.module('Abs')
        .controller('RibbonButtonsCtrl',
            ['$scope', 'selectedBufferService', 'bufferService', '$log', 'fileOperations', 'checkOperations', 'loadOperations', '$uibModal', 'toaster', function ($scope, selectedBufferService, bufferService, $log, fileOperations, checkOperations, loadOperations, $uibModal, toaster) {

                $scope.copyBtnClicked = function() {
                    bufferService.setBuffer(selectedBufferService.getBuffer(),
                        selectedBufferService.getInfo(),
                        false);
                    toaster.clear();
                    toaster.pop('warning', "Copied", bufferService.getItemsList(), null, 'trustedHtml');
                };

                $scope.pasteBtnClicked = function() {
                    var sourceItems = bufferService.getBuffer();
                    var sourceUrl = bufferService.getUrl();
                    var sourceListId = bufferService.getListId();
                    var sourceRelativeUrl = bufferService.getClearRelativeUrl();
                    var isCuted = bufferService.getIsCuted();
                    var destinationUrl = selectedBufferService.getClearRelativeUrl(); // нужно как то его получить
                    var destinationListId = selectedBufferService.getlistID();
                    if (sourceItems.length != 0) {
                        sourceItems.forEach(function (item, i, arr) {
                            fileOperations.CopyOrMove(sourceUrl, sourceListId, sourceRelativeUrl, item.ID, destinationUrl, destinationListId, item.type, item.name, isCuted);
                        });
                        
                    }
                };

                $scope.cutBtnClicked = function() {
                    bufferService.setBuffer(selectedBufferService.getBuffer(), selectedBufferService.getInfo(), false);
                    toaster.clear();
                    toaster.pop('warning', "Cuted", bufferService.getItemsList(), null, 'trustedHtml');
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
                    modalInstance.result.then(function (folderName) {                       
                        var it = selectedBufferService.getClearRelativeUrl().split('/');
                        var itnew = it.slice(2, it.length);
                        itnew.push(folderName); // вот тут имя папки
                        var relativeUrl = itnew.join('/');
                        fileOperations.createNewFolder(url, listId, relativeUrl);

                        
                    }, function () {
                        $log.info('Modal dismissed at: ' + new Date());
                    });


                };

                $scope.discardCheckoutBtnClicked = function () {
                    var sourceItems = selectedBufferService.getBuffer();
                    var sourceUrl = selectedBufferService.getUrl();
                    var sourceListId = selectedBufferService.getlistID();
                    var sourceRelativeUrl = selectedBufferService.getRelativeUrl();

                    if (sourceItems.length != 0) {
                        sourceItems.forEach(function (item, i, arr) {
                            checkOperations.undoCheckOut(sourceUrl, sourceListId, sourceRelativeUrl, item.ID, item.type);

                        });

                    }
                };

                $scope.deleteBtnClicked = function () {
                    deleteForEachSelected(fileOperations.deleteItem);
                };

                $scope.deletePermanentBtnClicked = function() {
                    deleteForEachSelected(fileOperations.deleteItemToRecycle);
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
                                    method(sourceUrl, sourceListId, item.ID).then(function() {
                                        toaster.pop('success',
                                            "Delete items",
                                            "Item deleted: " +item.name,
                                            5000,
                                            'trustedHtml');
                                    }, function(error) {
                                        toaster.pop('error',
                                            "Delete items",
                                            item.name+"\n"+error,
                                            5000,
                                            'trustedHtml');
                                    });

                                });
                            },
                            function() {
                                $log.info('Modal dismissed at: ' + new Date());
                            });

                    }
                }

                $scope.downloadFileBtnClicked = function () {
                    var sourceItems = selectedBufferService.getBuffer();
                    var sourceUrl = selectedBufferService.getUrl(); // нужно как то его получить
                    var sourceListId = selectedBufferService.getlistID();
                    if (sourceItems.length != 0) {
                        sourceItems.forEach(function (item, i, arr) {
                            if (item.type == 0) {
                                loadOperations.downloadSingleFile(sourceUrl, sourceListId, item.ID);
                            };
                        });

                    }
                    
                };
                //For Upload
                var input = document.getElementById("fileinput");
                input.addEventListener('change', function (e) {
                    var sourceUrl = selectedBufferService.getUrl();
                    var sourceListId = selectedBufferService.getlistID();
                    var sourceRelativeUrl = selectedBufferService.getRelativeUrl();
                    var files = e.target.files;
                    loadOperations.uploadSingleFile(files, sourceUrl, sourceListId, sourceRelativeUrl);

                });

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
                        modalInstance.result.then(function(folderName) {

                            },
                            function() {
                                $log.info('Modal dismissed at: ' + new Date());
                            });
                    };
                }

            }]);


})()