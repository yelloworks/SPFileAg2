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
        [
            '$scope', 'buttonOperations', function($scope, buttonOperations) {

                $scope.copyBtnClicked = function() {
                    buttonOperations.copyItems();
                };

                $scope.pasteBtnClicked = function() {
                    buttonOperations.pasteItems();
                };

                $scope.cutBtnClicked = function() {
                    buttonOperations.cutItems();
                };

                $scope.addFolderBtnClicked = function() {
                    buttonOperations.addNewFolder();
                };

                $scope.discardCheckoutBtnClicked = function() {
                    buttonOperations.discardItemsCheckout();
                };

                $scope.deleteBtnClicked = function() {
                    buttonOperations.deleteItems();
                };

                $scope.deletePermanentBtnClicked = function() {
                    buttonOperations.deleteItemsPermanent();
                };

                $scope.downloadFileBtnClicked = function() {
                    buttonOperations.downloadFile();
                };

                $scope.permissionsBtnClicked = function() {
                    buttonOperations.permissions();
                };

                var input = document.getElementById("fileinput");
                input.addEventListener('change',
                    function(e) {
                        buttonOperations.uploadFile(e.target.files);
                    });
            }
        ]);
})()