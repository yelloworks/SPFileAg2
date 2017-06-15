(function () {
    angular.module('Abs')
    .controller('DropdownCtrl',
        function ($scope, $log) {

            $scope.status = {
                isopen: false
            };

            $scope.toggleDropdown = function ($event) {
                $event.preventDefault();
                $event.stopPropagation();
                $scope.status.isopen = !$scope.status.isopen;
            };

            $scope.appendToEl = angular.element(document.querySelector('#dropdown-long-content'));
        });

    angular.module('Abs')
        .controller('tabsCtrl',
            function ($scope, $window, $timeout, $q) {
                $scope.tabs = [

                ];
                $scope.activeTab = 0;


                /* $scope.alertMe = function() {
                     setTimeout(function() {
                         $window.alert('You\'ve selected the alert tab!');
                     });
                 };*/
                $scope.model = {
                    name: 'Tabs'
                };

                $scope.onSelection = function ($index) {
                    $scope.$broadcast('selectedEvent', $index);
                };


                function getSiteRootUrl(url) {
                    var deferred = $q.defer();
                    var ctx = new SP.ClientContext(url);
                    var web = ctx.get_web();
                    ctx.load(web);
                    ctx.executeQueryAsync(function (sender, args) {
                        deferred.resolve(web.get_serverRelativeUrl());
                    }, function (sender, args) {
                        deferred.reject(sender, args);
                    });
                    return deferred.promise;
                };


                var addNewWorkspace = function (url, listId, relativeUrl, folderName) {
                    getSiteRootUrl(url)
                        .then(function (relSiteUrl) {
                            $scope.tabs.push({
                                title: folderName,
                                url: url,
                                listId: listId,
                                relativeUrl: relativeUrl,
                                relativeSiteUrl: relSiteUrl
                            });
                            $timeout(function () {
                                $scope.activeTab = $scope.tabs.length - 1;
                            });
                        });
                };

                $scope.addWorkspace = function () {

                    var url = window.location.protocol +
                        "//" +
                        window.location.host +
                        _spPageContextInfo.siteServerRelativeUrl;

                    addNewWorkspace(url, "", "", "root");
                };

                $scope.removeTab = function (index, event) {
                    event.preventDefault();
                    $scope.tabs.splice(index, 1);
                };


                $scope.$on('pageInit', function (event, url, listId, relativeUrl, folderName) {
                    addNewWorkspace(url, listId, relativeUrl, folderName);
                });


            });

    angular
        .module('Abs')
        .controller('tabContentController',
            ['$scope', 'selectedBufferService', function ($scope, selectedBufferService) {
                $scope.selection = true;
                $scope.selected = [];
                $scope.log = [];
                $scope.index = "";
                $scope.fileItems = [];
                $scope.upBtndisabled = false;
                $scope.adressArray = [];

                $scope.doubleClick = function () {

                    var item = $scope.selected[0];
                    //Not rewrite, no sence
                    // var url = $scope.tabs[$scope.index].url;
                    if (item.type != 0) {
                        $scope.fileItems = [];
                        $scope.upBtndisabled = false;
                        $scope.tabs[$scope.index].title = item.name;
                        $scope.tabs[$scope.index].relativeUrl = item.FileRef;
                        if ($scope.tabs[$scope.index].listId == "") {
                            $scope.tabs[$scope.index].listId = item.libraryID;
                        }
                        $scope.getDir();
                        setSelectedAndAdress();
                    };
                };

                var getRelativeUrlString = function (parts) {
                    var outItem = "";
                    parts.forEach(function (item, i, arr) {
                        outItem += "/" + item;
                    });
                    return outItem;
                };

                function getAdressArray() {
                    var arr = [];
                    arr.push("root");
                    if ($scope.tabs[$scope.index].relativeUrl != "") {
                        var clearString = $scope.tabs[$scope.index].relativeUrl.replace($scope.tabs[$scope.index].relativeSiteUrl, "");
                        var noEmpty = clearString.split('/').slice(1);
                        arr = arr.concat(noEmpty);
                    }
                    return arr;
                }
                $scope.getLibrariesOnly = function () {
                    $scope.setAllButtonsDisabled();
                    var url = $scope.tabs[$scope.index].url;
                    var currentcontext = new SP.ClientContext(url);
                    var currentweb = currentcontext.get_web();
                    $scope.listCollection = currentweb.get_lists();
                    currentcontext.load($scope.listCollection, 'Include(RootFolder, BaseTemplate, Title, Id)');
                    currentcontext.executeQueryAsync(Function.createDelegate($scope, librariesExecuteOnSuccess),
                        Function.createDelegate($scope, librariiesExecuteOnFailure));
                }

                function librariesExecuteOnSuccess(sender, args) {
                    var listEnumerator = $scope.listCollection.getEnumerator();
                    var allLibs = "";
                    while (listEnumerator.moveNext()) {
                        var list = listEnumerator.get_current();

                        if (list.get_baseTemplate() == '101') {
                            $scope.fileItems.push({
                                "name": list.get_title(),
                                "FileRef": list.get_rootFolder().get_serverRelativeUrl(), //"\\" +
                                "libraryID": "{" + list.get_id() + "}"
                            });
                        }
                    }
                    $scope.$apply();
                    // alert("All Libraries" + '\n' + allLibs);
                }
                function librariiesExecuteOnFailure(sender, args) {
                    alert("Error in Getting Lists");
                }

                ///Переделать, вынести большую част операции в рожд контроллер, тут только проверку правильности оставить

                $scope.upBtnClicked = function () {
                    var siteRelativeUrl = "";
                    if ($scope.tabs[$scope.index].relativeSiteUrl != '/') {
                        siteRelativeUrl = $scope.tabs[$scope.index].relativeSiteUrl;
                    };
                    var arrayPath = $scope.tabs[$scope.index].relativeUrl.replace(siteRelativeUrl).split('/');
                    if (arrayPath.length > 2) {
                        var newRelativeUrl = getRelativeUrlString(arrayPath.slice(1, arrayPath.length - 1));
                        $scope.tabs[$scope.index].title = arrayPath.slice(arrayPath.length - 2)[0];
                        $scope.tabs[$scope.index].relativeUrl = siteRelativeUrl + newRelativeUrl;
                        $scope.fileItems = [];
                        $scope.getDir();

                    } else {
                        viewLibrary();
                    }
                    setSelectedAndAdress();
                };

                function viewLibrary() {
                    $scope.fileItems = [];
                    $scope.tabs[$scope.index].listId = "";
                    $scope.tabs[$scope.index].title = "root";
                    $scope.tabs[$scope.index].relativeUrl = "";
                    $scope.upBtndisabled = true;
                    $scope.getLibrariesOnly();
                }
                function setSelectedAndAdress() {
                    $scope.selected = [];
                    selectedBufferService.setSelected($scope.selected, $scope.tabs[$scope.index]);
                    $scope.adressArray = getAdressArray();
                };

                function getClearRelativeSiteUrlArray() {
                    return $scope.tabs[$scope.index].relativeSiteUrl.split("/").slice(1);
                };

                $scope.adressItemClicked = function (index) {
                    if (index != 0) {
                        var pathPart = $scope.adressArray.slice(1, index + 1);
                        var newPath = getClearRelativeSiteUrlArray().concat(pathPart);
                        $scope.tabs[$scope.index].relativeUrl = getRelativeUrlString(newPath);
                        $scope.tabs[$scope.index].title = newPath.slice(newPath.length - 1)[0];
                        $scope.fileItems = [];
                        $scope.getDir();
                    } else {
                        viewLibrary();
                    }
                    setSelectedAndAdress();
                }


                $scope.refreshPage = function () {
                    var siteRelativeUrl = "";
                    if ($scope.tabs[$scope.index].relativeSiteUrl != '/') {
                        siteRelativeUrl = $scope.tabs[$scope.index].relativeSiteUrl;
                    };
                    var arrayPath = $scope.tabs[$scope.index].relativeUrl.replace(siteRelativeUrl).split('/');
                    if (arrayPath.length >= 2) {
                        $scope.fileItems = [];
                        $scope.getDir();

                    } else {
                        $scope.fileItems = [];
                        $scope.upBtndisabled = true;
                        $scope.getLibrariesOnly();
                    }
                    selectedBufferService.setSelected($scope.selected, $scope.tabs[$scope.index]);
                    $scope.adressArray = getAdressArray();
                };

                $scope.selectionStart = function () {
                    $scope.log.push(($scope.log.length + 1) + ': selection start!');
                };
                $scope.selectionStop = function (selected) {
                    selectedBufferService.setSelected(selected, $scope.tabs[$scope.index]);
                    $scope.log.push(($scope.log.length + 1) + ': items selected: ' + selected.length);
                };
                $scope.onStart = function ($index) {
                    $scope.index = $index;
                    $scope.adressArray = getAdressArray();
                    var arrayPath = $scope.tabs[$scope.index].relativeUrl.split('/');
                    if (arrayPath.length > 2) {
                        $scope.getDir();
                    } else {
                        $scope.upBtndisabled = true;
                        $scope.getLibrariesOnly();
                    }
                    selectedBufferService.setSelected($scope.selected, $scope.tabs[$scope.index]);


                };

                $scope.getDir = function documentQuery() {
                    $scope.setAllButtonsEnabled();
                    var ctx = new SP.ClientContext($scope.tabs[$scope.index].url);
                    var oLibDocs = ctx.get_web().get_lists().getById($scope.tabs[$scope.index].listId);
                    var caml = SP.CamlQuery.createAllItemsQuery();

                    caml.set_viewXml("<View Scope='All'><Query></Query></View>");
                    caml.set_folderServerRelativeUrl($scope.tabs[$scope.index].relativeUrl);
                    $scope.allDocumentsCol = oLibDocs.getItems(caml);
                    ctx.load($scope.allDocumentsCol, "Include(FileLeafRef, ServerUrl, FSObjType, FileRef, FileDirRef, ID, GUID )");
                    ctx.executeQueryAsync(Function.createDelegate($scope, $scope.succeeded),
                        Function.createDelegate($scope, $scope.failed));
                }


                $scope.succeeded = function onSucceededCallback(sender, args) {

                    var libList = "";
                    var ListEnumerator = $scope.allDocumentsCol.getEnumerator();
                    while (ListEnumerator.moveNext()) {
                        var currentItem = ListEnumerator.get_current();
                        var currentItemURL = _spPageContextInfo
                            .webServerRelativeUrl +
                            currentItem.get_item('ServerUrl');
                        var currentItemType = currentItem.get_item('FSObjType');

                        var currentItemFileRef = currentItem.get_item('FileRef');
                        var currentItemFileDirRef = currentItem.get_item('FileDirRef');

                        var currentItemID = currentItem.get_item('ID');
                        //var currentItemList = currentItem.get_item('List');

                        var currentItemGUID = currentItem.get_item('GUID');

                        libList += currentItem.get_item('FileLeafRef') + ' : ' + currentItemType + '\n';

                        var guid = currentItemGUID.toString("B");
                        $scope.fileItems.push(
                        {
                            "name": currentItem.get_item('FileLeafRef'),
                            "type": currentItemType,
                            "path": currentItemURL,
                            "FileRef": currentItemFileRef,
                            "FileDirRef": currentItemFileDirRef,
                            "GUID": guid,
                            "ID": currentItemID

                        });
                    }
                    $scope.$apply();
                }

                $scope.failed = function onFailedCallback(sender, args) {
                    $scope.fileItems = [];
                    $scope.tabs[$scope.index].listId = "";
                    $scope.tabs[$scope.index].title = "root";
                    $scope.tabs[$scope.index].relativeUrl = "";
                    $scope.upBtndisabled = true;
                    $scope.getLibrariesOnly();
                    alert("failed. Message:" + args.get_message());
                }

                $scope.$on('selectedEvent', function (event, args) {
                    if (args == $scope.index) {
                        selectedBufferService.setSelected($scope.selected, $scope.tabs[$scope.index]);
                        if ($scope.tabs[$scope.index].listId != "") {
                            $scope.setAllButtonsEnabled();
                        } else {
                            $scope.setAllButtonsDisabled();
                        };
                    };
                });


            }]);
})();
