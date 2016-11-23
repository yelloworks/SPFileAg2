<%-- The following 4 lines are ASP.NET directives needed when using SharePoint components --%>

<%@ Page Inherits="Microsoft.SharePoint.WebPartPages.WebPartPage, Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" MasterPageFile="~masterurl/default.master" Language="C#" %>

<%@ Register TagPrefix="Utilities" Namespace="Microsoft.SharePoint.Utilities" Assembly="Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
<%@ Register TagPrefix="WebPartPages" Namespace="Microsoft.SharePoint.WebPartPages" Assembly="Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
<%@ Register TagPrefix="SharePoint" Namespace="Microsoft.SharePoint.WebControls" Assembly="Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>

<%-- The markup and script in the following Content element will be placed in the <head> of the page --%>
<asp:Content ContentPlaceHolderID="PlaceHolderAdditionalPageHead" runat="server">
    <script type="text/javascript" src="../Scripts/jquery-3.1.1.min.js"></script>  
    <SharePoint:ScriptLink name="sp.js" runat="server" OnDemand="true" LoadAfterUI="true" Localizable="false" />
    <meta name="WebPartPageExpansion" content="full" />

    <!-- Add your CSS styles to the following file -->
    
    <link rel ="stylesheet" type="text/css" href="../Content/bootstrap.min.css">
    <link rel ="stylesheet" type="text/css" href="../Content/ui-bootstrap-csp.css">
    <link rel ="stylesheet" type = "text/css" href="../Content/angular-tree-widget.min.css">
    <link rel ="stylesheet" type="text/css"href="../Content/ui-grid.css">
    <link rel ="Stylesheet" type="text/css" href="../Content/App.css" />

    <!-- Add your JavaScript to the following file -->
    
    <script type="text/javascript" src="../Scripts/angular.js"></script>
    <script type="text/javascript" src="../Scripts/angular-animate.js"></script>
    <script type="text/javascript" src="../Scripts/angular-recursion.js"> </script>
    <script type="text/javascript" src="../Scripts/angular-sanitize.js"></script>
    <script type="text/javascript" src="../Scripts/angular-touch.js"></script>
    <script type="text/javascript" src="../Scripts/bootstrap.min.js"></script>
    <script type="text/javascript" src="../Scripts/angular-ui/ui-bootstrap.js"> </script>
    <script type="text/javascript" src="../Scripts/angular-ui/ui-bootstrap-tpls.min.js"> </script>   
    <script type ="text/javascript" src="../Scripts/ui-grid.js"></script>
   
    <script type="text/javascript" src="../Scripts/angular-tree-widget.js"> </script>
    <script type="text/javascript" src="../Scripts/App.js"></script>
    <script type="text/javascript" src ="../Scripts/controllers/controller.js"> </script>
    <script type ="text/javascript" src ="../Scripts/context.js"></script>
    

    <style>
        .grid {
      width: 500px;
      height: 250px;
    }
    </style>
    <script>
       
    </script>

</asp:Content>

<%-- The markup in the following Content element will be placed in the TitleArea of the page --%>
<asp:Content ContentPlaceHolderID="PlaceHolderPageTitleInTitleArea" runat="server">
    Page Title
</asp:Content>

<%-- The markup and script in the following Content element will be placed in the <body> of the page --%>
<asp:Content ContentPlaceHolderID="PlaceHolderMain" runat="server">
    <input type="button" value="Button 3" onclick="documentQuery();"/>      
       
    <html lang="en" ng-app="Abs" >
