﻿(function () {

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

    angular.module('Abs')
        .controller('permissionsModal',
            function ($uibModalInstance, $uibModal, $q, $log, items, url, listId) {
                var $ctrl = this;

                $ctrl.gridOptions = {
                    enableRowSelection: true,
                    enableSelectAll: true,
                    exporterMenuCsv: false,
                    enableGridMenu: true,
                    columnDefs: [
                        { name: 'name' },
                        { name: 'defenition' }
                    ],
                    onRegisterApi: function(gridApi) {
                        $ctrl.gridApi = gridApi;
                    }
                };

                $ctrl.hasUniq = false;

                var refresh = function () {
                    $ctrl.gridOptions.data = [];
                    items.forEach(function(item) {
                        getGroupList(url, listId, item.ID);
                        checkRoleInheritance(url, listId, item.ID);
                    });
                }
                function findIndex(array, serchItemId) {
                    var elements = array.map(function (x) {
                        return x.id;
                    }).indexOf(serchItemId);
                    // var objFound = $ctrl.gridOptions.data[elements];
                    return elements;
                };


                $ctrl.text = "New Folder";
                

                $ctrl.grant = function() {
                    var modalInstance = $uibModal.open({
                        animation: true,
                        templateUrl: 'grantPermissionModal.html',
                        controller: 'grantPermissionsModal',
                        controllerAs: '$ctrl'
                    });
                    modalInstance.result.then(function (outObjects) {
                        grantPermissions(outObjects).finally(function () { refresh(); });
                    }, function () {
                        $log.info('Modal dismissed at: ' + new Date());
                    });
                    $log.log($ctrl.gridApi.selection.getSelectedRows());
                };
                $ctrl.create = function() {
                    var someTmp = GetUrlKeyValue("SPAppWebUrl");
                    var it = someTmp.split('/');
                    var itnew = it.slice(0, it.length - 1);
                    var url = itnew.join('/');
                    window.open(url + "/_layouts/groups.aspx");
                };
                $ctrl.edit = function () {
                    if ($ctrl.gridApi.selection.getSelectedRows().length > 0)
                        {
                            getAllRoleDefinitions(url)
                                .then(function(allDefs) {
                                    var allList = createIndeterminateDefList();
                                    var sameDefList = createDefList();
                                    var allSiteDefs = allDefs.map(function(e) {
                                        return {
                                            description: e.description,
                                            id: e.id,
                                            name: e.name,
                                            selected: false,
                                            indeterminate: false
                                        };
                                    });

                                    allList.forEach(function(defId) {
                                        var index = findIndex(allSiteDefs, defId);
                                        if (index != -1) {
                                            allSiteDefs[index].indeterminate = true;
                                        }
                                    });

                                    sameDefList.forEach(function(defId) {
                                        var index = findIndex(allSiteDefs, defId);
                                        if (index != -1) {
                                            allSiteDefs[index].selected = true;
                                            allSiteDefs[index].indeterminate = false;
                                        }
                                    });

                                    var oldDefs = allSiteDefs.map(function(e) { return { selected: e.selected } });

                                    var modalInstance = $uibModal.open({
                                        animation: true,
                                        templateUrl: 'editPermissionsModal.html',
                                        controller: 'editPermissionsModal',
                                        controllerAs: '$ctrl',
                                        resolve: {
                                            allList: function() {
                                                return allSiteDefs;
                                            }
                                        }
                                    });

                                    $log.log(oldDefs);
                                    modalInstance.result.then(function (out) {
                                            editSelectedPermissions(out, oldDefs).finally(function() { refresh(); });
                                            //out.forEach(function(item, i) {
                                            //    if (item.selected != oldDefs[i].selected) {
                                            //        items.forEach(function(itemObject) {
                                            //            var selectedItems = $ctrl.gridApi.selection.getSelectedRows();
                                            //            selectedItems.forEach(function(selectedItem) {
                                            //                if (item.selected) {
                                            //                    addToRole(url,
                                            //                        {
                                            //                            id: selectedItem.id,
                                            //                            principalType: selectedItem.principalType
                                            //                        },
                                            //                        item.id,
                                            //                        itemObject.ID,
                                            //                        listId);
                                            //                } else {
                                            //                    deleteDefenition(url,
                                            //                        listId,
                                            //                        itemObject.ID,
                                            //                        selectedItem.id,
                                            //                        item.id);
                                            //                }

                                            //            });
                                            //        });
                                            //    }

                                            //});
                                        },
                                        function() {
                                            $log.info('Modal dismissed at: ' + new Date());
                                        });
                                });}                                      
                };
                $ctrl.delete = function() {
                    deleteSelectedPermissions().finally(function () {
                        refresh();
                    });
                    
                };

                $ctrl.roleInheritance = function () {

                    var modalInstance = $uibModal.open({
                        animation: true,
                        templateUrl: 'chooseRoleInheritanceModal.html',
                        controller: 'chooseRoleInheritanceModal',
                        controllerAs: '$ctrl',
                        resolve: {
                            inheritance: function () {
                                return $ctrl.hasUniq;
                            }
                        }
                    });
                    modalInstance.result.then(function (out) {
                        if (!out.isInheritance) {
                            items.forEach(function(itemObject) {
                                resetInheritance(url, listId, itemObject, out.applyToChild);
                            });
                        } else {
                            items.forEach(function (itemObject) {
                                breakRoleInheritance(url, listId, itemObject.ID, out.applyToChild);
                            });
                        }
                        $ctrl.hasUniq = out.isInheritance;
                        $log.log("isInheritance: " + out.isInheritance);
                        $log.log("applyToChild: " + out.applyToChild);

                    }, function () {
                        $log.info('Modal dismissed at: ' + new Date());
                    });

                }

                $ctrl.addRoles = function () {

                    var someTmp = GetUrlKeyValue("SPAppWebUrl");
                    var it = someTmp.split('/');
                    var itnew = it.slice(0, it.length - 1);
                    var url = itnew.join('/');
                    //window.open(url + "/_layouts/groups.aspx"); 
                    window.open(url + "/_layouts/addrole.aspx");
                };

                function deleteSelectedPermissions() {
                    var promises = $ctrl.gridApi.selection.getSelectedRows()
                        .map(function(row) {
                            var defered = $q.defer();
                            items.forEach(function(item) {
                                deletePermission(url, listId, item.ID, row.id)
                                    .then(function() {
                                            defered.resolve();
                                        },
                                        function() {
                                            defered.reject();
                                        });
                            });
                            return defered.promise;
                        });
                    return $q.all(promises);
                }

                function editSelectedPermissions(out, oldDefs) {
                    var promises = out.map(function(item, i) {
                        var defered = $q.defer();
                        if (item.selected != oldDefs[i].selected) {
                            items.forEach(function(itemObject) {
                                var selectedItems = $ctrl.gridApi.selection.getSelectedRows();
                                selectedItems.forEach(function(selectedItem) {
                                    if (item.selected) {
                                        addToRole(url,
                                                {
                                                    id: selectedItem.id,
                                                    principalType: selectedItem.principalType
                                                },
                                                item.id,
                                                itemObject.ID,
                                                listId)
                                            .then(function() {
                                                    defered.resolve();
                                                },
                                                function() {
                                                    defered.reject();
                                                });
                                    } else {
                                        deleteDefenition(url,
                                                listId,
                                                itemObject.ID,
                                                selectedItem.id,
                                                item.id)
                                            .then(function() {
                                                    defered.resolve();
                                                },
                                                function() {
                                                    defered.reject();
                                                });
                                    }

                                });
                            });
                        }
                    });
                    return $q.all(promises);
                }

                function grantPermissions(outObjects) {
                    var promises = items.map(function(itemObject) {
                        var defered = $q.defer();
                        outObjects.permissions.forEach(function(permission) {
                            addToRole(url, permission, outObjects.role.id, itemObject.ID, listId)
                                .then(function() {
                                        defered.resolve();
                                    },
                                    function() {
                                        defered.reject();
                                    });;
                        });
                        return defered.promise;
                    });
                    return $q.all(promises);
                }

                function deletePermission(url, listId, itemId, principalId) {
                    var defered = $q.defer();
                    var ctx = new SP.ClientContext(url);
                    var web = ctx.get_web();
                    var list = web.get_lists().getById(listId);
                    var item = list.getItemById(itemId);

                    var roles = item.get_roleAssignments().getByPrincipalId(principalId);
                    roles.deleteObject();
                    ctx.executeQueryAsync(function () {
                        defered.resolve();
                    }, function () {
                        defered.reject();
                    });
                    return defered.promise;
                }
            
                function deleteDefenition(url, listId, itemId, roleId, defenitionId) {
                    var defered = $q.defer();
                    var ctx = new SP.ClientContext(url);
                    var web = ctx.get_web();
                    var list = web.get_lists().getById(listId);
                    var item = list.getItemById(itemId);

                    var tmp = item.get_roleAssignments();

                    var roles = item.get_roleAssignments().getByPrincipalId(roleId);
                    var defenition = roles.get_roleDefinitionBindings();
                    ctx.load(item);
                    ctx.load(defenition);

                    ctx.executeQueryAsync(function () {
                        var defEnumerator = defenition.getEnumerator();
                        while (defEnumerator.moveNext()) {
                            var defItem = defEnumerator.get_current();
                            var dId = defItem.get_id();

                            $log.log(defItem.get_name());
                            if (dId == defenitionId) {
                                defenition.remove(defItem);
                                roles.update();
                                ctx.load(defenition);
                                ctx.executeQueryAsync(function () {
                                    defered.resolve();
                                        $log.log("done");
                                    },
                                    function(sender, args) { $log.log(args.get_message()) });
                                break;
                            }

                        }
                        
                    }, function () {
                        defered.reject();
                    });
                    return defered.promise;
                }

                var renew = refresh();
               // var setInher = checkRoleInheritance();
                
                function addToRole(url,item, roleId, itemId, listId) {
                    var defered = $q.defer();
                    var ctx = new SP.ClientContext(url);
                    var web = ctx.get_web();
                    var list = web.get_lists().getById(listId);
                    var targetItem = list.getItemById(itemId);
                    var itemObj;

                    if (item.principalType == 1) {
                        itemObj = web.get_siteUsers().getById(item.id);
                    } else {
                        itemObj = web.get_siteGroups().getById(item.id);
                    }
                    var roleDefinition = web.get_roleDefinitions().getById(roleId);
                    var collRoleDefinitionBinding = SP.RoleDefinitionBindingCollection.newObject(ctx);

                    collRoleDefinitionBinding.add(roleDefinition);

                    var rollAssignment = targetItem.get_roleAssignments();
                    rollAssignment.add(itemObj, collRoleDefinitionBinding);

                    ctx.executeQueryAsync(
                        function () { $log.log("done"); defered.resolve(); },
                        function (sender, args) { $log.log(args.get_message()); defered.reject(); });
                    return defered.promise;
                }

                function getGroupList(url, listId, itemId) {
                    var ctx = new SP.ClientContext(url);
                    var web = ctx.get_web();
                    var list = web.get_lists().getById(listId);
                    var item = list.getItemById(itemId);

                    var roles = item.get_roleAssignments();

                    ctx.load(roles);
                    ctx.executeQueryAsync(function() {
                            var rolesEnumerator = roles.getEnumerator();
                            var rolesList = [];
                            while (rolesEnumerator.moveNext()) {
                                rolesList.push(rolesEnumerator.get_current());
                            }
                            getAllRoles(rolesList, ctx)
                                .then(function(results) {
                                    if ($ctrl.gridOptions.data.length == 0) {
                                        $ctrl.gridOptions.data = results;
                                        $log.log($ctrl.gridOptions.data);
                                    } else {
                                        var out = [];

                                        results.forEach(function(item, i) {
                                            var itemIndex = findIndex($ctrl.gridOptions.data, item.id);
                                            if (itemIndex != -1) {
                                                Array.prototype.defUniq = function(a) {
                                                    return this.filter(function(b) {
                                                        return a.indexOf(b) < 0;
                                                    });
                                                };
                                                var uniqDefinitions = $ctrl.gridOptions.data[itemIndex].defenitions
                                                    .defUniq(item.defenitions);
                                                if (uniqDefinitions.length == 0) {
                                                    uniqDefinitions = item.defenitions
                                                        .defUniq($ctrl.gridOptions.data[itemIndex].defenitions);
                                                    if (uniqDefinitions.length == 0) {
                                                        out.push(item);
                                                    }

                                                };
                                            };


                                        });

                                        $ctrl.gridOptions.data = out;
                                        $log.log(results);
                                        $log.log($ctrl.gridOptions.data);
                                    };
                                    //findIndex(1);
                                    //findIndex(110);

                                });
                        },
                        function() {

                        });
                };
            
                function getItemPermissions(ctx, role) {
                    var defered = $q.defer();
                    var defenition = role.get_roleDefinitionBindings();
                    var member = role.get_member();
                    ctx.load(defenition);
                    ctx.load(member, 'Title');
                    ctx.load(member, 'PrincipalType');
                    ctx.executeQueryAsync(function() {
                            $log.log(member.get_title());
                            var defEnumerator = defenition.getEnumerator();
                            var defenitionsItems = [];
                            var defenitionsItemsString = [];
                            while (defEnumerator.moveNext()) {
                                var defItem = defEnumerator.get_current();
                                //defenitionsItems.push({ name: defItem.get_name(), id: defItem.get_id() });
                                defenitionsItems.push(defItem.get_id());
                                defenitionsItemsString.push(defItem.get_name());
                            }
                            // singlItems.push({ name: member.get_title(), id: role.get_principalId(), defenitions: defenitionsItems });
                            defered.resolve({
                                name: member.get_title(),
                                id: role.get_principalId(),
                                defenitions: defenitionsItems,
                                defenition: defenitionsItemsString.join(', '), 
                                principalType: member.get_principalType()
                            });
                            $log.log("Done");
                        },
                        function() {
                            defered.reject();
                        });
                    return defered.promise;
                }              

                function getAllRoles(roles, ctx) {
                    var promises = roles.map(function (role) {
                        var defered = $q.defer();
                        getItemPermissions(ctx, role).then(function (item) {
                            defered.resolve(item);
                        });
                        return defered.promise;
                    });
                    return $q.all(promises);
                }

                function checkRoleInheritance(url, listId, itemId) {
                    var ctx = new SP.ClientContext(url);
                    var web = ctx.get_web();
                    var list = web.get_lists().getById(listId);
                    var item = list.getItemById(itemId);
                    ctx.load(item, "HasUniqueRoleAssignments");
                    ctx.executeQueryAsync(
                        function () {
                            if (item.get_hasUniqueRoleAssignments()) {
                                $ctrl.hasUniq = true;
                            };
                            $log.log(item);
                            $log.log("done");
                        },
                        function (sender, args) { $log.log(args.get_message()) });
                }

                function breakRoleInheritance(url, listId, itemId, clearSubscopes) {
                    var ctx = new SP.ClientContext(url);
                    var web = ctx.get_web();
                    var list = web.get_lists().getById(listId);
                    var item = list.getItemById(itemId);


                    item.breakRoleInheritance(true, clearSubscopes);
                    ctx.executeQueryAsync(
                        function () {
                            $log.log("done");
                        },
                        function (sender, args) { $log.log(args.get_message()) });
                }

                function resetInheritance(url, listId, item, includeSubscopes) {
                    var ctx = new SP.ClientContext(url);
                    var list = ctx.get_web().get_lists().getById(listId);
                    var rootItem = list.getItemById(item.ID);
                    rootItem.resetRoleInheritance();

                    if (includeSubscopes) {
                        var caml = SP.CamlQuery.createAllItemsQuery();
                        caml.set_viewXml("<View Scope='RecursiveAll'><Query></Query></View>");
                        caml.set_folderServerRelativeUrl(item.FileRef);
                        var subItems = list.getItems(caml);

                        ctx.load(subItems);
                        ctx.executeQueryAsync(function() {
                                var subItemsEnumerator = subItems.getEnumerator();
                                while (subItemsEnumerator.moveNext()) {
                                    var currentItem = subItemsEnumerator.get_current();
                                    currentItem.resetRoleInheritance();
                                    ctx.executeQueryAsync();
                                }

                            },
                            function() {

                            });
                    } else {
                        ctx.executeQueryAsync();
                    }
                }

                function createDefList() {
                    var selItems = $ctrl.gridApi.selection.getSelectedRows();

                    var arrays = selItems.reduce(function (res, v) {
                        res.push(v.defenitions);
                        return res;
                    }, []);

                    var result = arrays.shift().reduce(function (res, v) {
                        if (arrays.every(function (a) {
                            //console.log(findIndex(a, v.id).length)
                        return a.indexOf(v) !== -1;
                        })) res.push(v);
                        return res;
                    }, []);
                    return result;
                }

                function createIndeterminateDefList() {
                    Array.prototype.unique = function() {
                        var a = this.concat();
                        for (var i = 0; i < a.length; ++i) {
                            for (var j = i + 1; j < a.length; ++j) {
                                if (a[i] === a[j])
                                    a.splice(j--, 1);
                            }
                        }
                        return a;
                    }
                    var selItems = $ctrl.gridApi.selection.getSelectedRows();

                    var arrays = selItems.reduce(function (res, v) {
                        res.push(v.defenitions);
                        return res;
                    }, []);

                    var flattened = arrays.reduce(function (res, v) {
                        return res.concat(v);
                    }).unique();
                    return flattened;
                }

                function getAllRoleDefinitions(url) {
                    var defered = $q.defer();
                    var ctx = new SP.ClientContext(url);
                    var web = ctx.get_web();
                    var roles = web.get_roleDefinitions();
                    var roleDefinitionsItems = [];
                    ctx.load(roles);
                    ctx.executeQueryAsync(function () {
                        var rolesEnumerator = roles.getEnumerator();
                        while (rolesEnumerator.moveNext()) {
                            var role = rolesEnumerator.get_current();
                            var roleName = role.get_name();
                            var roleId = role.get_id();
                            roleDefinitionsItems.push({
                                name: roleName,
                                id: roleId,
                                description: role.get_description()
                        });
                            
                        }
                        defered.resolve(roleDefinitionsItems);
                    }, function () {
                        defered.reject();
                    });
                    return defered.promise;
                };


                $ctrl.ok = function () {
                    $uibModalInstance.close($ctrl.text);
                };
                $ctrl.cancel = function () {
                    $uibModalInstance.dismiss('cancel');
                };
            });


    angular.module('Abs')
    .controller('grantPermissionsModal',
        function ($uibModalInstance, $log, $q) {
            var $ctrl = this;
            $ctrl.text = "New Folder";
            $ctrl.editRoles = function () {

                var someTmp = GetUrlKeyValue("SPAppWebUrl");
                var it = someTmp.split('/');
                var itnew = it.slice(0, it.length - 1);
                var url = itnew.join('/');
                window.open(url + "/_layouts/addrole.aspx");
            };

            var onStartGroups = getAllUsersAndGroups();
            var onStartRoles = getAllRoleDefinitions();

            $ctrl.permissionItemSelected = [];
            $ctrl.roleItemsSelected = [];

            $ctrl.permissionItem = [];
            $ctrl.roleDefinitionsItems = [];

            var enumPrincipalType = {
                0: "none",
                1: "user",
                2: "Distribution List",
                4: "Security Group",
                8: "SharePoint Group",
                15: "All"
            };
            function getPrincipalTypeValue(key) {
                return enumPrincipalType[key];
            }
            function getAllUsersAndGroups(url) {
                var ctx = new SP.ClientContext(url);
                var web = ctx.get_web();
                var groups = web.get_siteGroups();
                var users = web.get_siteUsers();
                ctx.load(groups);
                ctx.load(users);
                ctx.executeQueryAsync(function () {
                    var groupsEnumerator = groups.getEnumerator();
                    while (groupsEnumerator.moveNext()) {
                        var group = groupsEnumerator.get_current();
                        $ctrl.permissionItem.push({
                            name: group.get_title(),
                            id: group.get_id(),
                            principalType: group.get_principalType(),
                            type: getPrincipalTypeValue(group.get_principalType())
                        });
                    }
                    var usersEnumerator = users.getEnumerator();
                    while (usersEnumerator.moveNext()) {
                        var user = usersEnumerator.get_current();
                        $ctrl.permissionItem.push({
                            name: user.get_title(),
                            id: user.get_id(),
                            principalType: user.get_principalType(),
                            type: getPrincipalTypeValue(user.get_principalType())
                        });
                    }
                    $log.log($ctrl.permissionItem);

                }, function () {
                    $log.log("no user");

                });

            };

            function getAllRoleDefinitions(url) {
                var ctx = new SP.ClientContext(url);
                var web = ctx.get_web();
                var roles = web.get_roleDefinitions();
                ctx.load(roles);
                ctx.executeQueryAsync(function () {
                    var rolesEnumerator = roles.getEnumerator();
                    while (rolesEnumerator.moveNext()) {
                        var role = rolesEnumerator.get_current();
                        var roleName = role.get_name();
                        var roleId = role.get_id();
                        $ctrl.roleDefinitionsItems.push({
                            name: roleName,
                            id: roleId
                        });

                    }
                }, function () {

                });
            };
 
            $ctrl.addBtnClicked = function () {
                if ($ctrl.out != undefined && $ctrl.out.name != undefined) {
                    if (findIndex($ctrl.out.id) == -1) {
                        $ctrl.usersAndGroups.push($ctrl.out);
                        $ctrl.out = undefined;
                    }
                } else {

                };
                $ctrl.out = undefined; //clear only
            };

            $ctrl.ok = function() {
                $uibModalInstance.close({
                    permissions: $ctrl.permissionItemSelected,
                    role: $ctrl.roleItemsSelected
                });
            };
            $ctrl.cancel = function () {
                $uibModalInstance.dismiss('cancel');
            };
        });

    angular.module('Abs')
    .controller("chooseRoleInheritanceModal",
        function ($uibModalInstance, $log, inheritance) {
            var $ctrl = this;
            $ctrl.isInheritance = inheritance;
            $ctrl.applyToChild = false;

            $ctrl.ok = function () {
                $uibModalInstance.close({ isInheritance: $ctrl.isInheritance, applyToChild: $ctrl.applyToChild });
            };
            $ctrl.cancel = function () {
                $uibModalInstance.dismiss('cancel');
            };
        });

    angular.module('Abs')
        .controller('editPermissionsModal',
            function ($uibModalInstance, $log, $q, allList) {
                var $ctrl = this;
                $ctrl.text = "New Folder";
                $ctrl.list = allList;

                $ctrl.ok = function () {
                    $uibModalInstance.close($ctrl.list);
                };
                $ctrl.cancel = function () {
                    $uibModalInstance.dismiss('cancel');
                };
            });



    angular.module('Abs')
        .filter('propsFilter',
            function () {
                return function (items, props) {
                    var out = [];

                    if (angular.isArray(items)) {
                        var keys = Object.keys(props);

                        items.forEach(function (item) {
                            var itemMatches = false;

                            for (var i = 0; i < keys.length; i++) {
                                var prop = keys[i];
                                var text = props[prop].toLowerCase();
                                if (item[prop].toString().toLowerCase().indexOf(text) !== -1) {
                                    itemMatches = true;
                                    break;
                                }
                            }

                            if (itemMatches) {
                                out.push(item);
                            }
                        });
                    } else {
                        // Let the output be the input untouched
                        out = items;
                    }

                    return out;
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
                        setSelectedAndAdress();
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

                $scope.selectionStart = function() {
                    $scope.log.push(($scope.log.length + 1) + ': selection start!');
                };
                $scope.selectionStop = function (selected) {
                    selectedBufferService.setSelected(selected, $scope.tabs[$scope.index]);
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

                $scope.$on('selectedEvent', function(event, args) {
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

    //Servisies
    angular.module('Abs')
        .factory('bufferService',
            function() {
                var methods = {};

                var buffer = [];
                var info = [];
                var cuted = false;

                methods.setBuffer = function (item, itemInfo, cutStat) {
                    buffer = [];

                    buffer = item;
                    info = itemInfo;
                    cuted = cutStat;
                }

                methods.getBuffer = function() {
                    return buffer;
                };
                methods.getUrl = function() {
                    return info.url;
                };
                methods.getListId = function() {
                    return info.listId;
                };
                methods.getRelativeUrl = function() {
                    return info.relativeUrl;
                };
                methods.getIsCuted = function() {
                    return cuted;
                };
                methods.getRootFolder = function() {
                    return info.relativeSiteUrl;
                };

                //Handlers
                methods.getClearRelativeUrl = function() {
                    return info.relativeUrl.replace(info.relativeSiteUrl, "");
                };
                methods.getItemsList = function () {
                    var lastItem = "";
                    var length;
                    if (buffer.length > 10) {
                        length = 10;
                        lastItem = '<li>....</li>';
                    } else {
                        length = buffer.length;
                    }


                    var outString = String.format('<ul style="list-style-type:none">');
                    for (var i = 0; i < length; i++) {
                        outString += "<li>" + buffer[i].name + "</li>";
                    }
                    return outString + lastItem + "</ul>";
                }
                return methods;
            });

    angular.module('Abs')
   .factory('selectedBufferService',
       function () {
           var methods = {};

           var selectedItemsBuffer = [];
           var selectedInfo = [];

           methods.setSelected = function (bufferItems, tabInfo) {
               selectedItemsBuffer = [];
               selectedInfo = tabInfo;
               selectedItemsBuffer = bufferItems;

           };

           methods.getInfo = function() {
               return selectedInfo;
           };
           methods.getBuffer = function () {
               return selectedItemsBuffer;
           };
           methods.getlistID = function () {
               return selectedInfo.listId;
           };
           methods.getUrl = function () {
               return selectedInfo.url;
           };
           methods.getRelativeUrl = function () {
               return selectedInfo.relativeUrl;
           };
           methods.getRootFolder = function () {
               return selectedInfo.relativeSiteUrl;
           };

           methods.getClearRelativeUrl = function () {
               return selectedInfo.relativeUrl.replace(selectedInfo.relativeSiteUrl, "");
           };

           return methods;
       });

    angular.module('Abs')
        .factory('fileOperations',
        function ($q, $log, toaster) {
        var methods = {};

        var url = "";


        methods.CopyOrMove = function (itemUrl, sourceListId, sourceRelativeUrl, soutceItemId, destRelativeUrl, destListId, objectType, itemName, moveItem) {
            url = itemUrl;
            if (url.charAt(url.length - 1) == '/') {
                url = url.slice(0,-1);
            }
            var listId = sourceListId;
            var destenationListId = destListId;     
            var destenationRelUrl = removeFirstSlash(destRelativeUrl);

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
            var web = ctx.get_web();
            ctx.load(web);
            var oLibDocs = ctx.get_web().get_lists().getById(listId);
            var caml = SP.CamlQuery.createAllItemsQuery();
            caml
                .set_viewXml("<View Scope='RecursiveAll'><Query><Where><Eq><FieldRef Name='FSObjType' /><Value Type='Integer'>0</Value></Eq></Where></Query></View>");
            caml.set_folderServerRelativeUrl(relativeUrl);
            var allDocumentsCol = oLibDocs.getItems(caml);
            ctx.load(allDocumentsCol, "Include(FileLeafRef, ServerUrl, FSObjType, FileRef, FileDirRef, ID, GUID )");
            ctx.executeQueryAsync(function(sender, args) {
                    var listEnumerator = allDocumentsCol.getEnumerator();
                    var fileListInfo = [];
                    var rootFolder = web.get_serverRelativeUrl();
                    while (listEnumerator.moveNext()) {
                        var currentItem = listEnumerator.get_current();                       
                        var currentItemFileDirRef = currentItem.get_item('FileDirRef');
                        var currentItemId = currentItem.get_item('ID');
                        var tmpPath = relativeUrl.split('/');
                        var cutPath = "/" + tmpPath.slice(0, tmpPath.length - 1).join('/') + "/";
                        var relUrlArray = destenationRelUrl.split('/');
                        var destUrl = relUrlArray.slice(1, relUrlArray.length).join('/');
                        var preNewFolder = currentItemFileDirRef.replace(rootFolder, "");
                        var newFolder = destUrl + '/' + removeFirstSlash(preNewFolder.replace(cutPath, ""));
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
                    asyncCopyFolder(fileListInfo)
                        .finally(function () {
                            toaster.pop('success',
                                    "Copy operation",
                                    "Items copied",
                                    3000,
                                    'trustedHtml');
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
                        function (folder) {
                            $log.log(String.format("Folder '{0}' has been created", folder.get_name()));
                        },
                        function (sender, args) {
                            toaster.pop('error',
                                "Create folder",
                                args.get_message(),
                                3000,
                                'trustedHtml');
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
                var web = ctx.get_web();
                ctx.load(web);
                ctx.load(curFolder);
                ctx.executeQueryAsync(
                        function () {
                            success(curFolder);
                            var webRootFolder = web.get_serverRelativeUrl();
                            var root = rootFolder.get_serverRelativeUrl().replace(webRootFolder, "");
                            var args = [currentItemId, removeFirstSlash(root), folderUrl];
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
                    function (folder) {
                        toaster.pop('success',
                            "Create folder",
                            String.format("Folder '{0}' has been created", folder.get_name()),
                            3000,
                            'trustedHtml');
                        $log.log(String.format("Folder '{0}' has been created", folder.get_name()));
                    },
                    function (sender, args) {
                        toaster('error',
                            "Create folder",
                            args.get_message(),
                            3000,
                            'trustedHtml');
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
            var defered = $q.defer();
            var ctx = new SP.ClientContext(itemUrl);
            var list = ctx.get_web().get_lists().getById(itemListId);
            var item = list.getItemById(itemId);
            item.deleteObject();
            ctx.executeQueryAsync(
                function () {
                    defered.resolve();
                    $log.log("delete success");
                },
                function (sender, args) {
                    defered.reject(args.get_message());
                    $log.log(args.get_message());
                }
            );
            return defered.promise;

        }
        methods.deleteItemToRecycle = function (itemUrl, itemListId, itemId) {
            var defered = $q.defer();
            var ctx = new SP.ClientContext(itemUrl);
            var list = ctx.get_web().get_lists().getById(itemListId);
            var item = list.getItemById(itemId);
            item.recycle();
            ctx.executeQueryAsync(
                function () {
                    defered.resolve();
                    $log.log("delete success");
                },
                function (sender, args) {
                    defered.reject(args.get_message());
                    $log.log(args.get_message());
                }
            );
            return defered.promise;

        }

            return methods;
        });

    angular.module('Abs')
        .factory('checkOperations',
            function($log, toaster) {
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
                        ctx.executeQueryAsync(function() {
                        }, function (sender, args) {
                             $log.log(args.get_message());
                        });
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

    angular.module('Abs')
        .factory('loadOperations',
            function($log) {
                var methods = {};

                methods.downloadSingleFile = function(url, listId, itemId) {
                    var ctx = new SP.ClientContext(url);
                    var web = ctx.get_web();
                    ctx.load(web);
                    var list = ctx.get_web().get_lists().getById(listId);
                    var item = list.getItemById(itemId);
                    var file = item.get_file();
                    ctx.load(file);
                    ctx.executeQueryAsync(function(sender, args) {
                        var path = file.get_serverRelativeUrl();
                        var webRootFolder = web.get_serverRelativeUrl();
                        var clearPath =path.replace(webRootFolder, "");
                        $log.log(clearPath);
                        $log.log(url + clearPath);
                        window.location.href =url +  "/_layouts/download.aspx?SourceUrl=" + url + clearPath;
                        },
                        function(sender, args) {
                            $log.log(args.get_message());

                        });

                };

                methods.uploadSingleFile = function(files, url, listId, targetRelUrl) {

                    for (var i = 0; i < files.length; i++) {
                        upload(files[i], url, listId, targetRelUrl);
                    }
                }

                function upload(file, url, listId, targetRelUrl) {
                    var fr = new FileReader();
                    fr.onload = function() {
                        var clientContext = new SP.ClientContext(url);
                        var web = clientContext.get_web();
                        var list = web.get_lists().getById(listId);

                        var fileCreateInfo = new SP.FileCreationInformation();
                        fileCreateInfo.set_url(file.name);
                        fileCreateInfo.set_overwrite(true);
                        fileCreateInfo.set_content(new SP.Base64EncodedByteArray());

                        var arr = convertDataUriToBinary(fr.result);
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
                        clientContext.executeQueryAsync(function() { $log.log("Upload sucesess") },
                            function(sender, args) { $log.log(args.get_message()) });
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