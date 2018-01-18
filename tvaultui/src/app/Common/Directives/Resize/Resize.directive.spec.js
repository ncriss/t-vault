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

/*'use strict';

describe( 'Directive: resize', function() {

    beforeEach( function() {
        angular.mock.module( 'sbNigApp.directive.resize', function( $provide ) {
            var myMock = {
                innerHeight : 480,
                innerWidth : 300
            };
            $provide.value( '$window', myMock );
        } );
    } );
    var element, scope;

    beforeEach( inject( function( $rootScope ) {
        scope = $rootScope.$new();
    } ) );

    it( 'should trigger resize and check for applied width', ( inject( function( $compile ) {
        var elem = angular.element(
            '<div resize style="width: 400px"></div>' );
        element = $compile( elem )( scope );
        scope.$apply();
        var elemntDimention = scope.style();
        expect( elemntDimention.height ).toBe( '480px' );
        expect( elemntDimention.width ).toBe( '300px' );
        expect( element.css( 'width' ) ).toEqual( '400px' );

    } ) ) );

    it( 'setElementWidth and setElementHeight function should return element offset width and height',
        inject( function( $compile ) {
            var elem = angular.element(
                '<div resize style="width: 400px;height:410px"></div>' );
            element = $compile( elem )( scope );
            scope.$apply();
            angular.element( document.body ).append( element );
            expect( (scope.setElementHeight()).height ).toBe( '410px' );
            expect( (scope.setElementWidth()).width ).toBe( '400px' );
        } ) );

} );
*/