<%--    <div ng-app="app">
        
            <div ng-controller="MainCtrl">
                <button type="button" id="reset" class="btn btn-success" ng-click="reset()">Reset</button>
                <div id="grid1" ui-grid="{ data: myData }" class="grid"></div>
            </div>
        </div>--%>
    <div>             
        <div class="col-ms-12 menu-panel">
            <div class="menu-panel-group">
                <div class="menu-btn-group">
                    <button type="button" class="btn-primary btn-lg menu-btn-big"><span class="glyphicon glyphicon-paste big"></span><br>Paste </button>
                </div>
                <div class="menu-btn-group">
                    <button type="button" class="btn-primary btn-lg menu-btn-small"><span class="glyphicon glyphicon-copy"></span> Copy </button>
                    <button type="button" class="btn-primary btn-lg menu-btn-small"><span class="glyphicon glyphicon-scissors"></span> Cut </button>
                </div>
                <div class="menu-btn-group">
                    <button type="button" class="btn-primary btn-lg menu-btn-big"><span class="glyphicon glyphicon-plus big"></span>Add folder</button>
                </div>
            </div>
            <div class="menu-panel-group">
                <div class="menu-btn-group">
                    <button type="button" class="btn-primary btn-lg menu-btn-small"><span class="glyphicon glyphicon-lock"></span> Lock </button>
                    <button type="button" class="btn-primary btn-lg menu-btn-small"><span class="glyphicon glyphicon-lock"></span> Unlock </button>
                </div>
                <div class="menu-btn-group">
                    <button type="button" class="btn-primary btn-lg menu-btn-big"><span class="glyphicon glyphicon-retweet big"></span><br>Discard<br>checkout </button>
                </div>
                <div class="menu-btn-group">
                    <button type="button" class="btn-primary btn-lg menu-btn-big"><span class="glyphicon glyphicon-list-alt big"></span><br>Edit<br>metadata </button>
                </div>
                <div class="menu-btn-group">
                    <button type="button" class="btn-primary btn-lg menu-btn-big"><span class="glyphicon glyphicon-user big"></span><br>Permissions </button>
                </div>
            </div>
            <div class="menu-panel-group">
                <div class="menu-btn-group" ng-controller="DropdownCtrl">
                    <div class="btn-group" uib-dropdown dropdown-append-to-body>
                        <button id="btn-dload" type="button" class="btn btn-primary menu-btn-small" uib-dropdown-toggle>
                            Download <span class="caret"></span>
                        </button>
                        <ul class="dropdown-menu" uib-dropdown-menu role="menu" aria-labelledby="btn-dload">
                            <li role="menuitem">
                                <a href="#">Download</a>
                            </li>
                            <li role="menuitem">
                                <a href="#">Archive</a>
                            </li>                           
                        </ul>
                    </div>
                    <div class="btn-group" uib-dropdown dropdown-append-to-body>
                        <button id="btn-upload" type="button" class="btn btn-primary menu-btn-small" uib-dropdown-toggle>
                            Upload <span class="caret"></span>
                        </button>
                        <ul class="dropdown-menu" uib-dropdown-menu role="menu" aria-labelledby="btn-upload">
                            <li role="menuitem">
                                <a href="#">File</a>
                            </li>
                            <li role="menuitem">
                                <a href="#">Folder</a>
                            </li>
                        </ul>
                    </div>
                </div> 
            </div>
        </div>
        <div>
            

                <div ng-controller="TreeController">

                    <div class="col-sm-4">
                        <div class="tree-container">
                            <tree nodes='treeNodes' options='options'></tree>
                        </div>
                    </div>
                </div>

           
            <div class = "col-sm-8" ng-controller="TabsDemoCtrl">             
               <uib-tabset active="active">
                   <uib-tab index="0" heading="Static title">
                       <div ng-controller="MainCtrl">
                           <button type="button" id="try" class="btn btn-success" ng-click="getDir()">Try</button>
                           <br>
                           <br>
                           <div id="grid1" ui-grid="gridOpts" class="grid""></div>
<%--                           
                           <div id="grid1" ui-grid="gridOpts" class="grid"></div>--%>
                       </div>
                   </uib-tab>
                    <uib-tab index="$index + 1" ng-repeat="tab in tabs" heading="{{tab.title}}" disable="tab.disabled">
                        {{tab.content}}
                    </uib-tab>
                    <uib-tab index="3" select="alertMe()">
                        <uib-tab-heading>
                            <i class="glyphicon glyphicon-bell"></i> Alert!
                        </uib-tab-heading>
                        I've got an HTML heading, and a select callback. Pretty cool!
                    </uib-tab>
                </uib-tabset>
            </div>
       </div>
 
    </div>
  




  </html>   

</asp:Content>
