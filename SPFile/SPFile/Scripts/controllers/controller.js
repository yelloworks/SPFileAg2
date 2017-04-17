(function () {

    angular.module('Abs', ['ngAnimate', 'ngSanitize', 'ui.bootstrap', 'TreeWidget', 'ngTouch', 'ui.grid', 'ngSelectable']);

//TreeCtrl not neded
   /* angular.module('Abs')
        .controller('TreeController',
        [
            '$scope', function($scope) {

                function init() {
                    $scope.treeNodes = [
                        {
                            name: "My Files",
                            image: "app/images/disk.png",
                            children: [
                                {
                                    name: "Music",
                                    children: [
                                        {
                                            name: "Rock",
                                            image: "app/images/rock.png",
                                            children: [
                                                {
                                                    name: "The Eagles - Hotel California",
                                                    image: "app/images/music-20.png"
                                                },
                                                { name: "Ozzy Osbourne - Dreamer", image: "app/images/music-20.png" }
                                            ]
                                        },
                                        {
                                            name: "Jazz",
                                            image: "app/images/jazz.png",
                                            children: [
                                                {
                                                    name: "Ray Charles - Hit the road Jack! ",
                                                    image: "app/images/music-20.png"
                                                },
                                                {
                                                    name: "Louis Prima - Just A Gigolo",
                                                    image: "app/images/music-20.png"
                                                }
                                            ]
                                        }
                                    ]
                                },
                                {
                                    name: "Movies",
                                    children: [
                                        { name: "Gladiator", image: "app/images/movie.png" },
                                        { name: "The Shawshank Redemption", image: "app/images/movie.png" },
                                    ]
                                },
                                {
                                    name: "Photos",
                                    children: [
                                        {
                                            name: "Sea",
                                            image: "app/images/sea.png",
                                            children: [
                                                { name: "image 1.jpg", image: "app/images/sea_img.png" },
                                                { name: "image 4.png", image: "app/images/sea_img.png" }
                                            ]
                                        },
                                        {
                                            name: "Mountains",
                                            image: "app/images/mountain.png",
                                            children: [
                                                { name: "image 1.jpg", image: "app/images/mountain_img.png" }
                                            ]
                                        }
                                    ]
                                },
                                {
                                    name: "My Files",
                                    children: [
                                        {
                                            name: "Angular books",
                                            children: [
                                                { name: "Pro AngularJS", image: "app/images/pdf.png" },
                                                { name: "AngularJS: Up and Running", image: "app/images/pdf.png" },
                                            ]
                                        }, {
                                            name: "Work",
                                            children: [
                                                {
                                                    name: "Lost presentation",
                                                    image: "app/images/ppt.png",
                                                    disabled: true
                                                },
                                                { name: "Requirements", image: "app/images/word.png" },
                                                { name: "TODO list" },
                                                { name: "Finances", image: "app/images/excel.png" },
                                            ]
                                        },
                                    ]
                                }
                            ]
                        }
                    ];

                    $scope.basicTree = [
                        {
                            name: "Node 1",
                            children: [{ name: "Node 1.1", children: [{ name: "Node 1.1.1" }, { name: "Node 1.1.2" }] }]
                        },
                        { name: "Node 2", children: [{ name: "Node 2.1" }, { name: "Node 2.2" }] }
                    ]

                    $scope.customImagesTree = [
                        {
                            name: "My Files",
                            image: "app/images/disk.png",
                            children: [
                                { name: "Pro AngularJS", image: "app/images/pdf.png" },
                                { name: "Presentation", image: "app/images/ppt.png" },
                                { name: "Requirements", image: "app/images/word.png" }, { name: "TODO list" }
                            ]
                        }
                    ];

                    $scope.disabledNodes = [
                        {
                            name: "My Files",
                            disabled: true,
                            children: [
                                {
                                    name: "Angular books",
                                    children: [
                                        { name: "Pro AngularJS", image: "app/images/pdf.png" },
                                        { name: "AngularJS: Up and Running", image: "app/images/pdf.png" },
                                    ]
                                }, {
                                    name: "Work",
                                    disabled: true,
                                    children: [
                                        { name: "Presentation", image: "app/images/ppt.png", disabled: true },
                                        { name: "Requirements", image: "app/images/word.png" },
                                        { name: "TODO list", disabled: true }
                                    ]
                                }
                            ]
                        }
                    ];
                }


                init();

            }
        ]);
*/


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

                $scope.blockedButtons = function () {
                    $scope.disabledButtons.lock = true;
                    $scope.disabledButtons.unlock = true;
                    $scope.disabledButtons.editMetadata = true;
                    $scope.disabledButtons.permissions = true;
                    $scope.disabledButtons.download = true;
                    $scope.disabledButtons.upload = true;
                };
            });

    angular.module('Abs')
        .controller('RibbonButtonsCtrl',
            ['$scope', 'selectedBufferService', 'bufferService', '$log', 'fileOperations', '$uibModal', 'loadOperations', function ($scope, selectedBufferService, bufferService, $log, fileOperations, $uibModal, checkOperations, loadOperations) {

                $scope.copyBtnClicked = function() {
                    bufferService.setBuffer(selectedBufferService.getBuffer(),
                        selectedBufferService.getUrl(),
                        selectedBufferService.getlistID(),
                        selectedBufferService.getRelativeUrl(),
                        false);
                };

                $scope.pasteBtnClicked = function() {
                    var sourceItems = bufferService.getFBuffer();
                    var sourceUrl = bufferService.getFUrl();
                    var sourceListId = bufferService.getFListId();
                    var sourceRelativeUrl = bufferService.getFRelativeUrl();
                    var isCuted = bufferService.isCuted();
                    var destinationUrl = selectedBufferService.getRelativeUrl(); // нужно как то его получить
                    var destinationListId = selectedBufferService.getlistID();
                    if (sourceItems[0].length != 0) {
                        sourceItems[0].forEach(function (item, i, arr) {
                            fileOperations.CopyOrMove(sourceUrl, sourceListId, sourceRelativeUrl, item.ID, destinationUrl, destinationListId, item.type, item.name, isCuted);
                        });
                        
                    }
                };

                $scope.cutBtnClicked = function() { 
                    bufferService.setBuffer(selectedBufferService.getBuffer(), selectedBufferService.getUrl(), selectedBufferService.getlistID(), selectedBufferService.getRelativeUrl(), false);
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
                        var it = selectedBufferService.getRelativeUrl().split('/');
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

                    if (sourceItems[0].length != 0) {
                        sourceItems[0].forEach(function (item, i, arr) {
                            checkOperations.undoCheckOut(sourceUrl, sourceListId, sourceRelativeUrl, item.ID, item.type);

                        });

                    }
                };

                $scope.deleteBtnClicked = function() {
                    deleteForEachSelected(fileOperations.deleteItem);
                };

                $scope.deletePermanentBtnClicked = function() {
                    deleteForEachSelected(fileOperations.deleteItemToRecycle);
                };

                function deleteForEachSelected(method) {
                    var sourceItems = selectedBufferService.getBuffer();
                    var sourceUrl = selectedBufferService.getUrl();
                    var sourceListId = selectedBufferService.getlistID();

                    if (sourceItems[0].length != 0) {
                        sourceItems[0].forEach(function (item, i, arr) {
                            method(sourceUrl, sourceListId, item.ID);

                        });

                    }
                }

                $scope.downloadFileBtnClicked = function () {
                    var sourceItems = selectedBufferService.getBuffer();
                    var sourceUrl = selectedBufferService.getRelativeUrl(); // нужно как то его получить
                    var sourceListId = selectedBufferService.getlistID();
                    if (sourceItems[0].length != 0) {
                        sourceItems[0].forEach(function (item, i, arr) {
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

            }]);

    angular.module('Abs')
        .controller('ModalInstanceCtrl',
            function($uibModalInstance) {
                var $ctrl = this;
                $ctrl.text = "New Folder";
                $ctrl.ok = function() {
                    $uibModalInstance.close($ctrl.text);
                };
                $ctrl.cancel = function() {
                    $uibModalInstance.dismiss('cancel');
                };
            });

    angular.module('Abs')
        .controller('DropdownCtrl',
            function($scope, $log) {

                $scope.status = {
                    isopen: false
                };

                $scope.toggleDropdown = function($event) {
                    $event.preventDefault();
                    $event.stopPropagation();
                    $scope.status.isopen = !$scope.status.isopen;
                };

                $scope.appendToEl = angular.element(document.querySelector('#dropdown-long-content'));
            });

    angular.module('Abs')
        .controller('tabsCtrl',
            function($scope, $window,$timeout, $q) {
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
                        .then(function(relSiteUrl) {
                            $scope.tabs.push({
                                title: folderName,
                                url: url,
                                listId: listId,
                                relativeUrl: relativeUrl,
                                relativeSiteUrl: relSiteUrl
                            });
                            $timeout(function() {
                                $scope.activeTab = $scope.tabs.length - 1;
                            });
                        });
                };

                $scope.addWorkspace = function () {

                    var url = window.location.protocol +
                        "//" +
                        window.location.host +
                        _spPageContextInfo.siteServerRelativeUrl;

                    addNewWorkspace(url, "","", "root");
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

                $scope.doubleClick = function() {

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
                        $scope.selected = [];
                        $scope.adressArray = getAdressArray();
                        selectedBufferService.addToBuffer($scope.selected,
                            $scope.tabs[$scope.index].listId,
                            $scope.tabs[$scope.index].url,
                            $scope.tabs[$scope.index].relativeUrl);
                    };
                };

                var getRelativeUrlString = function(parts) {
                    var outItem = "";
                    parts.forEach(function(item, i, arr) {
                        outItem += "/" +item;
                    });
                    return outItem;
                };
               
                function getAdressArray() {
                    var arr = [];
                    arr.push("root");
                    if ($scope.tabs[$scope.index].relativeUrl != "") {
                        var tmp = $scope.tabs[$scope.index].relativeUrl.split('/').slice(1);
                        arr = arr.concat(tmp);
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
                        $scope.fileItems = [];
                        $scope.tabs[$scope.index].listId = "";
                        $scope.tabs[$scope.index].title = "root";
                        $scope.tabs[$scope.index].relativeUrl = "";
                        $scope.upBtndisabled = true;
                        $scope.getLibrariesOnly();
                    }
                    selectedBufferService.addToBuffer($scope.selected, $scope.tabs[$scope.index].listId, $scope.tabs[$scope.index].url, $scope.tabs[$scope.index].relativeUrl);
                    $scope.adressArray = getAdressArray();
            };


                $scope.selectionStart = function() {
                    $scope.log.push(($scope.log.length + 1) + ': selection start!');
                };
                $scope.selectionStop = function (selected) {
                    selectedBufferService.addToBuffer(selected, $scope.tabs[$scope.index].listId, $scope.tabs[$scope.index].url, $scope.tabs[$scope.index].relativeUrl);
                    $scope.log.push(($scope.log.length + 1) + ': items selected: ' + selected.length);
                };
                $scope.onStart = function($index) {
                    $scope.index = $index;
                    $scope.adressArray = getAdressArray();
                    var arrayPath = $scope.tabs[$scope.index].relativeUrl.split('/');
                    if (arrayPath.length > 2) {
                        $scope.getDir();
                    } else {
                        $scope.upBtndisabled = true;
                        $scope.getLibrariesOnly();
                    }
                    selectedBufferService.addToBuffer($scope.selected, $scope.tabs[$scope.index].listId, $scope.tabs[$scope.index].url, $scope.tabs[$scope.index].relativeUrl);


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

                $scope.$on('selectedEvent', function(event, args) {
                    if (args == $scope.index) {
                        selectedBufferService.addToBuffer($scope.selected,
                            $scope.tabs[$scope.index].listId,
                            $scope.tabs[$scope.index].url,
                            $scope.tabs[$scope.index].relativeUrl);
                        if ($scope.tabs[$scope.index].listId != "") {
                            $scope.setAllButtonsEnabled();
                        } else {
                            $scope.setAllButtonsDisabled();
                        };
                    };
                });


            }]);


    //Servisies
    angular.module('Abs')
        .factory('bufferService',
            function() {
                var methods = {};

                var buffer = [];
                var url = "";
                var listId = '';
                var relativeUrl = '';
                var cuted = false; 

                methods.addToBuffer = function(item) {
                    buffer = [];
                    buffer.push(item);
                };
                methods.setBuffer = function (item, fullUrl, lstId, relUrl, cutStat) {
                    buffer = [];
                    buffer = item;
                    url = fullUrl;
                    listId = lstId;
                    relativeUrl = relUrl;
                    cuted = cutStat;
                }

                methods.getFBuffer = function() {
                    return buffer;
                };
                methods.getFUrl = function() {
                    return url;
                };
                methods.getFListId = function() {
                    return listId;
                };
                methods.getFRelativeUrl = function() {
                    return relativeUrl;
                };
                methods.isCuted = function() {
                    return cuted;
                }
                return methods;
            });

    angular.module('Abs')
    .factory('selectedBufferService',
        function () {
            var methods = {};

            var selectedUrl = "";
            var selectedItemsBuffer = [];
            var selectedListId = "";
            var selectedRelativeUrl = "";

            methods.addToBuffer = function (bufferItems, bufferListId, bufferUrl, bufferRelativeUrl) {
                selectedItemsBuffer = [];
                selectedListId = "";
                selectedUrl = "";

                selectedUrl = bufferUrl;
                selectedListId = bufferListId;
                selectedItemsBuffer.push(bufferItems);
                selectedRelativeUrl = bufferRelativeUrl;
            };
            methods.getBuffer = function () {
                return selectedItemsBuffer;
            };
            methods.getlistID = function () {
                return selectedListId;
            };
            methods.getUrl = function() {
                return selectedUrl;
            };
            methods.getRelativeUrl = function() {
                return selectedRelativeUrl;
            };

            return methods;
        });


    angular.module('Abs')
        .factory('fileOperations',
        function ($q, $log) {
        var methods = {};

        var url = "";


        methods.CopyOrMove = function (itemUrl, sourceListId, sourceRelativeUrl, soutceItemId, destRelativeUrl, destListId, objectType, itemName, moveItem) {
            url = itemUrl;
            if (url.charAt(url.length - 1) == '/') {
                url = url.slice(0,-1);
            }
            var listId = sourceListId;
            //relativeUrl = removeFirstSlash(sourceRelativeUrl);
            var destenationListId = destListId;//'{e9af8f1f-dc7c-4869-ba66-77daa1080c33}'; //временно нацелен на temp         
            var destenationRelUrl = removeFirstSlash(destRelativeUrl); //"temp/";

           // moveItem = move;
            if (objectType == 0) {
                copyOrMoveFile(soutceItemId, destenationRelUrl, listId, moveItem);
            } else {
                copyOrMoveFolder(listId, removeFirstSlash(sourceRelativeUrl) + "/" + itemName, destenationListId, destenationRelUrl, soutceItemId, moveItem);
            }
        };

        function copyOrMoveFolder(listId, relativeUrl, destenationListId, destenationRelUrl,folderId, move) {
            var deferred = $q.defer();
                var ctx = new SP.ClientContext(url);
                var oLibDocs = ctx.get_web().get_lists().getById(listId);
                var caml = SP.CamlQuery.createAllItemsQuery();
                caml.set_viewXml("<View Scope='RecursiveAll'><Query><Where><Eq><FieldRef Name='FSObjType' /><Value Type='Integer'>0</Value></Eq></Where></Query></View>");
                caml.set_folderServerRelativeUrl(relativeUrl);
                var allDocumentsCol = oLibDocs.getItems(caml);
                ctx.load(allDocumentsCol, "Include(FileLeafRef, ServerUrl, FSObjType, FileRef, FileDirRef, ID, GUID )");
                ctx.executeQueryAsync(function(sender, args) {
                    var listEnumerator = allDocumentsCol.getEnumerator();
                        var fileListInfo = [];
                        while (listEnumerator.moveNext()) {
                            var currentItem = listEnumerator.get_current();
                            var currentItemFileDirRef = currentItem.get_item('FileDirRef');
                            var currentItemId = currentItem.get_item('ID');
                            var tmpPath = relativeUrl.split('/');
                            var cutPath = "/" + tmpPath.slice(0, tmpPath.length - 1).join('/') + "/";
                            var relUrlArray = destenationRelUrl.split('/');
                            var destUrl = relUrlArray.slice(1, relUrlArray.length).join('/');
                            var newFolder = destUrl + '/' + currentItemFileDirRef.replace(cutPath, "");
                            newFolder = removeFirstSlash(newFolder);
                            fileListInfo.push({
                                "destenationListId": destenationListId,
                                "newFolder": newFolder,
                                "currentItemId": currentItemId,
                                "destenationRelUrl": destenationRelUrl,
                                "listId": listId,
                                "move": move
                            });

                        }
                        asyncCopyFolder(fileListInfo).finally(function() {
                            if (move) {
                                 methods.deleteItem(url, listId, folderId);
                            };
                        });

                    },
                    function(sender, args) {
                        alert("failed. Message:" + args.get_message());
                    });
                return deferred.promise;
        }

        function asyncCopyFolder(files) {
            var promises = files.map(function(file) {
                var defered = $q.defer();
                createFolder(file.destenationListId,
                        file.newFolder,
                        function(folder) {
                            $log.log(String.format("Folder '{0}' has been created", folder.get_name()));
                        },
                        function(sender, args) {
                            $log.log(args.get_message());
                        },
                        file.currentItemId,
                        file.destenationRelUrl)
                    .then(function(args) {
                        copyOrMoveFile(args[0], args[1] + "/" + args[2], file.listId, file.move). then(function() {
                            defered.resolve();
                        }); 
                    });
                return defered.promise;
            });
            return $q.all(promises);

        }

        function createFolder (listId, folderUrl, success, error, currentItemId, destenationRelUrl) {
            var deferred = $q.defer();
            var ctx = new SP.ClientContext(url);
            var list = ctx.get_web().get_lists().getById(listId);
            var rootFolder = list.get_rootFolder();
            ctx.load(rootFolder);
            var createFolderInternal = function (parentFolder, folderUrl, success, error) {
                var ctx = parentFolder.get_context();
                var curFolder = parentFolder;
                var folderNames = folderUrl.split('/');
                folderNames.forEach(function (item, i, arr) {
                    curFolder = curFolder.get_folders().add(folderNames[i]);
                });
                ctx.load(curFolder);
                ctx.executeQueryAsync(
                        function () {
                            success(curFolder);                         
                            var args = [currentItemId, removeFirstSlash(rootFolder.get_serverRelativeUrl()), folderUrl];
                            deferred.resolve(args);
                        },
                        function (sender, args) {
                            error(sender, args);
                            deferred.reject(sender, args);
                        }
                    );
            };
            createFolderInternal(list.get_rootFolder(), folderUrl, success, error);
            return deferred.promise;
        };

        function copyOrMoveFile(fileId, destanationPath, listId, moveItem) {
            var deferred = $q.defer();
            var ctx = new SP.ClientContext(url);
            var web = ctx.get_web();
            var currentLib = web.get_lists().getById(listId);
            var item = currentLib.getItemById(fileId);
            var file = item.get_file();
            ctx.load(file);
            ctx.executeQueryAsync(
                function (sender, args) {
                    if (file != null) {
                        var destFileUrl = url +"/"+ destanationPath + '/' + file.get_name();
                        moveItem
                            ? file.moveTo(destFileUrl, SP.MoveOperations.overwrite)
                            : file.copyTo(destFileUrl, SP.MoveOperations.overwrite);
                        ////для идиота, тут копирование выше перемещение

                        ctx.executeQueryAsync(
                            function (sender, args) {
                                $log.log("File copied.");
                                deferred.resolve();
                            },
                            function (sender, args) {
                                alert("Error copying the file.");
                                deferred.reject(sender, args);
                            }
                        );
                    } else {
                        alert("404 FILE NOT FOUND!!!");
                        deferred.reject(sender, args);
                    }
                },
                function (sender, args) {
                    alert("Error while getting the file.");
                    deferred.reject(sender, args);
                }
            );
            return deferred.promise;
        }

        methods.createNewFolder = function(itemUrl, destListId, folderUrl) {
                url = itemUrl;
                createFolder(destListId,
                    folderUrl,
                    function(folder) {
                        $log.log(String.format("Folder '{0}' has been created", folder.get_name()));
                    },
                    function(sender, args) {
                        $log.log(args.get_message());
                    },
                    "",
                    "");
            };

        function removeFirstSlash(item) {
            var curItem = item;
            if (curItem.charAt(0) == '/') { //можно while но не уверен нужно ли
                curItem = curItem.substr(1);
            }
            return curItem;
        };

        methods.deleteItem = function (itemUrl, itemListId, itemId) {
            var ctx = new SP.ClientContext(itemUrl);
            var list = ctx.get_web().get_lists().getById(itemListId);
            var item = list.getItemById(itemId);
            item.deleteObject();
            ctx.executeQueryAsync(
                function () {
                    $log.log("delete success");
                },
                function (sender, args) {
                    $log.log(args.get_message());
                }
            );

        }
        methods.deleteItemToRecycle = function (itemUrl, itemListId, itemId) {
            var ctx = new SP.ClientContext(itemUrl);
            var list = ctx.get_web().get_lists().getById(itemListId);
            var item = list.getItemById(itemId);
            item.recycle();
            ctx.executeQueryAsync(
                function () {
                    $log.log("delete success");
                },
                function (sender, args) {
                    $log.log(args.get_message());
                }
            );

        }

            return methods;
        });

    angular.module('Abs')
        .factory('checkOperations',
            function($scope, $log) {
                var methods = {};

                methods.checkIn = function (url, listId, relativeUrl, itemId, objectType) {

                    if (objectType == 0) {
                        checkInFile(url, listId, itemId);
                    } else {
                        folderOperation(url, listId, relativeUrl, checkInFile);
                    }
                }
                methods.checkOut = function (url, listId, relativeUrl, itemId, objectType) {
                    if (objectType == 0) {
                        checkOutFile(url, listId, itemId);
                    } else {
                        folderOperation(url, listId, relativeUrl, checkOutFile);
                    }
                }
                methods.undoCheckOut = function(url, listId, relativeUrl, itemId, objectType) {
                    if (objectType == 0) {
                        undoCheckOutFile(url, listId, itemId);
                    } else {
                        folderOperation(url, listId, relativeUrl, undoCheckOutFile);
                    }
                }

                function folderOperation(url, listId, relativeUrl, action) {
                    var ctx = new SP.ClientContext(url);
                    var list = ctx.get_web().get_lists().getById(listId);
                    var caml = SP.CamlQuery.createAllItemsQuery();
                    var allDocumentsCol = "";
                    caml.set_viewXml("<View Scope='RecursiveAll'><Query><Where><Eq><FieldRef Name='FSObjType' /><Value Type='Integer'>0</Value></Eq></Where></Query></View>");
                    caml.set_folderServerRelativeUrl(relativeUrl);
                    allDocumentsCol = list.getItems(caml);
                    ctx.load(allDocumentsCol, "Include(FileLeafRef, ServerUrl, FSObjType, FileRef, FileDirRef, ID, GUID )");
                    ctx.executeQueryAsync(function (sender, args) {
                        var listEnumerator = allDocumentsCol.getEnumerator();
                        while (listEnumerator.moveNext()) {
                            var currentItem = listEnumerator.get_current();
                            action(url, listId, currentItem.get_item('ID'));
                        }
                    },
                        function () {
                            $log.log("Get FILES ERRRORR");
                        });
                }

                function checkInFile(url, listId, itemId) {
                    var ctx = new SP.ClientContext(url);
                    var list = ctx.get_web().get_lists().getById(listId);
                    var item = list.getItemById(itemId);
                    var test = Microsoft.Office.RecordsManagement.RecordsRepository.Records.IsRecord(item);
                    var file = item.get_file();
                    var listItem = file.get_listItemAllFields();
                    listItem.update();
                    file.checkIn("Text");
                    file.publish();
                    ctx.executeQueryAsync(function (sender, args) {
                        //  var value = list.get_enableVersioning();
                        $log.log("file checkedIn");
                        // $log.log(value);    
                    },
                        function (sender, args) {
                            $log.log(args.get_message());
                            // var value = list.get_enableVersioning();
                            // $log.log(value);
                        });
                }

                function checkOutFile(url, listId, itemId) {
                    var ctx = new SP.ClientContext(url);
                    var list = ctx.get_web().get_lists().getById(listId);
                    var item = list.getItemById(itemId);
                    var file = item.get_file();
                    file.checkOut();
                    ctx.executeQueryAsync(function (sender, args) {
                        $log.log(name.get_loginName());
                        $log.log("file checkedOut");
                    },
                        function (sender, args) {
                            $log.log(args.get_message());
                        });

                }

                function undoCheckOutFile(url, listId, itemId) {
                    var ctx = new SP.ClientContext(url);
                    var list = ctx.get_web().get_lists().getById(listId);
                    var item = list.getItemById(itemId);
                    var file = item.get_file();
                    var name = file.get_checkedOutByUser();
                    ctx.load(name);
                    $log.log(name);
                    ctx.executeQueryAsync(function (sender, args) {
                        $log.log(name.get_loginName());
                        file.undoCheckOut();
                        $log.log("file undoCheckOut");
                        ctx.executeQueryAsync(function () { }, function (sender, args) { $log.log(args.get_message()); });
                    },
                        function (sender, args) {
                            $log.log(args.get_message());
                        });
                }

                ///Пока не нужен но вполне готов
                function checkInListCheking(url, listId) {
                    var deferred = $q.defer();
                    var ctx = new SP.ClientContext(url);
                    var list = ctx.get_web().get_lists().getById(listId);
                    ctx.load(list);
                    ctx.executeQueryAsync(function (sender, args) {
                        var value = list.get_enableVersioning();
                        if (!value) {
                            list.set_enableVersioning(true);
                            list.set_enableMinorVersions(true);
                            list.update();
                            ctx.load(list);
                            ctx.executeQueryAsync(function (sender, args) {
                                $log.log("Done");
                                deferred.resolve();
                            },
                                function (sender, args) {
                                    $log.log(args.get_message());
                                    deferred.reject();
                                });
                        } else {
                            deferred.resolve();
                        }
                    },
                        function (sender, args) {

                        });
                    return deferred.promise;
                }

                //Проверка на чекин документа
                function getFileStatus(url, listId, itemId) {
                    var ctx = new SP.ClientContext(url);
                    var list = ctx.get_web().get_lists().getById(listId);
                    var item = list.getItemById(itemId);
                    var file = item.get_file();
                    ctx.load(file);
                    ctx.executeQueryAsync(function () {
                        $log.log(file.get_checkOutType());
                    }, function (sender, args) { $log.log(args.get_message()) });
                }

                return methods;
            });

    angular.module('Abs').factory('loadOperations', function($scope, $log) {
        var methods = {};

        methods.downloadSingleFile = function (url, listId, itemId) {
            var ctx = new SP.ClientContext(url);
            var list = ctx.get_web().get_lists().getById(listId);
            var item = list.getItemById(itemId);
            var file = item.get_file();
            ctx.load(file);
            ctx.executeQueryAsync(function (sender, args) {
                var path = file.get_serverRelativeUrl();
                $log.log(path);
                $log.log(url + path);
                window.location.href = "/_layouts/download.aspx?SourceUrl=" + url + path;
            },
                function (sender, args) {
                    $log.log(args.get_message());

                });

        };

        methods.uploadSingleFile = function(files, url, listId, targetRelUrl) {

            for (var i = 0; i < files.length; i++) {
                upload(input.files[i], url, listId, targetRelUrl);
            }
        }

        function upload(file, url, listId, targetRelUrl) {
            var fr = new FileReader();
            fr.onload = function () {
                var clientContext = new SP.ClientContext(url);
                var web = clientContext.get_web();
                var list = web.get_lists().getById(listId);

                var fileCreateInfo = new SP.FileCreationInformation();
                fileCreateInfo.set_url(file.name);
                fileCreateInfo.set_overwrite(true);
                fileCreateInfo.set_content(new SP.Base64EncodedByteArray());

                var arr = convertDataURIToBinary(fr.result);
                for (var i = 0; i < arr.length; ++i) {
                    fileCreateInfo.get_content().append(arr[i]);
                }

                if (targetRelUrl != "") {
                    /* fr.newFile = list.getItemById(targetItemId).get_folder().get_files().add(fileCreateInfo);*/
                    fr.newFile = web.getFolderByServerRelativeUrl(targetRelUrl).get_files().add(fileCreateInfo);
                } else {
                    fr.newFile = list.get_rootFolder().get_files().add(fileCreateInfo);
                };

                clientContext.load(fr.newFile);
                clientContext.executeQueryAsync(function () { $log.log("Upload sucesess") }, function (sender, args) { $log.log(args.get_message()) });
            };
            fr.readAsDataURL(file);         
        };

 
        function convertDataUriToBinary(dataUri) {
            var BASE64_MARKER = ';base64,';
            var base64Index = dataUri.indexOf(BASE64_MARKER) + BASE64_MARKER.length;
            var base64 = dataUri.substring(base64Index);
            var raw = window.atob(base64);
            var rawLength = raw.length;
            var array = new Uint8Array(new ArrayBuffer(rawLength));

            for (var i = 0; i < rawLength; i++) {
                array[i] = raw.charCodeAt(i);
            }
            return array;
        }

        return methods;
    });

})()