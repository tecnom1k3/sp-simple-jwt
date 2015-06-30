'use strict';

var simpleJwtApp = angular.module('sp-simple-jwt', ['ngRoute', 'simpleJwtAppControllers']);

simpleJwtApp.config(['$routeProvider',
    function($routeProvider) {
        $routeProvider.when('/', {
            templateUrl: 'views/main.html',
            controller: 'MainCtrl'
        }).otherwise({
            redirectTo: '/'
        });
    }]);