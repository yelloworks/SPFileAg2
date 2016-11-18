angular.module('Abs').controller('TreeController', ['$scope', function ($scope) {

    function init() {
        $scope.treeNodes = [{
            name: "My Files",
            image: "app/images/disk.png",
            children: [
                {
                    name: "Music",
                    children: [{
                        name: "Rock",
                        image: "app/images/rock.png",
                        children: [
                            { name: "The Eagles - Hotel California", image: "app/images/music-20.png" },
                            { name: "Ozzy Osbourne - Dreamer", image: "app/images/music-20.png" }
                        ]
                    },
                    {
                        name: "Jazz",
                        image: "app/images/jazz.png",
                        children: [
                            { name: "Ray Charles - Hit the road Jack! ", image: "app/images/music-20.png" },
                            { name: "Louis Prima - Just A Gigolo", image: "app/images/music-20.png" }
                        ]
                    }]
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
                    children: [{
                        name: "Angular books",
                        children: [
                            { name: "Pro AngularJS", image: "app/images/pdf.png" },
                            { name: "AngularJS: Up and Running", image: "app/images/pdf.png" },
                        ]
                    }, {
                        name: "Work",
                        children: [
                            { name: "Lost presentation", image: "app/images/ppt.png", disabled: true },
                            { name: "Requirements", image: "app/images/word.png" },
                            { name: "TODO list" },
                            { name: "Finances", image: "app/images/excel.png" },
                        ]
                    },
                    ]
                }
            ]
        }];

        $scope.basicTree = [{ name: "Node 1", children: [{ name: "Node 1.1", children: [{ name: "Node 1.1.1" }, { name: "Node 1.1.2" }] }] },
    { name: "Node 2", children: [{ name: "Node 2.1" }, { name: "Node 2.2" }] }]

        $scope.customImagesTree = [{
            name: "My Files", image: "app/images/disk.png",
            children: [{ name: "Pro AngularJS", image: "app/images/pdf.png" }, { name: "Presentation", image: "app/images/ppt.png" }
                , { name: "Requirements", image: "app/images/word.png" }, { name: "TODO list" }]
        }];

        $scope.disabledNodes = [{
            name: "My Files", disabled: true,
            children: [{
                name: "Angular books",
                children: [
                    { name: "Pro AngularJS", image: "app/images/pdf.png" },
                    { name: "AngularJS: Up and Running", image: "app/images/pdf.png" }, ]
            }, {
                name: "Work", disabled: true,
                children: [
                    { name: "Presentation", image: "app/images/ppt.png", disabled: true },
                    { name: "Requirements", image: "app/images/word.png" },
                    { name: "TODO list", disabled: true }]
            }]
        }];
    }


    init();

}]);
angular.module('Abs').controller('DropdownCtrl', function ($scope, $log) {
    $scope.items = [
      'The first choice!',
      'And another choice for you.',
      'but wait! A third!'
    ];

    $scope.status = {
        isopen: false
    };

    $scope.toggled = function (open) {
        $log.log('Dropdown is now: ', open);
    };

    $scope.toggleDropdown = function ($event) {
        $event.preventDefault();
        $event.stopPropagation();
        $scope.status.isopen = !$scope.status.isopen;
    };

    $scope.appendToEl = angular.element(document.querySelector('#dropdown-long-content'));
});
angular.module('Abs').controller('TabsDemoCtrl', function ($scope, $window) {
    $scope.tabs = [
      { title: 'Dynamic Title 1', content: 'Dynamic content 1' },
      { title: 'Dynamic Title 2', content: 'Dynamic content 2', disabled: true }
    ];

    $scope.alertMe = function () {
        setTimeout(function () {
            $window.alert('You\'ve selected the alert tab!');
        });
    };

    $scope.model = {
        name: 'Tabs'
    };
});

