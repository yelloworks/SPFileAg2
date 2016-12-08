<%-- The following 4 lines are ASP.NET directives needed when using SharePoint components --%>

<%@ Page Inherits="Microsoft.SharePoint.WebPartPages.WebPartPage, Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" MasterPageFile="~masterurl/default.master" Language="C#" %>

<%@ Register TagPrefix="Utilities" Namespace="Microsoft.SharePoint.Utilities" Assembly="Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
<%@ Register TagPrefix="WebPartPages" Namespace="Microsoft.SharePoint.WebPartPages" Assembly="Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
<%@ Register TagPrefix="SharePoint" Namespace="Microsoft.SharePoint.WebControls" Assembly="Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>

<%-- The markup and script in the following Content element will be placed in the <head> of the page --%>
<asp:Content ContentPlaceHolderID="PlaceHolderAdditionalPageHead" runat="server">
    
    

    <SharePoint:ScriptLink name="sp.js" runat="server" OnDemand="true" LoadAfterUI="true" Localizable="false" />
    <meta name="WebPartPageExpansion" content="full" />

    <!-- Add your CSS styles to the following file -->
    
    <link rel ="stylesheet" type="text/css" href="../Content/bootstrap.min.css">
    <link rel ="stylesheet" type="text/css" href="../Content/ui-bootstrap-csp.css">
    <link rel ="stylesheet" type = "text/css" href="../Content/angular-tree-widget.min.css">
    <link rel ="stylesheet" type="text/css"href="../Content/ui-grid.css">
    <link rel ="Stylesheet" type="text/css" href="../Content/App.css" />

    <!-- Add your JavaScript to the following file -->
    
    <script type="text/javascript" src="../Scripts/jquery-3.1.1.min.js"></script>
    <script type="text/javascript" src="../Scripts/jquery-ui-1.12.1.min.js"></script>
    <script type="text/javascript" src="../Scripts/angular.js"></script>
    <script type="text/javascript" src="../Scripts/angular-animate.js"></script>
    <script type="text/javascript" src="../Scripts/angular-recursion.js"> </script>
    <script type="text/javascript" src="../Scripts/angular-sanitize.js"></script>
    <script type="text/javascript" src="../Scripts/angular-touch.js"></script>
    <script type="text/javascript" src="../Scripts/bootstrap.min.js"></script>
    <script type="text/javascript" src="../Scripts/angular-ui/ui-bootstrap.js"> </script>
    <script type="text/javascript" src="../Scripts/angular-ui/ui-bootstrap-tpls.min.js"> </script>   
    <script type ="text/javascript" src="../Scripts/ui-grid.js"></script>
    <script type ="text/javascript" src="../Scripts/ngSelectable.js"></script>
   
    

    <script type="text/javascript" src="../Scripts/angular-tree-widget.js"> </script>
    <script type="text/javascript" src="../Scripts/App.js"></script>
    <script type="text/javascript" src ="../Scripts/controllers/controller.js"> </script>
    <script type ="text/javascript" src ="../Scripts/context.js"></script>
    <script type ="text/javascript" src ="../Scripts/directives/ribbonMenu.js"></script>

    

    <style>
        section {
            width: 700px;
            margin: auto;
        }

        ul {
            list-style: none outside none;
            display: inline-block;
            width: 45%;
        }

        .selected-friends {
            border: 1px solid #444;
            border-radius: 5px;
            padding: 2px;
            margin: 2px;
        }

        #feedback { font-size: 1.4em; }

        #selectable .ui-selecting { background: #FECA40; }

        #selectable .ui-selected {
            background: #F39814;
            color: white;
        }

        #selectable {
            list-style-type: none;
            margin: 0;
            padding: 0;
        }

        #selectable li {
            width: auto;
            padding: 5px 10px;
            margin: 5px 0;
            border: 2px solid #444;
            border-radius: 5px;
            font-size: 1.1em;
            font-weight: bold;
            text-align: center;
        }

        .logList {
            float: right;
            min-height: 200px;
            padding: 5px 15px;
            border: 5px solid #000;
            border-radius: 15px;
        }

        .logList:before {
            content: 'log';
            padding: 0 5px;
            position: relative;
            top: -1.1em;
            background-color: #FFF;
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
       
    <html lang="en" ng-app="Abs" >

    <div>  
        <ribbon-menu></ribbon-menu>
        
        <div ng-controller ="tmpCtrl">
            <input type="button" ng-click="$log.log(refresh())" /> 
        </div>
        <div>
<%--                <div ng-controller="TreeController">

                    <div class="col-sm-4">
                        <div class="tree-container">
                            <tree nodes='treeNodes' options='options'></tree>
                        </div>
                    </div>
                </div>--%>

           
            <div class = "col-sm-8" ng-controller="TabsDemoCtrl">             
               <uib-tabset active="active">
                   <uib-tab index="0" heading="Static title">
                       <div ng-controller="MainCtrl">
                           <br>
                           <br>
                           <div id="grid1" ui-grid="gridOpts" class="grid" ng-init="onstart()"></div>
<%--                           
                           <div id="grid1" ui-grid="gridOpts" class="grid"></div>--%>
                       </div>
                   </uib-tab>
                    <uib-tab index="$index + 1" ng-repeat="tab in tabs" heading="{{tab.title}}" select="onSelection($index)" >
                        
                        
                        <section ng-controller="tabContentController">

                            <p>
                                You've selected:
                                <span ng-hide="selected">none</span>
                                <span class="selected-friends" ng-repeat="friend in selected"> {{friend.name}}</span>
                            </p>

                            <ul id="selectable"
                                selectable="selection"
                                selectable-list="friends"
                                selectable-out="selected"
                                selectable-events="{start:'selectionStart()', stop:'selectionStop($selected)'}">
                                <li class="ui-widget-content" ng-repeat="friend in friends">{{friend.name}}</li>
                            </ul>
                        </section>                                            

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
