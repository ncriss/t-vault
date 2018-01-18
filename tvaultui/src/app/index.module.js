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

( function() {
    'use strict';
    angular.module( 'pacman', [
        'ngAnimate',
        'ngCookies',
        'ngTouch',
        'ngSanitize',
        'ngMessages',
        'ngResource',
        'ui.router',
        'ui.bootstrap',
        'toastr',
        'counter',
        'ngMaterial',
        'ngTable',
        'ui.select',
        'pacman.features',
        'pacman.services',
        'pacman.constants',
        'pacman.directives',
        'pacman.factories'
    ]);


    // Module names categorized for better understanding and to
    // track the modules being used in the code


    angular.module( 'pacman.features', [
        'pacman.features.SignUpCtrl',
        'pacman.features.SafesCtrl',
        'pacman.features.AdminCtrl',
        'pacman.features.PeriscopeCtrl',
        'pacman.features.ChangeSafeCtrl',
        'pacman.features.DocumentationCtrl',
        'pacman.features.UnsealCtrl'
    ]);
    angular.module( 'pacman.services', [
        'pacman.services.CopyToClipboard',
        'pacman.services.DataCache',
        'pacman.services.DeviceDetector',
        'pacman.services.Modal',
        'pacman.services.RefreshHandler',
        'pacman.services.ServiceEndpoint',
        'pacman.services.SessionStore',
        'pacman.services.fetchData',
        'pacman.services.SafesManagement',
        'pacman.services.UtilityService',
        'pacman.services.Authentication',
        'pacman.services.AdminSafesManagement',
        'pacman.services.ModifyUrl',
        'pacman.services.ArrayFilter',
        'pacman.services.httpInterceptor',
        'pacman.services.Notifications',
        'pacman.services.Unseal'
    ]);

    angular.module( 'pacman.constants', [
        'pacman.constants.RestEndpoints',
        'pacman.constants.AppConstant',
        'pacman.constants.ErrorMessage',
        'pacman.constants.ListOfApi'
    ]);
    angular.module( 'pacman.filters', [
        'pacman.filters.ToArray',
        'pacman.filters.CustomFilter'
    ]);
    angular.module( 'pacman.directives', [
        'pacman.features.Autocomplete',
        'pacman.features.ElementProperties',
        'pacman.features.Scroll',
        'pacman.directives.dateTimeFilter',
        'pacman.directives.dropDown',
        'pacman.directives.footer',
        'pacman.directives.header',
        'pacman.directives.listtable',
        'pacman.directives.loadingState',
        'pacman.directives.resize',
        'pacman.directives.sidebar',
        'pacman.directives.tiles',
        'pacman.directives.radioButtons',
        'pacman.directives.restrictSpecialChar',
        'pacman.directives.dropDown',
        'pacman.directives.navBar'
    ]);

    angular.module( 'pacman.factories', [
    ]);

} )();
