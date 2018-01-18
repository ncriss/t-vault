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
    app.factory( 'ServiceEndpoint', function(RestEndpoints, $http, $q, $rootScope ) {
        var endpoints = {};

        function defineEndpoint( name, url, method, lazy ) {
            endpoints[ name ] = {
                name: name,
                url: url,
                method: method,
                lazy: lazy,
                makeRequest: function( payload, pacmanResourceUrl, pacmanApiKey ) {

                    if ( pacmanResourceUrl != undefined && pacmanResourceUrl != "" ) {
                        url = pacmanResourceUrl
                    };

                    if ( pacmanApiKey != undefined && pacmanApiKey != "" ) {
                        headers = pacmanApiKey;
                    } else {
                        headers = {}
                    };                    

                    payload = payload || {};
                    var request = {
                        method: method,
                        url: url,
                        data: payload,
                        lazy: lazy,
                        headers: headers,
                    };
                    $rootScope.showLoadingScreen = true;
                    var promise = $http( request ).then( function( response ) {
                            $rootScope.showLoadingScreen = false;
                            var responseType = response.headers( 'x-response-type' );
                            if ( responseType === 'ERROR' ) {
                                var errorData = {
                                    service: name,
                                    message: response.headers( 'x-response-message' )
                                };
                                $rootScope.$broadcast( 'genericServiceError', errorData );
                                return $q.reject( response );
                            }
                            return response;
                        },
                        function( response ) {
                            var responseType, responseMsg;
                            responseType = response.headers( 'x-response-type' );
                            responseMsg = response.headers( 'x-response-message' );
                            //if ( responseType !== 'STEPUP' ) {
                            var errorData = {
                                service: name,
                                message: responseMsg
                            };
                            $rootScope.$broadcast( 'genericServiceError', errorData );
                            //}
                            return $q.reject( response );
                        } );
                    //array of all promises required by angular-busy
                    if ( !lazy ) {
                        $rootScope.showLoadingScreen = false;
                    }
                    return promise;
                }
            };
        }

        endpoints.adhockEndpoint = function( name, url, method, lazy ) {
            defineEndpoint( name, url, method, lazy );
            return endpoints[ name ];
        };
        //define end point for all entries in RestEndpoints
        var baseURL = RestEndpoints.baseURL;

        var apiKey = RestEndpoints.apiKey;
        var headers = {};
        if ( apiKey != undefined ) {
            headers = {
                "x-api-key": UtilityService.getAppConstant('X-API-KEY')
            }
        }

        var serviceEndpointsList = RestEndpoints.endpoints;
        for ( var i = serviceEndpointsList.length - 1; i >= 0; i-- ) {
            defineEndpoint( serviceEndpointsList[ i ].name, baseURL + serviceEndpointsList[ i ].url,
                serviceEndpointsList[ i ].method, serviceEndpointsList[ i ].lazy );
        }
        return endpoints;
    } );
})(angular.module('pacman.services.ServiceEndpoint',[
    'pacman.constants.RestEndpoints'
]));
