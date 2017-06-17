﻿(function () {
    angular.module('Abs')
        .controller('permissionsModal',
            function ($uibModalInstance, $uibModal, $q, $log, toaster, items, url, listId) {
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
                    onRegisterApi: function (gridApi) {
                        $ctrl.gridApi = gridApi;
                    }
                };

                $ctrl.hasUniq = false;

                var refresh = function () {
                    $ctrl.gridOptions.data = [];
                    items.forEach(function (item) {
                        getGroupList(url, listId, item.ID);
                        checkRoleInheritance(url, listId, item.ID);
                    });
                }

                var showToast = {
                    success: function (toastTytle, toastBody) {
                        toaster.pop({
                            type: 'success',
                            tytle: toastTytle,
                            body: toastBody,
                            timeout: 5000,
                            bodyOutputType: 'trustedHtml',
                            toasterId: 1
                        });
                    },
                    error: function (toastTytle, toastBody) {
                        toaster.pop({
                            type: 'error',
                            tytle: toastTytle,
                            body: toastBody,
                            timeout: 5000,
                            bodyOutputType: 'trustedHtml',
                            toasterId: 1
                        });

                    },
                }

                $ctrl.text = "New Folder";

                $ctrl.grant = function () {
                    var modalInstance = $uibModal.open({
                        animation: true,
                        templateUrl: 'grantPermissionModal.html',
                        controller: 'grantPermissionsModal',
                        controllerAs: '$ctrl'
                    });
                    modalInstance.result.then(function (outObjects) {
                        grantPermissions(outObjects).finally(function () { refresh(); showToast.success("Grant Permissions", "Granting permissions seccessed")});
                    }, function () {
                        $log.info('Modal dismissed at: ' + new Date());
                    });
                };
                $ctrl.create = function () {
                    var someTmp = GetUrlKeyValue("SPAppWebUrl");
                    var it = someTmp.split('/');
                    var itnew = it.slice(0, it.length - 1);
                    var url = itnew.join('/');
                    window.open(url + "/_layouts/groups.aspx");
                };
                $ctrl.edit = function () {
                    if ($ctrl.gridApi.selection.getSelectedRows().length > 0) {
                        getAllRoleDefinitions(url)
                            .then(function (allDefs) {
                                var allList = createIndeterminateDefList();
                                var sameDefList = createDefList();
                                var allSiteDefs = allDefs.map(function (e) {
                                    return {
                                        description: e.description,
                                        id: e.id,
                                        name: e.name,
                                        selected: false,
                                        indeterminate: false
                                    };
                                });

                                allList.forEach(function (defId) {
                                    var index = findIndex(allSiteDefs, defId);
                                    if (index != -1) {
                                        allSiteDefs[index].indeterminate = true;
                                    }
                                });

                                sameDefList.forEach(function (defId) {
                                    var index = findIndex(allSiteDefs, defId);
                                    if (index != -1) {
                                        allSiteDefs[index].selected = true;
                                        allSiteDefs[index].indeterminate = false;
                                    }
                                });

                                var oldDefs = allSiteDefs.map(function (e) { return { selected: e.selected } });

                                var modalInstance = $uibModal.open({
                                    animation: true,
                                    templateUrl: 'editPermissionsModal.html',
                                    controller: 'editPermissionsModal',
                                    controllerAs: '$ctrl',
                                    resolve: {
                                        allList: function () {
                                            return allSiteDefs;
                                        }
                                    }
                                });

                                modalInstance.result.then(function (out) {
                                    editSelectedPermissions(out, oldDefs).finally(function () { refresh(); showToast.success("Edit Permissions", "Editing permissions seccessed") });
                                },
                                    function () {
                                        $log.info('Modal dismissed at: ' + new Date());
                                    });
                            });
                    }
                };
                $ctrl.delete = function () {
                    deleteSelectedPermissions()
                        .then(function(rows) {
                            refresh();
                            rows.forEach(function (row) {
                                showToast.success("Delete role", "Item deleted: " + row);
                            });                        
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
                    modalInstance.result.then(function(out) {
                        if (!out.isInheritance) {
                            changeInheritance(out, resetInheritance)
                                .finally(function() {
                                    refresh();
                                    showToast.success("Change Inheritance", "Inheritance changed to " + !out.isInheritance);                            
                                });
                        } else {
                            changeInheritance(out, breakRoleInheritance)
                                .finally(function() {
                                    refresh();
                                    showToast.success("Change Inheritance", "Inheritance changed to " + !out.isInheritance);
                                });
                        }
                        $ctrl.hasUniq = out.isInheritance;

                    }, function () {
                        $log.info('Modal dismissed at: ' + new Date());
                    });

                }

                $ctrl.addRoles = function () {
                    var someTmp = GetUrlKeyValue("SPAppWebUrl");
                    var it = someTmp.split('/');
                    var itnew = it.slice(0, it.length - 1);
                    var url = itnew.join('/');
                    window.open(url + "/_layouts/addrole.aspx");
                };

                var renew = refresh();

                function findIndex(array, serchItemId) {
                    var elements = array.map(function (x) {
                        return x.id;
                    }).indexOf(serchItemId);
                    return elements;
                };

                function deleteSelectedPermissions() {
                    var promises = $ctrl.gridApi.selection.getSelectedRows()
                        .map(function (row) {
                            var defered = $q.defer();
                            items.forEach(function (item) {
                                deletePermission(url, listId, item.ID, row.id)
                                    .then(function () {
                                        defered.resolve(row.name);
                                    },
                                        function () {
                                            defered.reject();
                                        });
                            });
                            return defered.promise;
                        });
                    return $q.all(promises);
                }

                function editSelectedPermissions(out, oldDefs) {
                    var promises = out.map(function (item, i) {
                        var defered = $q.defer();
                        if (item.selected != oldDefs[i].selected) {
                            items.forEach(function (itemObject) {
                                var selectedItems = $ctrl.gridApi.selection.getSelectedRows();
                                selectedItems.forEach(function (selectedItem) {
                                    if (item.selected) {
                                        addToRole(url,
                                                {
                                                    id: selectedItem.id,
                                                    principalType: selectedItem.principalType
                                                },
                                                item.id,
                                                itemObject.ID,
                                                listId)
                                            .then(function () {
                                                defered.resolve();
                                            },
                                                function () {
                                                    defered.reject();
                                                });
                                    } else {
                                        deleteDefenition(url,
                                                listId,
                                                itemObject.ID,
                                                selectedItem.id,
                                                item.id)
                                            .then(function () {
                                                defered.resolve();
                                            },
                                                function () {
                                                    defered.reject();
                                                });
                                    }

                                });
                            });
                        }
                    });
                    return $q.all(promises);
                }

                function changeInheritance(out, action) {
                    var promises = items.map(function (itemObject) {
                        var defered = $q.defer();
                        action(url, listId, itemObject, out.applyToChild)
                                .then(function () {
                                    defered.resolve();
                                },
                                    function () {
                                        defered.reject();
                                    });;

                        return defered.promise;
                    });
                    return $q.all(promises);
                }

                function grantPermissions(outObjects) {
                    var promises = items.map(function (itemObject) {
                        var defered = $q.defer();
                        outObjects.permissions.forEach(function (permission) {
                            addToRole(url, permission, outObjects.role.id, itemObject.ID, listId)
                                .then(function () {
                                    defered.resolve();
                                },
                                    function () {
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

                            if (dId == defenitionId) {
                                defenition.remove(defItem);
                                roles.update();
                                ctx.load(defenition);
                                ctx.executeQueryAsync(function () {
                                    defered.resolve();
                                },
                                    function (sender, args) { showToast.error("Delete Error", args.get_message()); });
                                break;
                            }

                        }

                    }, function () {
                        defered.reject();
                    });
                    return defered.promise;
                }

                function addToRole(url, item, roleId, itemId, listId) {
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
                        function () { defered.resolve(); },
                        function (sender, args) { showToast.error("Add role Error", args.get_message()); });
                    return defered.promise;
                }

                function getGroupList(url, listId, itemId) {
                    var ctx = new SP.ClientContext(url);
                    var web = ctx.get_web();
                    var list = web.get_lists().getById(listId);
                    var item = list.getItemById(itemId);

                    var roles = item.get_roleAssignments();

                    ctx.load(roles);
                    ctx.executeQueryAsync(function () {
                        var rolesEnumerator = roles.getEnumerator();
                        var rolesList = [];
                        while (rolesEnumerator.moveNext()) {
                            rolesList.push(rolesEnumerator.get_current());
                        }
                        getAllRoles(rolesList, ctx)
                            .then(function (results) {
                                if ($ctrl.gridOptions.data.length == 0) {
                                    $ctrl.gridOptions.data = results;
                                } else {
                                    var out = [];
                                    results.forEach(function (item, i) {
                                        var itemIndex = findIndex($ctrl.gridOptions.data, item.id);
                                        if (itemIndex != -1) {
                                            Array.prototype.defUniq = function (a) {
                                                return this.filter(function (b) {
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
                                };


                            });
                    },
                        function () {

                        });
                };

                function getItemPermissions(ctx, role) {
                    var defered = $q.defer();
                    var defenition = role.get_roleDefinitionBindings();
                    var member = role.get_member();
                    ctx.load(defenition);
                    ctx.load(member, 'Title');
                    ctx.load(member, 'PrincipalType');
                    ctx.executeQueryAsync(function () {
                        var defEnumerator = defenition.getEnumerator();
                        var defenitionsItems = [];
                        var defenitionsItemsString = [];
                        while (defEnumerator.moveNext()) {
                            var defItem = defEnumerator.get_current();
                            defenitionsItems.push(defItem.get_id());
                            defenitionsItemsString.push(defItem.get_name());
                        }
                        defered.resolve({
                            name: member.get_title(),
                            id: role.get_principalId(),
                            defenitions: defenitionsItems,
                            defenition: defenitionsItemsString.join(', '),
                            principalType: member.get_principalType()
                        });
                    },
                        function () {
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
                        },
                        function (sender, args) { showToast.error("Check Role Inheritance", args.get_message()); });
                }

                function breakRoleInheritance(url, listId, elementItem, clearSubscopes) {
                    var defered = $q.defer();
                    var ctx = new SP.ClientContext(url);
                    var web = ctx.get_web();
                    var list = web.get_lists().getById(listId);
                    var item = list.getItemById(elementItem.ID);
                    item.breakRoleInheritance(true, clearSubscopes);
                    ctx.executeQueryAsync(
                        function () {                           
                            defered.resolve();
                        },
                        function (sender, args) { showToast.error("Break Role Inheritance", args.get_message()); defered.reject() });
                    return defered.promise;
                }

                function resetInheritance(url, listId, item, includeSubscopes) {
                    var defered = $q.defer();
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
                                    ctx.executeQueryAsync(function() { defered.resolve(); },
                                        function(args) {
                                            showToast.error("Reset Role Inheritance", args.get_message());
                                            defered.reject();
                                        });
                                }
                            },
                            function() {
                            });
                    } else {
                        ctx.executeQueryAsync(function() { defered.resolve(); },
                            function(args) {
                                showToast.error("Reset Role Inheritance", args.get_message());
                                defered.reject();
                            });
                    }
                    return defered.promise;
                }

                function createDefList() {
                    var selItems = $ctrl.gridApi.selection.getSelectedRows();

                    var arrays = selItems.reduce(function(res, v) {
                            res.push(v.defenitions);
                            return res;
                        },
                        []);

                    var result = arrays.shift()
                        .reduce(function(res, v) {
                                if (arrays.every(function(a) {
                                    return a.indexOf(v) !== -1;
                                })) res.push(v);
                                return res;
                            },
                            []);
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

                    var arrays = selItems.reduce(function(res, v) {
                            res.push(v.defenitions);
                            return res;
                        },
                        []);

                    var flattened = arrays.reduce(function(res, v) {
                            return res.concat(v);
                        })
                        .unique();
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
                    }, function (args) {
                        showToast.error("Get All Role Defenitions", args.get_message());
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

            function setPermissionItems(itemEnumerator) {
                while (itemEnumerator.moveNext()) {
                    var item = itemEnumerator.get_current();
                    $ctrl.permissionItem.push({
                        name: item.get_title(),
                        id: item.get_id(),
                        principalType: item.get_principalType(),
                        type: getPrincipalTypeValue(item.get_principalType())
                    });
                }
            }

            function getAllUsersAndGroups(url) {
                var ctx = new SP.ClientContext(url);
                var web = ctx.get_web();
                var groups = web.get_siteGroups();
                var users = web.get_siteUsers();
                ctx.load(groups);
                ctx.load(users);
                ctx.executeQueryAsync(function () {
                    setPermissionItems(groups.getEnumerator());
                    setPermissionItems(users.getEnumerator());
                }, function () {
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
                $ctrl.out = undefined; 
            };

            $ctrl.ok = function () {
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
                     out = items;
                 }
                 return out;
             };
         });


})();
