(function () {

    angular.module('Abs')
    .controller('ModalInstanceCtrl',
        function ($uibModalInstance) {
            var $ctrl = this;
            $ctrl.text = "New Folder";
            $ctrl.ok = function () {
                $uibModalInstance.close($ctrl.text);
            };
            $ctrl.cancel = function () {
                $uibModalInstance.dismiss('cancel');
            };
        });

    angular.module('Abs')
    .controller('solutionModalCtrl',
        function ($uibModalInstance, actionToDo, itemsCount) {
            var $ctrl = this;
            $ctrl.actionText = actionToDo;
            $ctrl.itemsCount = itemsCount;
            $ctrl.ok = function () {
                $uibModalInstance.close();
            };
            $ctrl.cancel = function () {
                $uibModalInstance.dismiss('cancel');
            };
        });

})();
