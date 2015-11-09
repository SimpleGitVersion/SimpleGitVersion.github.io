/// <reference path="../libs/angularjs/angular.d.ts" />

module CSemVerPlayground.Website {
    var app = angular.module('CSemVerPlayground.Website', ['ngRoute', 'CSemVerPlayground.Website.Browse', 'CSemVerPlayground.Website.VersionYourMind', 'CSemVerPlayground.Website.Modals']);

    app.controller(CSemVerPlayground.Website);

    app.config(function ($routeProvider: ng.route.IRouteProvider, $locationProvider: ng.ILocationProvider) {
        // Browse
        $routeProvider.when('/', {
            templateUrl: 'app/browse/views/browse.tpl.html',
            controller: 'BrowseCtrl',
            controllerAs: 'ctrl', 
            name: 'Browse'
        });

        // SuccessorsGame
        $routeProvider.when('/versionYourMind/successorsGame', {
            templateUrl: 'app/versionYourMind/views/successorsGame.tpl.html',
            controller: 'SuccessorsGameCtrl',
            controllerAs: 'ctrl',
            name: 'SuccessorsGame'
        });
        // PredecessorsGame
        $routeProvider.when('/versionYourMind/predecessorsGame', {
            templateUrl: 'app/versionYourMind/views/predecessorsGame.tpl.html',
            controller: 'PredecessorsGameCtrl',
            controllerAs: 'ctrl',
            name: 'PredecessorsGame'
        });

        $routeProvider.otherwise({
            redirectTo: '/'
        });
    });
}