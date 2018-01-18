/*
* =========================================================================
* Copyright 2017 T-Mobile USA, Inc.
* 
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =========================================================================
*/

'use strict';
(function(app) {

    app.controller('PeriscopeCtrl', function($scope, $rootScope, fetchData, periscopeService, $interval, UtilityService, $state, $timeout, $filter) {

        $scope.autoCompleteShowResults = true;
        $scope.applyStickyTop = false;
        $scope.dropdown = false;
        $scope.showSearchedResults = false;
        $scope.searchOptionsValues = [];

        $scope.userNamePlate = [];
        $scope.accountNamePlate = [];
        $scope.roleNamePlate = [];
        $scope.permissionPlate = [];
        $scope.tableSearchPlates = [];
        $scope.hideClearbtn = false;
        $rootScope.isScrolling = false;
        $scope.showSearchTagsContainer = false;
        $scope.selectHistory = [];
        $scope.periscopeSearch = {
            overAllSearch: '',
            userName: '',
            roleName: '',
            accountName: '',
            permission: ''
        };

        $scope.periscopeHeaders = [{
            display: 'USERNAME',
            variable: 'userName',
            filter: 'text',
            sort: true,
            show: true
        }, {
            display: 'ACCOUNT',
            variable: 'accountName',
            filter: 'text',
            sort: true,
            show: true
        }, {
            display: 'ROLES',
            variable: 'roles',
            filter: 'text',
            sort: true,
            show: true
        }];

        $scope.tableOptions = {
            "overAllsearchString": [],
            "userNameSearch": [],
            "accountNameSearch": [],
            "roleNameSearch": [],
            "permissionSearch": [],
        };

        $scope.permissionPopup = {
            'roleName': '',
            'userName': '',
            'accountName': '',
            'permissionList': ''
        };
        $scope.activeRow = 0;
        $scope.accountList = {
            'isListExpanded': []
        };
        $scope.accountList.isListExpanded = [];
        $scope.sortKeys = {};
        $scope.sorting = {
            column: 'groupName',
            descending: false
        };

        $scope.dropDownValArray = {
            'userNameDropdownVal':[],
            'accountNameDropdownVal':[],
            'roleNameDropdownVal':[],
            'permissionDropdownVal':[]
        }
        $scope.totalDropdownVal = [];
        $rootScope.loadingDropDownData = false;

        var assignDropdownVal = function(variableChanged){
            switch (variableChanged) {
                case 'userName':
                    $scope.dropDownValArray.userNameDropdownVal = [];
                    break;
                case 'accountName':
                    $scope.dropDownValArray.accountNameDropdownVal = [];
                    break;
                case 'roleName':
                    $scope.dropDownValArray.roleNameDropdownVal = [];
                    break;
                case 'permission':
                    $scope.dropDownValArray.permissionDropdownVal = [];
                    break;

            }
        }


        $scope.$watch('periscopeSearch', function(newVal, oldVal) {
            var variableChanged = '';
            if (newVal.userName != undefined && newVal.userName != oldVal.userName) {
                variableChanged = 'userName';
            } else if (newVal.accountName != undefined && newVal.accountName != oldVal.accountName) {
                variableChanged = 'accountName';
            } else if (newVal.roleName != undefined && newVal.roleName != oldVal.roleName) {
                variableChanged = 'roleName';
            } else if (newVal.permission != undefined && newVal.permission != oldVal.permission) {
                variableChanged = 'permission';

            }

            if (newVal[variableChanged] != undefined) {
                var enteredVal = newVal[variableChanged].split(","); // periscopeSearch.userName
                var newLetter = enteredVal[enteredVal.length - 1];
                newLetter = newLetter.replace(" ", "");

                if (newLetter.length === 0) {
                    assignDropdownVal(variableChanged);
                    $scope.totalDropdownVal = [];
                    $rootScope.loadingDropDownData = true;
                }

                if (variableChanged === 'permission') {
                    variableChanged = 'actionName';
                }
                $scope.getDropdownData(variableChanged, newLetter);
            } else {
                assignDropdownVal(variableChanged);
            }
        }, true);

        $scope.getDropdownData = function(searchFieldName, searchFieldText) {
            periscopeService.getDropdownData(searchFieldName, searchFieldText).then(function(res, error) {
              var serviceData;
              if (res) {
                serviceData = res;
                $scope.loadingDataFrDropdown = serviceData.loadingDataFrDropdown;
                $scope.erroredFrDropdown = serviceData.erroredFrDropdown;
                $scope.successFrDropdown = serviceData.successFrDropdown;
                massageDataFrDropdown(searchFieldName, serviceData.dataFrmApi);
              } else {
                serviceData = err;
                $scope.commonErrorHandler(serviceData.error, serviceData.error || serviceData.response.data, "getDropdownData");

              }
            })
        };

        var massageDataFrDropdown = function(searchFieldName, dataFrmApi) {
            var serviceData = periscopeService.massageDataFrDropdown(searchFieldName, dataFrmApi, $scope.dropDownValArray);
            $scope.dropDownValArray = serviceData.dropDownValArray;
            $rootScope.loadingDropDownData = false;
            $scope.totalDropdownVal = serviceData.totalDropdownVal;
        }

        var massageData = function() {
            var massageDataFrmService = periscopeService.massageData($scope.dataFrmApi);
            $scope.nodataavailable = massageDataFrmService.nodataavailable
            $scope.myPeriscopeData = massageDataFrmService.outputData;
            $scope.accountNameList = massageDataFrmService.accountNameListData;
        }

        var massageDataForRoles = function() {
            var massageDataFrmService = periscopeService.massageDataForRoles($scope.dataFrmApiForRoles);
            $scope.nodataavailableFrRoles = massageDataFrmService.nodataavailableFrRoles;
            $scope.myPeriscopePermissionList = massageDataFrmService.outputData;
        }



        window.stickToTop = function() {

            if ($scope.applyStickyTop === true) {
                var outer = document.getElementsByClassName("periscope-left-container")[0].getBoundingClientRect();
                var outerUl = document.getElementsByClassName("periscope-user-data")[0].getBoundingClientRect();
                var activeLi = document.getElementsByClassName("user-data ng-scope active")[0].getBoundingClientRect();
                $rootScope.actualOuter = outer.top;
                if ((activeLi.top <= outer.top) && ($rootScope.setLimit === true)) {
                    if ($rootScope.minFixedTopLimit === undefined) {
                        $rootScope.setLimit = false;
                        if (activeLi.top < outer.top) {
                            $rootScope.minFixedTopLimit = outerUl.top + (outer.top - activeLi.top);
                        } else {
                            $rootScope.minFixedTopLimit = outerUl.top;
                        }
                    } else {
                        $rootScope.setLimit = false;
                    }
                }
                if ((outerUl.top <= $rootScope.minFixedTopLimit) || (activeLi.top < outer.top)) {
                    document.getElementsByClassName("moveToTop")[0].style.position = "absolute";
                    document.getElementsByClassName("moveToTop")[0].style.top = 0 + "px";
                    document.getElementsByClassName("moveToTop")[0].style.width = "100%";
                    $('.periscope-user-data').addClass('toAddPadding');

                    if ($rootScope.menuExpanded === false) {
                        $rootScope.activeLiWidth = $rootScope.innerWidth;
                    } else {
                        $rootScope.activeLiWidth = $rootScope.outerWidth;
                    }
                } else {
                    document.getElementsByClassName("moveToTop")[0].style.position = "static";
                    document.getElementsByClassName("moveToTop")[0].style.width = $rootScope.baseWidth;
                    $('.periscope-user-data').removeClass('toAddPadding');
                }

            }
        }


        $scope.removeScrollClass = function() {
            $rootScope.isScrolling = false;
        }
        $scope.userNameHovered = function() {
            $scope.isUserNameHovered = true;
        }
        $scope.userNameNotHovered = function() {
            $scope.isUserNameHovered = false;
        }

        var settingHeightOfTable = function() {
            var valueOfPeriHeight = $scope.periscopeElementHeight;

            $scope.heightOfPeriscopeBody = {
                "height": valueOfPeriHeight
            };
            $scope.heightOfPeriscopeLeftContainer = {
                "height": valueOfPeriHeight
            };
        }


        $scope.filterDropdown = function(e) {
            e.stopPropagation();
            var eventTarget;
            if (($rootScope.isIe === true) || ($rootScope.isFirefox === true)) {
                eventTarget = e.currentTarget;
            } else {
                eventTarget = e.target.offsetParent;
            }

            if ((eventTarget != undefined) && (eventTarget != null)) {
                if ((eventTarget.classList[0] != "table-search-box-wrap") && (eventTarget.classList[0] != "search-icon-input") && (eventTarget.classList[0] != "input-group") && (eventTarget.classList[0] != "searchFilterContainer") && (eventTarget.classList[0] != "mg-searched-contents")) {
                    $scope.dropdown = false;
                } else {
                    if ((eventTarget.classList[0] === "table-search-box-wrap") || (eventTarget.classList[0] != "search-icon-input") || (eventTarget.classList[0] === "mg-searched-contents") || (eventTarget.classList[0] === "input-group") || (eventTarget.classList[0] != "searchFilterContainer")) {
                        $scope.dropdown = !($scope.dropdown);
                    }
                }
            }
        }

        $scope.closeDropdown = function() {
            if ($scope.dropdown) {
                $scope.dropdown = false;
            }
        }

        $scope.getObjLen = function(objInstance) {
            if ((objInstance != undefined) || (objInstance != null)) {
                var keys = Object.keys(objInstance);
                var len = keys.length;
                return len;
            }
        }

        var atLeastOneNonEmpty = function(inputModel){

            var isEmpty = true;
            for (var key in inputModel) {
                if(!(inputModel[key] === '')){
                    isEmpty = true;
                }
            }
            return isEmpty;
        }

        $scope.submitSearch = function() {
            $scope.errored = false;
            $scope.success = false;
            $scope.activeRow = 0;
            $scope.accountList.isListExpanded = [];
            $scope.userNamePlate = [];
            $scope.accountNamePlate = [];
            $scope.roleNamePlate = [];
            $scope.permissionPlate = [];

            var chkEmpty = atLeastOneNonEmpty($scope.periscopeSearch);

            if (chkEmpty) {
                $scope.requestDataFrPeriscope();
                $scope.searchOptionsValues = [{
                    "searchOptVal": [],
                    "searchVariable": ""
                }, {
                    "searchOptVal": [],
                    "searchVariable": "Username"
                }, {
                    "searchOptVal": [],
                    "searchVariable": "Account"
                }, {
                    "searchOptVal": [],
                    "searchVariable": "Role"
                }, {
                    "searchOptVal": [],
                    "searchVariable": "Permission"
                }];
                $scope.showSearchTagsContainer = true;
                $scope.showSearchedResults = true;
                $scope.hideClearbtn = true;
                $scope.dropdown = false;

                var valueOfUsernames = $scope.periscopeSearch.userName;
                var valueOfActionNames = $scope.periscopeSearch.accountName;
                var valueOfRoleNames = $scope.periscopeSearch.roleName;
                var valueOfPermissions = $scope.periscopeSearch.permission;
                var valueOfTableSearch = $scope.periscopeSearch.overAllSearch;

                if (valueOfUsernames != undefined && valueOfUsernames != "") {
                    $scope.userNamePlate = valueOfUsernames.split(",");

                }
                if (valueOfActionNames != undefined && valueOfActionNames != "") {
                    $scope.accountNamePlate = valueOfActionNames.split(",");

                }
                if (valueOfRoleNames != undefined && valueOfRoleNames != "") {
                    $scope.roleNamePlate = valueOfRoleNames.split(",");

                }
                if (valueOfPermissions != undefined && valueOfPermissions != "") {
                    $scope.permissionPlate = valueOfPermissions.split(",");
                }
                if (valueOfTableSearch != undefined && valueOfTableSearch != "") {
                    var splitString = valueOfTableSearch.split(",");

                    for (var k in splitString) {
                        $scope.tableSearchPlates.push(splitString[k]);
                    }
                    $scope.periscopeSearch.overAllSearch = '';
                }

                $scope.tableOptions.userNameSearch = $scope.userNamePlate;
                $scope.tableOptions.accountNameSearch = $scope.accountNamePlate;
                $scope.tableOptions.roleNameSearch = $scope.roleNamePlate;
                $scope.tableOptions.permissionSearch = $scope.permissionPlate;
                $scope.tableOptions.overAllsearchString = $scope.tableSearchPlates;

                $scope.searchOptionsValues = [{
                    "searchOptVal": $scope.tableSearchPlates,
                    "searchVariable": ""
                }, {
                    "searchOptVal": $scope.userNamePlate,
                    "searchVariable": "Username"
                }, {
                    "searchOptVal": $scope.accountNamePlate,
                    "searchVariable": "Account"
                }, {
                    "searchOptVal": $scope.roleNamePlate,
                    "searchVariable": "Role"
                }, {
                    "searchOptVal": $scope.permissionPlate,
                    "searchVariable": "Permission"
                }];

                var i = 0,
                    j = 0;
                while (i < $scope.searchOptionsValues.length) {
                    while (j < $scope.searchOptionsValues[i].searchOptVal.length) {
                        if ($scope.searchOptionsValues[i].searchOptVal[j] != "") {
                            $scope.hideClearbtn = false;
                        }
                        j++;
                    }
                    i++;
                }
                settingHeightOfTable();
            } else {
                $scope.loadingAfterDeleting = false;
                $scope.showSearchTagsContainer = true;
            }
        }

        $scope.goBack = function() {
            $scope.errored = false;
            $scope.showSearchedResults = false;
            $scope.success = false;
            $scope.loadingAfterDeleting = false;
        }

        $scope.deleteTag = function(index, variableName, array, parentArray, strngtodelete) {
            for (var key in $scope.periscopeSearch) {
                if($scope.periscopeSearch[key].indexOf(strngtodelete) != -1){
                    $scope.periscopeSearch[key] = periscopeService.clearAllCommas(strngtodelete, $scope.periscopeSearch[key]);
                }
            }
            if (index > -1) {
                array.splice(index, 1);
            }

            var i = 0,
                j = 0;
            $scope.hideClearbtn = true;
            while (i < $scope.searchOptionsValues.length) {
                while (j < $scope.searchOptionsValues[i].searchOptVal.length) {
                    if ($scope.searchOptionsValues[i].searchOptVal[j] != "") {
                        $scope.hideClearbtn = false;
                    }
                    j++;
                }
                i++;
            }
            $scope.loadingAfterDeleting = true;
            $scope.submitSearch();
        }

        $scope.deleteAllTags = function() {
            $scope.userNamePlate = [];
            $scope.accountNamePlate = [];
            $scope.roleNamePlate = [];
            $scope.permissionPlate = [];

            $scope.searchOptionsValues = [{
                "searchOptVal": [],
                "searchVariable": ""
            }, {
                "searchOptVal": [],
                "searchVariable": "Username"
            }, {
                "searchOptVal": [],
                "searchVariable": "Account"
            }, {
                "searchOptVal": [],
                "searchVariable": "Role"
            }, {
                "searchOptVal": [],
                "searchVariable": "Permission"
            }];

            $scope.periscopeSearch.userName = '';
            $scope.periscopeSearch.accountName = '';
            $scope.periscopeSearch.roleName = '';
            $scope.periscopeSearch.permission = '';

            $scope.hideClearbtn = true;
            $scope.showSearchTagsContainer = false;
            $rootScope.inputSearchPadding = 45 + 'px';
            $scope.inputPadding = {
                "padding-left": $rootScope.inputSearchPadding
            };
            $scope.loadingAfterDeleting = true;
            $scope.submitSearch();
        }

        $scope.commonErrorHandler = function(error, response, block) {
            if ((block === "requestDataFrPeriscope") || (block === null)) {
                $scope.loadingData = false;
                $scope.errored = true;
                $scope.success = false;
                $scope.nodataavailable = false;
                $scope.loadingAfterDeleting = false;
                $scope.errorMsg = "Please try again, if the issue persists contact Vault Administrator";
                console.log("Data from service is not in expected Format ", error);
                if ((response != undefined) || (response != null)) {
                    if (response.message) {
                        $scope.errorMsg = response.message;
                        console.log(response.message);
                    }
                }
            }
            if (block === "requestRolesFrPeriscope") {
                $scope.loadingDataFrRoles = false;
                $scope.erroredInRoles = true;
                $scope.successInRoles = false;
                $scope.errorMsgFrRoles = "Please try again, if the issue persists contact Vault Administrator";
                console.log("Data from service is not in expected Format ", error);
                if ((response != undefined) || (response != null)) {
                    if (response.message) {
                        $scope.errorMsg = response.message;
                        console.log(response.message);
                    }
                }
            }
        }

        $rootScope.callErrorHandler = function(error) {
            var obj = {
                "message": error.message
            }
            $scope.commonErrorHandler(null, obj, null);
        }

        $scope.requestDataFrPeriscope = function() {
            var postActionDataUrl = UtilityService.getAppConstant('PERISCOPE_GET_USERS_LINK');
            var reqObjtobeSent = {
                "userName": $scope.periscopeSearch.userName,
                "accountName": $scope.periscopeSearch.accountName,
                "roleName": $scope.periscopeSearch.roleName,
                "actionName": $scope.periscopeSearch.permission
            }
            var apiKey = UtilityService.getAppConstant('PERISCOPE_GET_USERS_KEY');
            try {
                $scope.loadingData = true;
                fetchData.postActionData(reqObjtobeSent, postActionDataUrl, apiKey).then(
                    function(response) {
                        try {
                            $scope.dataFrmApi = response.data;
                            if (response.data.aggregations.UserName.buckets.length === 0) {
                                $scope.nodataavailable = true;
                                $scope.loadingData = false;
                                $scope.errored = false;
                                $scope.success = false;
                                $scope.loadingAfterDeleting = false;
                            } else {
                                massageData();
                                $scope.loadingData = false;
                                $scope.loadingAfterDeleting = false;
                                $scope.errored = false;
                                $scope.success = true;
                                $scope.applyStickyTop = true;
                                $rootScope.setLimit = true;
                                $rootScope.minFixedTopLimit = $rootScope.actualOuter;
                                $scope.selectHistory = [];
                                $scope.selectHistory.push(0);
                            }

                        } catch (e) {
                            $scope.commonErrorHandler(e, response.data, "requestDataFrPeriscope");
                        }
                    },
                    function(response) {
                        $scope.commonErrorHandler(null, response.data, "requestDataFrPeriscope");
                    }
                );
            } catch (e) {
                var obj = {
                    "message": "Error in Fetching data from the server"
                };
                $scope.commonErrorHandler(e, obj, "requestDataFrPeriscope");
            }
        };

        $scope.goToDashboard = function() {
            window.location = 'dashboard';
        };

        $scope.closePemissionOverlay = function() {
            $scope.showPermissionOverlay = false;
            $scope.permissionSearch = '';
            $scope.permissionPopup.permissionList = [];
        };

        $scope.parentContainerClicked = function() {
            $scope.autoCompleteShowResults = false;
            $scope.showSlctBxOptions = false;
        };
        $scope.autocompleteCLicked = function(e) {
            e.stopPropagation();
        };
        $scope.showAutoCompleteResults = function(argument) {
            $scope.autoCompleteShowResults = true;
        };

        $scope.closeAll = function() {
            $rootScope.$broadcast("closeActionPopup");
        };

        $scope.$watch('permissionSearch', function(newVal, oldVal) {
            if (newVal !== undefined && newVal != oldVal) {
                $scope.autoCompleteShowResults = true;
            }
        });
        $scope.togglePeriscopeRow = function(accountNumber, noOfRoles) {
            if (noOfRoles > 1) {
                if ($scope.accountList.isListExpanded[accountNumber] === undefined) {
                    $scope.accountList.isListExpanded[accountNumber] = false;
                }
                $scope.accountList.isListExpanded[accountNumber] = !$scope.accountList.isListExpanded[accountNumber];
            }
        };

        $scope.assignActiveRow = function(username) {
            $scope.applyStickyTop = true;
            $rootScope.isScrolling = true;
            $rootScope.setLimit = true;
            $rootScope.minFixedTopLimit = undefined;
            $scope.selectHistory.push(username);
            if ($scope.selectHistory.length != 0) {
                for (var i = 0; i < ($scope.selectHistory.length); i++) {
                    var x = $scope.selectHistory[i];
                    document.getElementsByClassName("user-data")[x].style.position = "static";
                    document.getElementsByClassName("user-data")[x].style.width = $rootScope.baseWidth;
                }
            }
            if ($scope.selectHistory.length > 3) {
                $scope.selectHistory = $scope.selectHistory.slice($scope.selectHistory.length - 2);
            }
            $scope.accountList.isListExpanded = [];
            $scope.activeRow = username;
            $('.periscope-user-data').removeClass('toAddPadding');
            $scope.removeScrollClass();
        }

        $scope.sortingFunc = function(column) {
            if (column.action && column.sort === false) {
                return;
            }
            var sortKey;
            var sortKeyTagName = column.variable;

            if (sortKeyTagName === 'userName') {
                var totalNoOfResult = $scope.getObjLen($scope.myPeriscopeData);
                $scope.activeRow = totalNoOfResult - $scope.activeRow - 1;
            }

            var enableSorting = column.sort;
            if (enableSorting) {
                var reverse = false;
                if ($scope.sortKeys[sortKeyTagName] === true) {
                    reverse = true;
                    $scope.sortKeys[sortKeyTagName] = false;
                } else {
                    $scope.sortKeys = {};
                    $scope.sortKeys[sortKeyTagName] = true;
                }
            }
        }

        $scope.goToPermissions = function(username, accountName, accountNumber, roleName) {
            $scope.requestRolesFrPeriscope(username, accountName, accountNumber, roleName);
        }

        $scope.requestRolesFrPeriscope = function(username, accountName, accountNumber, roleName) {
            $scope.loadingDataFrRoles = true;
            $scope.showPermissionOverlay = true;
            var postActionDataUrl = UtilityService.getAppConstant('PERISCOPE_GET_ROLES_LINK');
            var reqObjtobeSent = {
                "userName": username,
                "accountNumber": accountNumber,
                "roleName": roleName,
                "actionName": ""
            }
            var apiKey = UtilityService.getAppConstant('PERISCOPE_GET_ROLES_KEY');

            $scope.permissionPopup.roleName = roleName;
            $scope.permissionPopup.userName = username;
            $scope.permissionPopup.accountName = accountName;
            $scope.permissionPopup.accountNum = accountNumber;
            try {
                fetchData.postActionData(reqObjtobeSent, postActionDataUrl, apiKey).then(
                    function(response) {
                        try {
                            $scope.dataFrmApiForRoles = response.data;
                            massageDataForRoles();
                            $scope.permissionPopup.permissionList = $scope.myPeriscopePermissionList;
                            $scope.loadingDataFrRoles = false;
                            $scope.erroredInRoles = false;
                            $scope.successInRoles = true;
                            $scope.applyStickyTop = false;
                        } catch (e) {
                            $scope.commonErrorHandler(e, response.data, "requestRolesFrPeriscope");
                        }
                    },
                    function(response) {
                        $scope.commonErrorHandler(response, response.data, "requestRolesFrPeriscope");
                    });
            } catch (e) {
                var obj = {
                    "message": "Error in Fetching data from the server"
                };
                $scope.commonErrorHandler(e, obj, "requestRolesFrPeriscope");
            }
        };
    });
})(angular.module('pacman.features.PeriscopeCtrl', [
    'pacman.features.Autocomplete',
    'pacman.features.ElementProperties',
    'pacman.features.Scroll',
    'pacman.filters.ToArray'
]));
