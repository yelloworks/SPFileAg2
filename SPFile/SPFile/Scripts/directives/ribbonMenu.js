(function() {
    'use strict';

    angular
        .module('Abs')
        .directive('ribbonMenu', ribbonMenu);

    ribbonMenu.$inject = ['$window'];
    
    function ribbonMenu ($window) {
        // Usage:
        //     <ribbonMenu></ribbonMenu>
        // Creates:
        // 
        var directive = {
            link: link,
            restrict: 'E',
            templateUrl: 'menu-ribbon.html'            
        };
        return directive;

        function link(scope, element, attrs) {
        }
    }

})();