angular.module('Abs').controller('MainCtrl', ['$scope', function ($scope) {



    $scope.swapData = function () {
        if ($scope.gridOpts.data === data1) {
            $scope.gridOpts.data = data2;
            $scope.gridOpts.columnDefs = columnDefs2;
        }
        else {
            $scope.gridOpts.data = data1;
            $scope.gridOpts.columnDefs = columnDefs1;
        }
    };

    $scope.addData = function () {
        var n = $scope.gridOpts.data.length + 1;
        $scope.gridOpts.data.push({
            "Name": "New " + n,
            "Path": "Person " + n,
            "Type": "abc"
        });
    };

    $scope.removeFirstRow = function () {
        //if($scope.gridOpts.data.length > 0){
        $scope.gridOpts.data.splice(0, 1);
        //}
    };

    $scope.reset = function () {
        data1 = angular.copy(origdata1);
        data2 = angular.copy(origdata2);

        $scope.gridOpts.data = data1;
        $scope.gridOpts.columnDefs = columnDefs1;
    }

    var columnDefs1 = [
        { name: 'Name' },
        { name: 'Type' },
        { name: 'Path' },

    ];

    var data1 = [
      
    ];

    var origdata1 = angular.copy(data1);

    var columnDefs2 = [
      { name: 'firstName' },
      { name: 'lastName' },
      { name: 'company' },
      { name: 'employed' }
    ];

    var data2 = [
      {
          "firstName": "Waters",
          "lastName": "Shepherd",
          "company": "Kongene",
          "employed": true
      },
      {
          "firstName": "Hopper",
          "lastName": "Zamora",
          "company": "Acium",
          "employed": true
      },
      {
          "firstName": "Marcy",
          "lastName": "Mclean",
          "company": "Zomboid",
          "employed": true
      },
      {
          "firstName": "Tania",
          "lastName": "Cruz",
          "company": "Marqet",
          "employed": true
      },
      {
          "firstName": "Kramer",
          "lastName": "Cline",
          "company": "Parleynet",
          "employed": false
      },
      {
          "firstName": "Bond",
          "lastName": "Pickett",
          "company": "Brainquil",
          "employed": false
      }
    ];

    var origdata2 = angular.copy(data2);

    $scope.gridOpts = {
        columnDefs: columnDefs1,
        data: data1
    };










  //  var myData = [

  //  ];
  //  var dirFormation;


    $scope.getDir = function documentQuery() {
        var ListId = GetUrlKeyValue("SPListId");
        var HostUrl = GetUrlKeyValue("SPHostUrl");
        //var contextToken = 
        //TokenHelper.GetContextTokenFromRequest(Page.Request);
        var url;
        var ctx;
        var oLibDocs;
        if (ListId != "") {
            //Temp variant
            url = window.location.protocol + "//" + window.location.host + _spPageContextInfo.siteServerRelativeUrl;
            //;
            ctx = new SP.ClientContext(url);
            oLibDocs = ctx.get_web().get_lists().getById(ListId);
        } else {
            url = window.location.protocol + "//" + window.location.host + _spPageContextInfo.siteServerRelativeUrl;
            ctx = new SP.ClientContext(url);
            oLibDocs = ctx.get_web().get_lists().getByTitle("tmp2");
        }
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
            var currentItemURL = _spPageContextInfo.webServerRelativeUrl + currentItem.get_item('ServerUrl');
            var currentItemType = currentItem.get_item('FSObjType');
            libList += currentItem.get_item('FileLeafRef') + ' : ' + currentItemType + '\n';
            $scope.gridOpts.data.push(
            {
                "Name" : currentItem.get_item('FileLeafRef'),
                "Type" : currentItemType,
                "Path" : currentItemURL
        });
        }
        $scope.$apply();
        //alert(libList);
    }

    $scope.failed = function onFailedCallback(sender, args) {
        alert("failed. Message:" + args.get_message());
     
    }



  //  var columnDefs = [
  //{ name: 'Name' },
  //{ name: 'Type' },
  //{ name: 'Path' },

  //  ];


  //  $scope.gridOpts = {
  //      columnDefs: columnDefs,
  //      data: myData
    //  };


}]);