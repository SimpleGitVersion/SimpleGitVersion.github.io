/// <reference path="../libs/angularjs/angular.d.ts" />

module CSemVerPlayground.Website {
    var app = angular.module('CSemVerPlayground.Website', ['ngRoute', 'CSemVerPlayground.Website.Home']);

    app.controller(CSemVerPlayground.Website);

    app.config(function ($routeProvider: ng.route.IRouteProvider, $locationProvider: ng.ILocationProvider) {
        // Home
        $routeProvider.when('/', {
            templateUrl: '/app/home/views/home.tpl.html',
            title: 'Home',
            controller: 'HomeCtrl'
        });

        $routeProvider.otherwise({
            redirectTo: '/'
        });

        // Use the HTML5 History API
        $locationProvider.html5Mode(true);
    });
}