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
        .controller('RibbonButtonsCtrl',
            ['$scope', 'selectedBufferService', 'bufferCtrl', function($scope,selectedBufferService,bufferCtrl ) {

                $scope.copyBtnClicked = function () {
                    bufferCtrl.setBuffer(selectedBufferService.getBuffer());
                };
                $scope.pasteBtnClicked = function() {

                };
                $scope.cutBtnClicked = function() { 

                };


                function copyOrMoveFile(url, fileId, sourceLibrary, destLibrary, moveFile) {
                    var ctx = new SP.ClientContext(url);
                    var web = ctx.get_web();
                    var currentLib = web.get_lists().getById(sourceLibrary);
                    //getListTitle(url, sourceLibrary);
                    var item = currentLib.getItemById(fileId);
                    var file = item.get_file();
                    ctx.load(currentLib);
                    ctx.load(file);
                    ctx.executeQueryAsync(
                        function (sender, args) {
                            if (file != null) {
                                // var webUrl = ctx.get_web().get_serverRelativeUrl();
                                var title = currentLib.get_title();
                                var destFileUrl = url + '/' + destLibrary + '/' + file.get_name();
                                moveFile
                                    ? file.moveTo(destFileUrl, SP.MoveOperations.overwrite)
                                    : file.copyTo(destFileUrl, SP.MoveOperations.overwrite);    ////для идиота, тут копирование выше перемещение

                                ctx.executeQueryAsync(
                                function (sender, args) {
                                    alert("File copied.");
                                },
                                    function (sender, args) {
                                        alert("Error copying the file.");
                                    }
                                 );
                            }
                            else {
                                alert("404 FILE NOT FOUND!!!");
                            }
                        },
                        function (sender, args) {
                            alert("Error while getting the file.");
                        }
                    );
                }


                function getListTitle(url, listId) {
                    var currentcontext = new SP.ClientContext(url);
                    var currentweb = currentcontext.get_web();
                    var listCollection = currentweb.get_lists().getById(listId);;
                    currentcontext.load(listCollection);
                    currentcontext.executeQueryAsync(function (sender, args) {
                        //var listEnumerator = listCollection.getEnumerator();
                        //var list = listEnumerator.get_current();
                        var title = listCollection.get_title();
                    },
                        function (sender, args) {

                        });
                };






            }]);

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
            function($scope, $window,$timeout) {
                $scope.tabs = [

                ];
                $scope.activeTab = 0;


                $scope.alertMe = function() {
                    setTimeout(function() {
                        $window.alert('You\'ve selected the alert tab!');
                    });
                };
                $scope.model = {
                    name: 'Tabs'
                };

                $scope.onSelection = function ($index) {

                    $scope.$broadcast('selectedEvent', $index);
                };

                var addNewWorkspace = function (url, listId, relativeUrl, folderName) {
                    $scope.tabs.push({
                        title: folderName,
                        url: url,
                        listId: listId,
                        relativeUrl: relativeUrl
                    });
                    $timeout(function () {
                        $scope.activeTab = $scope.tabs.length-1;
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

                $scope.doubleClick = function() {
                    //Tmp no check
                    var item = $scope.selected[0];
                    $scope.fileItems = [];

                    //Not rewrite, no sence
                   // var url = $scope.tabs[$scope.index].url;
                    $scope.upBtndisabled = false;
                    $scope.tabs[$scope.index].title = item.name;
                    $scope.tabs[$scope.index].relativeUrl = item.FileRef;
                    if ($scope.tabs[$scope.index].listId == "") {
                        $scope.tabs[$scope.index].listId = item.libraryID;
                    }
                    $scope.getDir();

                };

                var getRelativeUrlString = function(parts) {
                    var outItem = "";
                    parts.forEach(function(item, i, arr) {
                        outItem += "/" +item;
                    });
                    return outItem;
                };


                
                $scope.getLibrariesOnly = function () {
                    var url = $scope.tabs[$scope.index].url;
                    var currentcontext = new SP.ClientContext(url);
                    var currentweb = currentcontext.get_web();
                    $scope.listCollection = currentweb.get_lists();
                    currentcontext.load($scope.listCollection);
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
                                "FileRef": "\\" + list.get_title(),
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

                $scope.upBtnClicked = function() {
                    var arrayPath = $scope.tabs[$scope.index].relativeUrl.split('/');
                    if (arrayPath.length > 2) {
                        var newRelativeUrl = getRelativeUrlString(arrayPath.slice(1, arrayPath.length - 1));
                        $scope.tabs[$scope.index].title = arrayPath.slice(arrayPath.length - 2)[0];
                        $scope.tabs[$scope.index].relativeUrl = newRelativeUrl;
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
            };


                $scope.selectionStart = function() {
                    $scope.log.push(($scope.log.length + 1) + ': selection start!');
                };
                $scope.selectionStop = function (selected) {
                    selectedBufferService.addToBuffer(selected, "tmp");
                    $scope.log.push(($scope.log.length + 1) + ': items selected: ' + selected.length);
                };
                $scope.onStart = function($index) {
                    $scope.index = $index;

                    var arrayPath = $scope.tabs[$scope.index].relativeUrl.split('/');
                    if (arrayPath.length > 2) {
                        $scope.getDir();
                    } else {
                        $scope.upBtndisabled = true;
                        $scope.getLibrariesOnly();
                    }
                    //var listId = $scope.tabs[$scope.index].title;
                    //var url = $scope.tabs[$scope.index].url;
                    //var relativeUrl = $scope.tabs[$scope.index].relativeUrl;


                };


                $scope.getDir = function documentQuery() {
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
                        var currentItemGUID = currentItem.get_item('GUID');

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
                    alert("failed. Message:" + args.get_message());

                }

                $scope.$on('selectedEvent', function(event, args) {
                    if(args == $scope.index) {selectedBufferService.addToBuffer($scope.selected, "tmp")};
                });


            }]);

    //mainCtrl not needed
    /*angular.module('Abs')
        .controller('MainCtrl',
        [
            '$scope', function ($scope) {
                $scope.onstart = function () {
                    SP.SOD.executeFunc('SP.Runtime.js',
                        'SP.ClientContext',
                        function () {
                            SP.SOD.executeFunc('SP.js',
                                'SP.ClientContext',
                                function () {
                                    var ListId = GetUrlKeyValue("SPListId");
                                    var HostUrl = GetUrlKeyValue("SPHostUrl");
                                    var SiteUrl = GetUrlKeyValue("SPSiteUrl");
                                    var Source = GetUrlKeyValue("SPSource");


                                    var url = window.location.protocol +
                                        "//" +
                                        window.location.host +
                                        _spPageContextInfo.siteServerRelativeUrl;


                                    if (ListId != "") {
                                        $scope.getDir(url, ListId);
                                    } else {
                                        //Временно нацелена на локальные Документы
                                        $scope.getDir(url, '{38405EBF-043B-4CE5-9440-744C20169CC0}');
                                    }

                                });


                        });
                };

                var columnDefs1 = [
                    { name: 'Name' },
                    { name: 'Type' },
                    { name: 'Path' },
                ];

                var data1 = [
                ];


                $scope.gridOpts = {
                    columnDefs: columnDefs1,
                    data: data1
                };


                $scope.getDir = function documentQuery(url, ListId) {
                    var ctx = new SP.ClientContext(url);
                    var oLibDocs = ctx.get_web().get_lists().getById(ListId);
                    var caml = SP.CamlQuery.createAllItemsQuery();
                    caml.set_viewXml("<View Scope='All'><Query></Query></View>");
                    $scope.allDocumentsCol = oLibDocs.getItems(caml);
                    ctx.load($scope.allDocumentsCol, "Include(FileLeafRef, ServerUrl, FSObjType )");
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
                        libList += currentItem.get_item('FileLeafRef') + ' : ' + currentItemType + '\n';
                        $scope.gridOpts.data.push(
                        {
                            "Name": currentItem.get_item('FileLeafRef'),
                            "Type": currentItemType,
                            "Path": currentItemURL
                        });
                    }
                    $scope.$apply();
                }

                $scope.failed = function onFailedCallback(sender, args) {
                    alert("failed. Message:" + args.get_message());

                }

            }
        ]);

    */



    //Servisies
    angular.module('Abs')
        .factory('bufferCtrl',
            function() {
                var methods = {};

                var buffer = [];

                methods.addToBuffer = function(item) {
                    buffer = [];
                    buffer.push(item);
                };
                methods.setBuffer = function(item) {
                    buffer = [];
                    buffer = item;
                }

                methods.getFBuffer = function() {
                    return buffer;
                };
                return methods;
            });

    angular.module('Abs')
    .factory('selectedBufferService',
        function () {
            var methods = {};

            var selectedItemsBuffer = [];
            var selectedPathID = "";

            methods.addToBuffer = function (bufferItems, bufferPathID) {
                selectedItemsBuffer = [];
                selectedPathID = "";
                selectedPathID = bufferPathID;
                selectedItemsBuffer.push(bufferItems);
            };
            methods.getBuffer = function () {
                return selectedItemsBuffer;
            };
            methods.getPathID = function () {
                return selectedPathID;
            };
            return methods;
        });

})()