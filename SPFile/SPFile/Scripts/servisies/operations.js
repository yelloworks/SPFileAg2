(function () {
    angular.module('Abs')
        .factory('fileOperations',
        function ($q, $log, toaster) {
            var methods = {};

            var url = "";


            methods.CopyOrMove = function (itemUrl, sourceListId, sourceRelativeUrl, soutceItemId, destRelativeUrl, destListId, objectType, itemName, moveItem) {
                url = itemUrl;
                if (url.charAt(url.length - 1) == '/') {
                    url = url.slice(0, -1);
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

            function copyOrMoveFolder(listId, relativeUrl, destenationListId, destenationRelUrl, folderId, move) {
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
                ctx.executeQueryAsync(function (sender, args) {
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
                    function (sender, args) {
                        alert("failed. Message:" + args.get_message());
                    });
                return deferred.promise;
            }

            function asyncCopyFolder(files) {
                var promises = files.map(function (file) {
                    var defered = $q.defer();
                    createFolder(file.destenationListId,
                            file.newFolder,
                            function (folder) {
                                //no create info
                            },
                            function (sender, args) {
                                toaster.pop('error',
                                    "Create folder",
                                    args.get_message(),
                                    3000,
                                    'trustedHtml');
                            },
                            file.currentItemId,
                            file.destenationRelUrl)
                        .then(function (args) {
                            copyOrMoveFile(args[0], args[1] + "/" + args[2], file.listId, file.move).then(function () {
                                defered.resolve();
                            });
                        });
                    return defered.promise;
                });
                return $q.all(promises);

            }

            function createFolder(listId, folderUrl, success, error, currentItemId, destenationRelUrl) {
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
                            var destFileUrl = url + "/" + destanationPath + '/' + file.get_name();
                            moveItem
                                ? file.moveTo(destFileUrl, SP.MoveOperations.overwrite)
                                : file.copyTo(destFileUrl, SP.MoveOperations.overwrite);


                            ctx.executeQueryAsync(
                                function (sender, args) {
                                    deferred.resolve();
                                },
                                function (sender, args) {
                                   // alert("Error copying the file.");
                                    deferred.reject(sender, args);
                                }
                            );
                        } else {
                           // alert("404 FILE NOT FOUND!!!");
                            deferred.reject(sender, args);
                        }
                    },
                    function (sender, args) {
                        //alert("Error while getting the file.");
                        deferred.reject(sender, args);
                    }
                );
                return deferred.promise;
            }

            methods.createNewFolder = function (itemUrl, destListId, folderUrl) {
                url = itemUrl;
                createFolder(destListId,
                    folderUrl,
                    function (folder) {
                        toaster.pop('success',
                            "Create folder",
                            String.format("Folder '{0}' has been created", folder.get_name()),
                            3000,
                            'trustedHtml');
                    },
                    function (sender, args) {
                        toaster('error',
                            "Create folder",
                            args.get_message(),
                            3000,
                            'trustedHtml');
                    },
                    "",
                    "");
            };

            function removeFirstSlash(item) {
                var curItem = item;
                if (curItem.charAt(0) == '/') { 
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
                    },
                    function (sender, args) {
                        defered.reject(args.get_message());
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
                    },
                    function (sender, args) {
                        defered.reject(args.get_message());
                    }
                );
                return defered.promise;

            }

            return methods;
        });

    angular.module('Abs')
        .factory('checkOperations',
            function ($log, toaster) {
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
                methods.undoCheckOut = function (url, listId, relativeUrl, itemId, objectType) {
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
                    },
                        function (sender, args) {
                        });
                }

                function checkOutFile(url, listId, itemId) {
                    var ctx = new SP.ClientContext(url);
                    var list = ctx.get_web().get_lists().getById(listId);
                    var item = list.getItemById(itemId);
                    var file = item.get_file();
                    file.checkOut();
                    ctx.executeQueryAsync(function (sender, args) {

                    },
                        function (sender, args) {

                        });

                }

                function undoCheckOutFile(url, listId, itemId) {
                    var ctx = new SP.ClientContext(url);
                    var list = ctx.get_web().get_lists().getById(listId);
                    var item = list.getItemById(itemId);
                    var file = item.get_file();
                    var name = file.get_checkedOutByUser();
                    ctx.load(name);
                    ctx.executeQueryAsync(function (sender, args) {
                        file.undoCheckOut();
                        ctx.executeQueryAsync(function () {
                        }, function (sender, args) {

                        });
                    },
                        function (sender, args) {

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
                                deferred.resolve();
                            },
                                function (sender, args) {
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

                    }, function (sender, args) {  });
                }

                return methods;
            });

    angular.module('Abs')
        .factory('loadOperations',
            function ($log) {
                var methods = {};

                methods.downloadSingleFile = function (url, listId, itemId) {
                    var ctx = new SP.ClientContext(url);
                    var web = ctx.get_web();
                    ctx.load(web);
                    var list = ctx.get_web().get_lists().getById(listId);
                    var item = list.getItemById(itemId);
                    var file = item.get_file();
                    ctx.load(file);
                    ctx.executeQueryAsync(function (sender, args) {
                        var path = file.get_serverRelativeUrl();
                        var webRootFolder = web.get_serverRelativeUrl();
                        var clearPath = path.replace(webRootFolder, "");
                        window.location.href = url + "/_layouts/download.aspx?SourceUrl=" + url + clearPath;
                    },
                        function (sender, args) {

                        });

                };

                methods.uploadSingleFile = function (files, url, listId, targetRelUrl) {

                    for (var i = 0; i < files.length; i++) {
                        upload(files[i], url, listId, targetRelUrl);
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
                        clientContext.executeQueryAsync(function () {  },
                            function (sender, args) {  });
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

    angular.module('Abs')
        .factory('buttonOperations',
        [
             'selectedBufferService', 'bufferService', '$log', 'fileOperations', 'checkOperations',
            'loadOperations',
            '$uibModal', 'toaster', function(
                selectedBufferService,
                bufferService,
                $log,
                fileOperations,
                checkOperations,
                loadOperations,
                $uibModal,
                toaster) {

                var methods = {};

                var showToast = {
                    success: function(toastTytle, toastBody) {
                        toaster.pop({
                            type: 'success',
                            title: toastTytle,
                            body: toastBody,
                            timeout: 5000,
                            bodyOutputType: 'trustedHtml'
                        });
                    },
                    error: function(toastTytle, toastBody) {
                        toaster.pop({
                            type: 'error',
                            title: toastTytle,
                            body: toastBody,
                            timeout: 5000,
                            bodyOutputType: 'trustedHtml'
                        });
                    },
                    warning: function(toastTytle, toastBody) {
                        toaster.pop({
                            type: 'warning',
                            title: toastTytle,
                            body: toastBody,
                            timeout: null,
                            bodyOutputType: 'trustedHtml'
                        });
                    }
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
                                actionToDo: function () { return "Delete"; },
                                itemsCount: function () { return sourceItems.length; }
                            }
                        });

                        modalInstance.result.then(function () {
                            sourceItems.forEach(function (item, i, arr) {
                                method(sourceUrl, sourceListId, item.ID)
                                    .then(function () {
                                        showToast.success("Delete items", "Item deleted: " + item.name);
                                    },
                                        function (error) {
                                            showToast.error("Delete items", item.name + "\n" + error);
                                        });

                            });
                        },
                            function () {
                                $log.info('Modal dismissed at: ' + new Date());
                            });

                    }
                };


                methods.copyItems = function () {
                    bufferService.setBuffer(selectedBufferService.getBuffer(),
                            selectedBufferService.getInfo(),
                            false);
                    toaster.clear();
                    showToast.warning("Copied", bufferService.getItemsList());
                };

                methods.pasteItems = function () {
                    var sourceItems = bufferService.getBuffer();
                    var sourceUrl = bufferService.getUrl();
                    var sourceListId = bufferService.getListId();
                    var sourceRelativeUrl = bufferService.getClearRelativeUrl();
                    var isCuted = bufferService.getIsCuted();
                    var destinationUrl = selectedBufferService.getClearRelativeUrl();
                    var destinationListId = selectedBufferService.getlistID();
                    if (sourceItems.length != 0) {
                        sourceItems.forEach(function (item, i, arr) {
                            fileOperations.CopyOrMove(sourceUrl,
                                sourceListId,
                                sourceRelativeUrl,
                                item.ID,
                                destinationUrl,
                                destinationListId,
                                item.type,
                                item.name,
                                isCuted);
                        });

                    }
                };

                methods.cutItems = function () {
                    bufferService.setBuffer(selectedBufferService.getBuffer(), selectedBufferService.getInfo(), false);
                    toaster.clear();
                    showToast.warning("Cuted", bufferService.getItemsList());
                };

                methods.addNewFolder = function() {
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
                        itnew.push(folderName);
                        var relativeUrl = itnew.join('/');
                        fileOperations.createNewFolder(url, listId, relativeUrl);
                    },
                        function () {
                            $log.info('Modal dismissed at: ' + new Date());
                        });
                };

                methods.discardItemsCheckout = function () {
                    var sourceItems = selectedBufferService.getBuffer();
                    var sourceUrl = selectedBufferService.getUrl();
                    var sourceListId = selectedBufferService.getlistID();
                    var sourceRelativeUrl = selectedBufferService.getRelativeUrl();

                    if (sourceItems.length != 0) {
                        sourceItems.forEach(function (item, i, arr) {
                            checkOperations
                                .undoCheckOut(sourceUrl, sourceListId, sourceRelativeUrl, item.ID, item.type);
                        });
                    }
                };

                methods.deleteItems = function() {
                    deleteForEachSelected(fileOperations.deleteItem);
                };

                methods.deleteItemsPermanent = function() {
                    deleteForEachSelected(fileOperations.deleteItemToRecycle);
                };

                methods.downloadFile = function() {
                    var sourceItems = selectedBufferService.getBuffer();
                    var sourceUrl = selectedBufferService.getUrl();
                    var sourceListId = selectedBufferService.getlistID();
                    if (sourceItems.length != 0) {
                        sourceItems.forEach(function (item, i, arr) {
                            if (item.type == 0) {
                                loadOperations.downloadSingleFile(sourceUrl, sourceListId, item.ID);
                            };
                        });
                    }
                };

                methods.permissions = function() {
                    if (selectedBufferService.getBuffer().length != 0) {
                        var modalInstance = $uibModal.open({
                            animation: true,
                            templateUrl: 'permissionsModal.html',
                            controller: 'permissionsModal',
                            controllerAs: '$ctrl',
                            size: "lg",
                            resolve: {
                                items: function () {
                                    return selectedBufferService.getBuffer();
                                },
                                url: function () {
                                    return selectedBufferService.getUrl();
                                },
                                listId: function () {
                                    return selectedBufferService.getlistID();
                                }
                            }
                        });
                        modalInstance.result.then(function () {
                        },
                            function () {
                                $log.info('Modal dismissed at: ' + new Date());
                            });
                    };
                };

                methods.uploadFile = function(files) {
                    var sourceUrl = selectedBufferService.getUrl();
                    var sourceListId = selectedBufferService.getlistID();
                    var sourceRelativeUrl = selectedBufferService.getRelativeUrl();
                    loadOperations.uploadSingleFile(files, sourceUrl, sourceListId, sourceRelativeUrl);
                }

                return methods;
            }
        ]);

})();
