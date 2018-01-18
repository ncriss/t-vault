/*
* =========================================================================
* Copyright 2018 T-Mobile, US
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
* See the readme.txt file for additional language around disclaimer of warranties.
* =========================================================================
*/

'use strict';

angular.module('pacman')
    .service('periscopeService', function(fetchData, UtilityService, SessionStore) {
            var periscopeDataUrl = UtilityService.getAppConstant('PERISCOPE_LINK');
            var periscopeDataKey = UtilityService.getAppConstant('PERISCOPE_KEY');
            this.getDropdownDataForPermissions = function(searchFieldName, searchFieldText) {
                  return new Promise(function(resolve, reject) {
                  var data = {};
                  var ADUsersDataUrl = periscopeDataUrl;
//                  try {
//                      data.loadingDataFrDropdown = true;
//                      fetchData.getActionData(null, ADUsersDataUrl, null).then(
//                          function(response) {
//                              try {
//                                  data.response = response;
//                                  var dataFrmApi = response.data.data.values;
//
//                                  if (response.statusText !== "OK") {
//                                      data.loadingDataFrDropdown = false;
//                                      data.erroredFrDropdown = false;
//                                      data.successFrDropdown = false;
//                                      resolve(data);
//                                  } else {
//                                      data.dataFrmApi = dataFrmApi;
//                                      data.loadingDataFrDropdown = false;
//                                      data.erroredFrDropdown = false;
//                                      data.successFrDropdown = true;
//                                      resolve(data);
//                                  }
//
//                              } catch (e) {
//                                  data.error = e;
//                                  reject(data.error);
//                              }
//                          },
//                          function(response) {
//                            data.error = response.data;
//                            reject(data.error);
//                          }
//                      );
//                  } catch (e) {
//                      data.error = e;
//                      reject(data.error);
//                  }
                })
            }
            this.getDropdownData = function(searchFieldName, searchFieldText) {
                  SessionStore.setItem("fetchingADUsers", JSON.stringify(true));
                  return new Promise(function(resolve, reject) {
                  var data = {};
                  var postActionDataUrl = periscopeDataUrl;
                  var reqObjtobeSent = {
                      "field": searchFieldName,
                      "text": searchFieldText
                  }
                  var apiKey = periscopeDataKey;
                  try {
                      data.loadingDataFrDropdown = true;
                      fetchData.postActionData(reqObjtobeSent, postActionDataUrl, apiKey).then(
                          function(response) {
                              try {
                                  data.response = response;
                                  var dataFrmApi = response.data;

                                  if (response.data._shards.successful === 0) {
                                      data.loadingDataFrDropdown = false;
                                      data.erroredFrDropdown = false;
                                      data.successFrDropdown = false;
                                      resolve(data);
                                  } else {
                                      data.dataFrmApi = dataFrmApi;
                                      data.loadingDataFrDropdown = false;
                                      data.erroredFrDropdown = false;
                                      data.successFrDropdown = true;
                                      resolve(data);
                                  }

                              } catch (e) {
                                  data.error = e;
                                  reject(data.error);
                              }
                          },
                          function(response) {
                            data.error = response.data;
                            reject(data.error);
                          }
                      );
                  } catch (e) {
                      data.error = e;
                      reject(data.error);
                  }
                })
            }
            this.massageData = function(apiData) {

                var apiHitData = apiData.aggregations.UserName.buckets;
                var nodataavailable = !(apiHitData.length > 0);
                var output = {};
                var count = 0;
                for (var i = 0; i < apiHitData.length; i++) {

                    output[apiHitData[i].key] = {
                        "userName": apiHitData[i].key,
                        "firstName": apiHitData[i].FirstName.buckets[0].key,
                        "lastName": apiHitData[i].FirstName.buckets[0].LastName.buckets[0].key,
                        "emailId": apiHitData[i].FirstName.buckets[0].LastName.buckets[0].EmailID.buckets[0].key,
                        "accountDescription": {}
                    };
                    for (var j = 0; j < apiHitData[i].FirstName.buckets[0].LastName.buckets[0].EmailID.buckets[0].AccountNumber.buckets.length; j++) {
                        output[apiHitData[i].key].
                        accountDescription[apiHitData[i].FirstName.buckets[0].LastName.buckets[0].EmailID.buckets[0].AccountNumber.buckets[j].key] = {
                            "accountNum": apiHitData[i].FirstName.buckets[0].LastName.buckets[0].EmailID.buckets[0].AccountNumber.buckets[j].key,
                            "accountName": apiHitData[i].FirstName.buckets[0].LastName.buckets[0].EmailID.buckets[0].AccountNumber.buckets[j].AccountName.buckets[0].key,
                            "roleNames": {}
                        };
                        for (var k = 0; k < apiHitData[i].FirstName.buckets[0].LastName.buckets[0].EmailID.buckets[0].AccountNumber.buckets[j].AccountName.buckets[0].RoleName.buckets.length; k++) {
                            output[apiHitData[i].key].
                            accountDescription[apiHitData[i].FirstName.buckets[0].LastName.buckets[0].EmailID.buckets[0].AccountNumber.buckets[j].key].
                            roleNames[apiHitData[i].FirstName.buckets[0].LastName.buckets[0].EmailID.buckets[0].AccountNumber.buckets[j].AccountName.buckets[0].RoleName.buckets[k].key] = {
                                "roleName": apiHitData[i].FirstName.buckets[0].LastName.buckets[0].EmailID.buckets[0].AccountNumber.buckets[j].AccountName.buckets[0].RoleName.buckets[k].key,
                                "policyNames": {}
                            };
                            for (var m = 0; m < apiHitData[i].FirstName.buckets[0].LastName.buckets[0].EmailID.buckets[0].AccountNumber.buckets[j].AccountName.buckets[0].RoleName.buckets[k].PolicyName.buckets.length; m++) {
                                output[apiHitData[i].key].
                                accountDescription[apiHitData[i].FirstName.buckets[0].LastName.buckets[0].EmailID.buckets[0].AccountNumber.buckets[j].key].
                                roleNames[apiHitData[i].FirstName.buckets[0].LastName.buckets[0].EmailID.buckets[0].AccountNumber.buckets[j].AccountName.buckets[0].RoleName.buckets[k].key].
                                policyNames[apiHitData[i].FirstName.buckets[0].LastName.buckets[0].EmailID.buckets[0].AccountNumber.buckets[j].AccountName.buckets[0].RoleName.buckets[k].PolicyName.buckets[m].key] = {
                                    "policyName": apiHitData[i].FirstName.buckets[0].LastName.buckets[0].EmailID.buckets[0].AccountNumber.buckets[j].AccountName.buckets[0].RoleName.buckets[k].PolicyName.buckets[m].key
                                };
                            }
                        }
                    }
                }
                // $scope.myPeriscopeData = output;
                var flags = [],
                    accNumOutput = [];
                for (var key in output) {
                    var accDes = output[key].accountDescription;
                    for (var acckey in accDes) {
                        var search = accDes[acckey].accountName;
                        if (flags[search]) continue;
                        flags[search] = true;
                        accNumOutput.push(search);
                    }


                }
                var data = {};
                data["outputData"] = output;
                data["accountNameListData"] = accNumOutput;
                data["nodataavailable"] = nodataavailable;
                return data;
            };
            this.massageDataForRoles = function(data) {

                var apiData = data;
                var apiHitData = apiData.aggregations.ActionName.buckets;
                var nodataavailableFrRoles = !(apiHitData.length > 0);
                var output = [];

                var i = 0;

                for (i = 0; i < apiHitData.length; i++) {
                    // $scope.nodataavailableFrRoles = false;
                    var roleActionName = apiHitData[i].key;
                    var roleResourceBucket = apiHitData[i].Resource.buckets;

                    for (var j = 0; j < roleResourceBucket.length; j++) {

                        var roleResource = apiHitData[i].Resource.buckets[j].key;
                        var roleEffectsBucket = apiHitData[i].Resource.buckets[0].Effect.buckets;

                        for (var k = 0; k < roleEffectsBucket.length; k++) {
                            var roleEffect = apiHitData[i].Resource.buckets[j].Effect.buckets[k].key;

                            var roleConditionName = apiHitData[i].Resource.buckets[j].Effect.buckets[k].ConditionName.buckets[0].key;

                            var roleConditionTag = apiHitData[i].Resource.buckets[j].Effect.buckets[k].ConditionName.buckets[0].ConditionTag.buckets[0].key;

                            var roleConditionValue = apiHitData[i].Resource.buckets[j].Effect.buckets[k].ConditionName.buckets[0].ConditionTag.buckets[0].ConditionValue.buckets[0].key;
                            if (roleConditionName == 'null') {
                                roleConditionName = '-'
                            }
                            if (roleConditionTag == 'null') {
                                roleConditionTag = '-'
                            }
                            if (roleConditionValue == 'null') {
                                roleConditionValue = '-'
                            }
                            if (roleConditionName == '-' && roleConditionTag == '-' && roleConditionValue == '-') {
                                roleConditionTag = '';
                                roleConditionValue = ''
                            }
                            output.push({
                                "permissionName": roleActionName,
                                "resourceName": roleResource,
                                "effect": roleEffect,
                                "conditionName": roleConditionName,
                                "conditionTag": roleConditionTag,
                                "conditionValue": roleConditionValue

                            });
                        }

                    }

                }
                var data = {};
                data["outputData"] = output;
                data["nodataavailable"] = nodataavailableFrRoles;
                return data;
            };
            this.massageDataFrDropdown = function(searchFieldName, dataFrmApi, dropDownValArray) {
              var dropdownVal = [];
              var dropdownArrayVal = [];
              var searchFieldNameList = [];
              var dataFieldName = [];
              var dropdownValList = [];
              var data = {};
              data.dropDownValArray = dropDownValArray;

              searchFieldNameList = ["userName", "accountName", "roleName", "actionName"];


              searchFieldNameList.forEach(function(searchFieldNameVal, index) {
                  dataFieldName = ["CorpID", "AccountName", "RoleName", "ActionName"];
                  dropdownValList = ["userNameDropdownVal", "accountNameDropdownVal", "roleNameDropdownVal", "permissionDropdownVal"];
                  if (searchFieldName === searchFieldNameVal) {
                      dropdownVal = dataFrmApi[dataFieldName[index]][0].options;
                      dropdownVal.forEach(function(item) {
                          dropdownArrayVal.push(item.text);
                      })
                      data.dropDownValArray[dropdownValList[index]] = dropdownArrayVal;
                  }
              });


              data.totalDropdownVal = dropdownVal;
              return data;
            };

            this.massageDataFrPermissionsDropdown = function(searchFieldName, searchText, dataFrmApi, dropDownValArray) {
                var data = [];
                var searchFieldName = searchFieldName.toLowerCase();
                if(dataFrmApi !== undefined) {
                    var users = dataFrmApi;
                    users.forEach(function(item) {
                        // console.log(item);
                        var userId = item["userId"].toLowerCase();
                        if(userId.indexOf(searchText.toLowerCase()) > -1) {
                            // var obj = item;
                            // obj["text"] = item["userId"];
                            data.push(item["userId"]);
                        }                        
                    });
                    return data;
                }                
            };

            this.clearAllCommas = function(strngtodelete, parentString) {

                var l = parentString.indexOf(strngtodelete);
                parentString = parentString.replace(strngtodelete, "");
                if (parentString[l] === "," || parentString[l] === " ,") {
                    parentString = parentString.replace(parentString[l], "");
                }
                return parentString;
            }

    });
