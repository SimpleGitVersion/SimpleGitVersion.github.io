/// <reference path="../libs/angularjs/angular.d.ts" />
var CSemVerPlayground;
(function (CSemVerPlayground) {
    var Website;
    (function (Website) {
        var app = angular.module('CSemVerPlayground.Website', ['ngRoute', 'CSemVerPlayground.Website.Home', 'CSemVerPlayground.Website.Browse']);
        app.controller(CSemVerPlayground.Website);
        app.config(function ($routeProvider, $locationProvider) {
            // Home
            $routeProvider.when('/', {
                templateUrl: '/app/home/views/home.tpl.html',
                title: 'Home',
                controller: 'HomeCtrl',
                controllerAs: 'ctrl',
                name: 'Home'
            });
            // Browse
            $routeProvider.when('/browse', {
                templateUrl: '/app/browse/views/browse.tpl.html',
                title: 'Browse',
                controller: 'BrowseCtrl',
                controllerAs: 'ctrl',
                name: 'Browse'
            });
            $routeProvider.otherwise({
                redirectTo: '/'
            });
            // Use the HTML5 History API
            $locationProvider.html5Mode(true);
        });
    })(Website = CSemVerPlayground.Website || (CSemVerPlayground.Website = {}));
})(CSemVerPlayground || (CSemVerPlayground = {}));
var CSemVerPlayground;
(function (CSemVerPlayground) {
    var Website;
    (function (Website) {
        var AppCtrl = (function () {
            function AppCtrl($scope) {
                this.$scope = $scope;
            }
            return AppCtrl;
        })();
        Website.AppCtrl = AppCtrl;
    })(Website = CSemVerPlayground.Website || (CSemVerPlayground.Website = {}));
})(CSemVerPlayground || (CSemVerPlayground = {}));
var CSemVerPlayground;
(function (CSemVerPlayground) {
    var Website;
    (function (Website) {
        var Browse;
        (function (Browse) {
            var app = angular.module('CSemVerPlayground.Website.Browse', ['ui.bootstrap', 'ngRoute']);
            app.controller(CSemVerPlayground.Website.Browse);
        })(Browse = Website.Browse || (Website.Browse = {}));
    })(Website = CSemVerPlayground.Website || (CSemVerPlayground.Website = {}));
})(CSemVerPlayground || (CSemVerPlayground = {}));
var CSemVerPlayground;
(function (CSemVerPlayground) {
    var Website;
    (function (Website) {
        var Browse;
        (function (Browse) {
            var BrowseCtrl = (function () {
                function BrowseCtrl($scope) {
                    this.$scope = $scope;
                    this.totalItems = 13000100000000000000;
                    this.currentPage = 1;
                    this.maxSize = 10;
                    this.itemsPerPage = 10;
                    this.itemsPerPageOptions = [10, 25, 50, 100];
                    this.generateItems();
                }
                BrowseCtrl.prototype.generateItems = function () {
                    this.items = new Array();
                    var maxNumber = this.currentPage * this.itemsPerPage;
                    var minNumber = ((this.currentPage * this.itemsPerPage) - this.itemsPerPage) + 1;
                    for (var i = minNumber; i <= maxNumber; i++) {
                        var v = CSemVerPlayground.ReleaseTagVersion.ReleaseTagVersion.fromDecimal(new Big(i));
                        this.items.push(v);
                    }
                };
                BrowseCtrl.prototype.goToVersionNumber = function () {
                    var pageNumber = Math.ceil(this.goToVersionNumberInput / this.itemsPerPage);
                    if (pageNumber < 1)
                        pageNumber = 1;
                    this.currentPage = pageNumber;
                    this.generateItems();
                };
                BrowseCtrl.prototype.goToVersionTag = function () {
                    var v = CSemVerPlayground.ReleaseTagVersion.ReleaseTagVersion.tryParse(this.goToVersionTagInput, true);
                    if (!v.parseErrorMessage) {
                        this.goToVersionNumberInput = +v.orderedVersion.toFixed();
                        this.goToVersionNumber();
                    }
                    else {
                        console.log(v);
                    }
                };
                BrowseCtrl.prototype.getNormalizedVersion = function (v) {
                    return v.toString(CSemVerPlayground.ReleaseTagVersion.Format.Normalized);
                };
                BrowseCtrl.prototype.getSemVerVersion = function (v) {
                    return v.toString(CSemVerPlayground.ReleaseTagVersion.Format.SemVerWithMarker);
                };
                BrowseCtrl.prototype.getNugetVersion = function (v) {
                    return v.toString(CSemVerPlayground.ReleaseTagVersion.Format.NugetPackageV2);
                };
                BrowseCtrl.prototype.getDottedOrderedVersion = function (v) {
                    return v.toString(CSemVerPlayground.ReleaseTagVersion.Format.DottedOrderedVersion);
                };
                return BrowseCtrl;
            })();
            Browse.BrowseCtrl = BrowseCtrl;
        })(Browse = Website.Browse || (Website.Browse = {}));
    })(Website = CSemVerPlayground.Website || (CSemVerPlayground.Website = {}));
})(CSemVerPlayground || (CSemVerPlayground = {}));
var CSemVerPlayground;
(function (CSemVerPlayground) {
    var Website;
    (function (Website) {
        var Home;
        (function (Home) {
            var HomeCtrl = (function () {
                function HomeCtrl($scope) {
                    this.$scope = $scope;
                }
                return HomeCtrl;
            })();
            Home.HomeCtrl = HomeCtrl;
        })(Home = Website.Home || (Website.Home = {}));
    })(Website = CSemVerPlayground.Website || (CSemVerPlayground.Website = {}));
})(CSemVerPlayground || (CSemVerPlayground = {}));
var CSemVerPlayground;
(function (CSemVerPlayground) {
    var Website;
    (function (Website) {
        var Home;
        (function (Home) {
            var app = angular.module('CSemVerPlayground.Website.Home', ['ui.bootstrap', 'ngRoute']);
            app.controller(CSemVerPlayground.Website.Home);
        })(Home = Website.Home || (Website.Home = {}));
    })(Website = CSemVerPlayground.Website || (CSemVerPlayground.Website = {}));
})(CSemVerPlayground || (CSemVerPlayground = {}));
//# sourceMappingURL=CSemVerPlayground.Website.js.map