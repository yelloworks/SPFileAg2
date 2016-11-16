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
