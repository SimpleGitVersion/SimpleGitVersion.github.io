﻿/// <reference path="../libs/angularjs/angular.d.ts" />

module CSemVerPlayground.Website {
    var app = angular.module('CSemVerPlayground.Website', ['ngRoute', 'CSemVerPlayground.Website.Home', 'CSemVerPlayground.Website.Browse', 'CSemVerPlayground.Website.VersionYourMind', 'CSemVerPlayground.Website.Modals']);

    app.controller(CSemVerPlayground.Website);

    app.config(function ($routeProvider: ng.route.IRouteProvider, $locationProvider: ng.ILocationProvider) {
        // Home
        $routeProvider.when('/', {
            templateUrl: '/app/home/views/home.tpl.html',
            //title: 'Home',
            controller: 'HomeCtrl',
            controllerAs: 'ctrl',
            name: 'Home'
        });

        // Browse
        $routeProvider.when('/browse', {
            templateUrl: '/app/browse/views/browse.tpl.html',
            //title: 'Browse',
            controller: 'BrowseCtrl',
            controllerAs: 'ctrl', 
            name: 'Browse'
        });

        // VersionYourMind
        $routeProvider.when('/versionYourMind', {
            templateUrl: '/app/versionYourMind/views/versionYourMind.tpl.html',
            //title: 'Version your mind',
            controller: 'VersionYourMindCtrl',
            controllerAs: 'ctrl',
            name: 'VersionYourMind'
        });

        // SuccessorsGame
        $routeProvider.when('/versionYourMind/successorsGame', {
            templateUrl: '/app/versionYourMind/views/successorsGame.tpl.html',
            //title: 'Successors game',
            controller: 'SuccessorsGameCtrl',
            controllerAs: 'ctrl',
            name: 'SuccessorsGame'
        });
        // PredecessorsGame
        $routeProvider.when('/versionYourMind/predecessorsGame', {
            templateUrl: '/app/versionYourMind/views/predecessorsGame.tpl.html',
            //title: 'Predecessors game',
            controller: 'PredecessorsGameCtrl',
            controllerAs: 'ctrl',
            name: 'PredecessorsGame'
        });

        $routeProvider.otherwise({
            redirectTo: '/'
        });

        // Use the HTML5 History API
        $locationProvider.html5Mode(true);
    });
}