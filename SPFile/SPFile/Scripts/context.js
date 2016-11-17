ExecuteOrDelayUntilScriptLoaded(initPage, "sp.js");


    function documentQuery() {
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
        this.allDocumentsCol = oLibDocs.getItems(caml);
        ctx.load(this.allDocumentsCol, "Include(FileLeafRef, ServerUrl, FSObjType )");
        ctx.executeQueryAsync(Function.createDelegate(this, this.onSucceededCallback),
            Function.createDelegate(this, this.onFailedCallback));
    }

    function onSucceededCallback(sender, args) {
        var libList = "";
        var ListEnumerator = this.allDocumentsCol.getEnumerator();

        while (ListEnumerator.moveNext()) {
            var currentItem = ListEnumerator.get_current();
            var currentItemURL = _spPageContextInfo.webServerRelativeUrl + currentItem.get_item('ServerUrl');
            var currentItemType = currentItem.get_item('FSObjType');
            libList += currentItem.get_item('FileLeafRef') + ' : ' + currentItemType + '\n';
        }
        alert(libList);
    }

    function onFailedCallback(sender, args) {
        alert("failed. Message:" + args.get_message());

    }
