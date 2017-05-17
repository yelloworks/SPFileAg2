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
    <link href="//cdnjs.cloudflare.com/ajax/libs/angularjs-toaster/2.1.0/toaster.css" rel="stylesheet" />
    <%--<link rel ="stylesheet" type="text/css"href="../Content/toaster.css">--%>

    <link rel ="Stylesheet" type="text/css" href="../Content/App.css" />
    <link rel ="stylesheet" type="text/css" href ="../Content/fileTable.css">

    <!-- Add your JavaScript to the following file -->
    
    <script type="text/javascript" src="../Scripts/jquery-3.1.1.min.js"></script>
    <script type="text/javascript" src="../Scripts/jquery-ui-1.12.1.min.js"></script>
    
    <script src="//ajax.googleapis.com/ajax/libs/angularjs/1.5.8/angular.js" type="text/javascript"></script>
    <%--<script type="text/javascript" src="../Scripts/angular.js"></script>--%>
    <script src="//ajax.googleapis.com/ajax/libs/angularjs/1.5.8/angular-animate.js" type="text/javascript"></script>
    <%--<script type="text/javascript" src="../Scripts/angular-animate.js"></script>--%>
    <script type="text/javascript" src="../Scripts/angular-recursion.js"> </script>
    <script src="//ajax.googleapis.com/ajax/libs/angularjs/1.5.8/angular-sanitize.js" type="text/javascript"></script>
    <%--<script type="text/javascript" src="../Scripts/angular-sanitize.js"></script>--%>
    <script src="//ajax.googleapis.com/ajax/libs/angularjs/1.5.8/angular-touch.js" type="text/javascript"></script>
    <%--<script type="text/javascript" src="../Scripts/angular-touch.js"></script>--%>
    

    <script type="text/javascript" src="../Scripts/bootstrap.min.js"></script>
    <script type="text/javascript" src="../Scripts/angular-ui/ui-bootstrap.js"> </script>
    <script type="text/javascript" src="../Scripts/angular-ui/ui-bootstrap-tpls.min.js"> </script>   
    <script type ="text/javascript" src="../Scripts/ui-grid.js"></script>
    <script type ="text/javascript" src="../Scripts/ngSelectable.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/angularjs-toaster/2.1.0/toaster.js"></script>
    <%--<script type ="text/javascript" src="../Scripts/toaster.js"></script>--%>
    

    <script type="text/javascript" src="../Scripts/angular-tree-widget.js"> </script>
    <script type="text/javascript" src="../Scripts/App.js"></script>
    <script type="text/javascript" src ="../Scripts/controllers/controller.js"> </script>
    <script type ="text/javascript" src ="../Scripts/context.js"></script>
    <script type ="text/javascript" src ="../Scripts/directives/ribbonMenu.js"></script>

   
    <style>
        #adress div {
          display:inline-block  
        }
         
    </style>

    <script>
       
    </script>

</asp:Content>

<%-- The markup in the following Content element will be placed in the TitleArea of the page --%>
<asp:Content ContentPlaceHolderID="PlaceHolderPageTitleInTitleArea" runat="server">

</asp:Content>

<%-- The markup and script in the following Content element will be placed in the <body> of the page --%>
<asp:Content ContentPlaceHolderID="PlaceHolderMain" runat="server">
       
    <html lang="en" >

    <div ng-controller ="MainInterface">  
        <%--<toaster-container toaster-options="{'close-button':false, 'time-out':{ 'toast-warning': 2000, 'toast-error': 0 } }"></toaster-container>--%>
        <ribbon-menu></ribbon-menu>        
        <div>
<%--                <div ng-controller="TreeController">

                    <div class="col-sm-4">
                        <div class="tree-container">
                            <tree nodes='treeNodes' options='options'></tree>
                        </div>
                    </div>
                </div>--%>

           
            <div class = "col-sm-8" ng-controller="tabsCtrl">             
               <uib-tabset active="activeTab">
                    <uib-tab index="$index" ng-repeat="tab in tabs" select="onSelection($index)" >     
                        <uib-tab-heading>
                            {{tab.title}}                           
                            <i type="button" ng-click="removeTab($index, $event)" class="glyphicon glyphicon-remove"> </i>
                        </uib-tab-heading>                                         
                        <section ng-controller="tabContentController" ng-init="onStart($index)" style="border: 1px solid black">
                            <div>
                                <div id="adress" style ="display: inline-block" >
                                   <button type="button" ng-click ="upBtnClicked()" ng-disabled ="upBtndisabled" class ="btn adress-btn"><span class="glyphicon glyphicon-arrow-up"></span> </button>
                                    <button type="button" ng-click ="refreshPage()"  class ="btn adress-btn"> <span class="glyphicon glyphicon-refresh"></span></button>
                                   <div style ="display: inline-block">Adress:</div> <div ng-repeat ="item in adressArray track by $index" class="btn adressItems" ng-click  ="adressItemClicked($index)"> <span class ="glyphicon glyphicon-chevron-right"></span><label>{{item}}</label></div>
                                </div>
                                <div></div>
                            </div>                         
                            <ul id="selectable"
                                selectable="selection"
                                selectable-list="fileItems"
                                selectable-out="selected"
                                selectable-events="{start:'selectionStart()', stop:'selectionStop($selected)'}">
                                <li class="ui-widget-content" ng-repeat="fileItem in fileItems" ng-dblClick="doubleClick()">{{fileItem.name}}</li>
                            </ul>
                        </section>                                            
                    </uib-tab>
                   <uib-tab ng-click="addWorkspace()">
                       <uib-tab-heading>
                           <i class="glyphicon glyphicon-plus"></i>
                       </uib-tab-heading>
                   </uib-tab>
               </uib-tabset>
            </div>
       </div>
 
    </div>
  




  </html>   

</asp:Content>
