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
    
    <link rel="stylesheet" type="text/css" href="../Content/bootstrap.min.css">
    <link rel="Stylesheet" type="text/css" href="../Content/App.css" />

    <!-- Add your JavaScript to the following file -->
    <script type="text/javascript" src="../Scripts/App.js"></script>
    <script type="text/javascript" src="../Scripts/angular.min.js"></script>
    <script type="text/javascript" src="../Scripts/angular-ui/ui-bootstrap.js"> </script>

    <script>
        angular.module('myModule', ['ui.bootstrap']);
    </script>

</asp:Content>

<%-- The markup in the following Content element will be placed in the TitleArea of the page --%>
<asp:Content ContentPlaceHolderID="PlaceHolderPageTitleInTitleArea" runat="server">
    Page Title
</asp:Content>

<%-- The markup and script in the following Content element will be placed in the <body> of the page --%>
<asp:Content ContentPlaceHolderID="PlaceHolderMain" runat="server">

    <div>
        <div class="menu-panel">
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
                <div class="menu-btn-group">
                   
                </div>
        </div>
            </div>
        <p id="message">
            <!-- The following content will be replaced with the user name when you run the app - see App.js -->
            initializing...
        </p>
    </div>
 <div class="btn-group">
                        <button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown">Действие <span class="caret"></span></button>
                        <ul class="dropdown-menu" role="menu">
                            <li>
                                <a href="#">Действие</a>
                            </li>
                            <li>
                                <a href="#">Другое действие</a>
                            </li>
                            <li>
                                <a href="#">Что-то иное</a>
                            </li>
                            <li class="divider"></li>
                            <li>
                                <a href="#">Отдельная ссылка</a>
                            </li>
                        </ul>
                    </div>
</asp:Content>
