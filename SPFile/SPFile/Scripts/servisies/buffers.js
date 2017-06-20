(function () {
    angular.module('Abs')
        .factory('bufferService',
            function () {
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

                methods.getBuffer = function () {
                    return buffer;
                };
                methods.getUrl = function () {
                    return info.url;
                };
                methods.getListId = function () {
                    return info.listId;
                };
                methods.getRelativeUrl = function () {
                    return info.relativeUrl;
                };
                methods.getIsCuted = function () {
                    return cuted;
                };
                methods.getRootFolder = function () {
                    return info.relativeSiteUrl;
                };

                //Handlers
                methods.getClearRelativeUrl = function () {
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

           methods.getInfo = function () {
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

})();
