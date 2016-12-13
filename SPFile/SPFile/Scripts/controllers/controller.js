(function () {

    angular.module('Abs', ['ngAnimate', 'ngSanitize', 'ui.bootstrap', 'TreeWidget', 'ngTouch', 'ui.grid', 'ngSelectable']);


    angular.module('Abs')
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

    angular.element(document).ready(function () {
        var $inj = angular.bootstrap(document.body, ['Abs']);
        var $rootScope = $inj.get("$rootScope");

        SP.SOD.executeFunc('SP.Runtime.js',
            'SP.ClientContext',
            function() {
                SP.SOD.executeFunc('SP.js',
                    'SP.ClientContext',
                    function() {
                        var ListId = GetUrlKeyValue("SPListId");
                        var url = window.location.protocol +
                            "//" +
                            window.location.host +
                            _spPageContextInfo.siteServerRelativeUrl;


                        if (ListId != "") {
                            $rootScope.$broadcast("pageInit", url, ListId);
                            $rootScope.$digest();
                        }
                    });
            }); 
    });
   

    angular.module('Abs')
        .controller('tabsCtrl',
            function($scope, $window) {
                $scope.tabs = [

                ];

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


                var setAllInactive = function () {
                    angular.forEach($scope.tabs, function (tabs) {
                        tabs.active = false;
                    });
                };

                var addNewWorkspace = function (url, listId) {
                    $scope.tabs.push({
                        title: listId,
                        url: url,
                        active:true
                    });
                };


                $scope.addWorkspace = function() {
                    setAllInactive();


                    var url = window.location.protocol +
                        "//" +
                        window.location.host +
                        _spPageContextInfo.siteServerRelativeUrl;
                    addNewWorkspace(url, '{38405EBF-043B-4CE5-9440-744C20169CC0}');
                };

                $scope.$on('pageInit', function (event, url, listId) {
                    addNewWorkspace(url, listId);
                });


            });
/*
    angular.module('Abs')
        .controller('MainCtrl',
        [
            '$scope', function($scope) {


                $scope.onstart = function() {

                    SP.SOD.executeFunc('SP.Runtime.js',
                        'SP.ClientContext',
                        function() {
                            SP.SOD.executeFunc('SP.js',
                                'SP.ClientContext',
                                function() {
                                    var ListId = GetUrlKeyValue("SPListId");
                                    var HostUrl = GetUrlKeyValue("SPHostUrl");


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
    angular.module('Abs')
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





    angular.module('Abs')
        .factory('bufferCtrl',
            function() {
                var methods = {};

                var buffer = [];

                methods.addToBuffer = function(item) {
                    buffer = [];
                    buffer.push(item);
                };
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
            methods.getFBuffer = function () {
                return selectedItemsBuffer;
            };
            methods.getPathID = function () {
                return selectedPathID;
            };
            return methods;
        });

    angular
        .module('Abs')
        .controller('tabContentController',
            ['$scope', 'selectedBufferService', function ($scope, selectedBufferService) {
                $scope.selection = true;
                $scope.selected = [];
                $scope.log = [];
                $scope.index = "";
                $scope.fileItems = [

                ];
                $scope.selectionStart = function() {
                    $scope.log.push(($scope.log.length + 1) + ': selection start!');
                };
                $scope.selectionStop = function (selected) {
                    selectedBufferService.addToBuffer(selected, "tmp");
                    $scope.log.push(($scope.log.length + 1) + ': items selected: ' + selected.length);
                };
                $scope.onStart = function($index) {
                    $scope.index = $index;
                    var listId = $scope.tabs[$scope.index].title;
                    var url = $scope.tabs[$scope.index].url;
                    $scope.getDir(url, listId);
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
                        $scope.fileItems.push(
                        {
                            "name": currentItem.get_item('FileLeafRef'),
                            "type": currentItemType,
                            "path": currentItemURL
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

    angular.module('Abs').controller('tmpCtrl', ['$scope','selectedBufferService', '$log', function($scope, selectedBufferService, $log) {
        $scope.model = [];

        $scope.$log = $log;
        $scope.message = selectedBufferService.getFBuffer();

        $scope.refresh = function() {
            return selectedBufferService.getFBuffer();
        };
    }]);
})()