/// <reference path="../libs/angularjs/angular.d.ts" />
var CSemVerPlayground;
(function (CSemVerPlayground) {
    var Website;
    (function (Website) {
        var app = angular.module('CSemVerPlayground.Website', ['ngRoute', 'CSemVerPlayground.Website.Home', 'CSemVerPlayground.Website.Browse', 'CSemVerPlayground.Website.VersionYourMind', 'CSemVerPlayground.Website.Modals']);
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
            // VersionYourMind
            $routeProvider.when('/versionYourMind', {
                templateUrl: '/app/versionYourMind/views/versionYourMind.tpl.html',
                title: 'Version your mind',
                controller: 'VersionYourMindCtrl',
                controllerAs: 'ctrl',
                name: 'VersionYourMind'
            });
            // SuccessorsGame
            $routeProvider.when('/versionYourMind/successorsGame', {
                templateUrl: '/app/versionYourMind/views/successorsGame.tpl.html',
                title: 'Successors game',
                controller: 'SuccessorsGameCtrl',
                controllerAs: 'ctrl',
                name: 'SuccessorsGame'
            });
            // PredecessorsGame
            $routeProvider.when('/versionYourMind/predecessorsGame', {
                templateUrl: '/app/versionYourMind/views/predecessorsGame.tpl.html',
                title: 'Predecessors game',
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
                function BrowseCtrl($scope, $modal) {
                    this.$scope = $scope;
                    this.$modal = $modal;
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
                BrowseCtrl.prototype.error = function (title, content) {
                    var modalInstance = this.$modal.open({
                        templateUrl: '/app/modals/views/alertModal.tpl.html',
                        controller: 'AlertModalCtrl',
                        controllerAs: 'ctrl',
                        resolve: {
                            title: function () {
                                return title;
                            },
                            content: function () {
                                return content;
                            }
                        }
                    });
                };
                BrowseCtrl.prototype.isVersionNumberValid = function () {
                    var n = this.goToVersionNumberInput;
                    return !isNaN(n) && n > 1 && n <= 13000100000000000000;
                };
                BrowseCtrl.prototype.goToVersionNumber = function (sync) {
                    if (sync === void 0) { sync = true; }
                    if (!this.isVersionNumberValid()) {
                        this.error("Error", "Version number must be a numeric defined between 1 and 13000100000000000000.");
                    }
                    else {
                        var pageNumber = Math.ceil(this.goToVersionNumberInput / this.itemsPerPage);
                        if (pageNumber < 1)
                            pageNumber = 1;
                        this.currentPage = pageNumber;
                        if (sync) {
                            var v = CSemVerPlayground.ReleaseTagVersion.ReleaseTagVersion.fromDecimal(new Big(this.goToVersionNumberInput));
                            this.goToVersionTagInput = v.toString();
                        }
                        this.generateItems();
                    }
                };
                BrowseCtrl.prototype.goToVersionTag = function () {
                    var v = CSemVerPlayground.ReleaseTagVersion.ReleaseTagVersion.tryParse(this.goToVersionTagInput, true);
                    if (!v.parseErrorMessage) {
                        this.goToVersionNumberInput = +v.orderedVersion.toFixed();
                        this.goToVersionNumber(false);
                    }
                    else {
                        this.error("Error", v.parseErrorMessage);
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
            var app = angular.module('CSemVerPlayground.Website.Home', ['ui.bootstrap', 'ngRoute', 'CSemVerPlayground.Website.Modals']);
            app.controller(CSemVerPlayground.Website.Home);
        })(Home = Website.Home || (Website.Home = {}));
    })(Website = CSemVerPlayground.Website || (CSemVerPlayground.Website = {}));
})(CSemVerPlayground || (CSemVerPlayground = {}));
var CSemVerPlayground;
(function (CSemVerPlayground) {
    var Website;
    (function (Website) {
        var Modals;
        (function (Modals) {
            var AlertModalCtrl = (function () {
                function AlertModalCtrl($scope, title, content, $modalInstance) {
                    this.$scope = $scope;
                    this.title = title;
                    this.content = content;
                    this.$modalInstance = $modalInstance;
                }
                AlertModalCtrl.prototype.close = function () {
                    this.$modalInstance.close();
                };
                return AlertModalCtrl;
            })();
            Modals.AlertModalCtrl = AlertModalCtrl;
        })(Modals = Website.Modals || (Website.Modals = {}));
    })(Website = CSemVerPlayground.Website || (CSemVerPlayground.Website = {}));
})(CSemVerPlayground || (CSemVerPlayground = {}));
var CSemVerPlayground;
(function (CSemVerPlayground) {
    var Website;
    (function (Website) {
        var Modals;
        (function (Modals) {
            var app = angular.module('CSemVerPlayground.Website.Modals', ['ui.bootstrap']);
            app.controller(CSemVerPlayground.Website.Modals);
        })(Modals = Website.Modals || (Website.Modals = {}));
    })(Website = CSemVerPlayground.Website || (CSemVerPlayground.Website = {}));
})(CSemVerPlayground || (CSemVerPlayground = {}));
var CSemVerPlayground;
(function (CSemVerPlayground) {
    var Website;
    (function (Website) {
        var VersionYourMind;
        (function (VersionYourMind) {
            var PredecessorsGameCtrl = (function () {
                function PredecessorsGameCtrl($scope) {
                    this.$scope = $scope;
                }
                return PredecessorsGameCtrl;
            })();
            VersionYourMind.PredecessorsGameCtrl = PredecessorsGameCtrl;
        })(VersionYourMind = Website.VersionYourMind || (Website.VersionYourMind = {}));
    })(Website = CSemVerPlayground.Website || (CSemVerPlayground.Website = {}));
})(CSemVerPlayground || (CSemVerPlayground = {}));
var CSemVerPlayground;
(function (CSemVerPlayground) {
    var Website;
    (function (Website) {
        var VersionYourMind;
        (function (VersionYourMind) {
            var SuccessorsGameCtrl = (function () {
                function SuccessorsGameCtrl($scope) {
                    this.$scope = $scope;
                }
                return SuccessorsGameCtrl;
            })();
            VersionYourMind.SuccessorsGameCtrl = SuccessorsGameCtrl;
        })(VersionYourMind = Website.VersionYourMind || (Website.VersionYourMind = {}));
    })(Website = CSemVerPlayground.Website || (CSemVerPlayground.Website = {}));
})(CSemVerPlayground || (CSemVerPlayground = {}));
var CSemVerPlayground;
(function (CSemVerPlayground) {
    var Website;
    (function (Website) {
        var VersionYourMind;
        (function (VersionYourMind) {
            var VersionYourMindCtrl = (function () {
                function VersionYourMindCtrl($scope) {
                    this.$scope = $scope;
                }
                return VersionYourMindCtrl;
            })();
            VersionYourMind.VersionYourMindCtrl = VersionYourMindCtrl;
        })(VersionYourMind = Website.VersionYourMind || (Website.VersionYourMind = {}));
    })(Website = CSemVerPlayground.Website || (CSemVerPlayground.Website = {}));
})(CSemVerPlayground || (CSemVerPlayground = {}));
var CSemVerPlayground;
(function (CSemVerPlayground) {
    var Website;
    (function (Website) {
        var VersionYourMind;
        (function (VersionYourMind) {
            var app = angular.module('CSemVerPlayground.Website.VersionYourMind', ['ui.bootstrap', 'ngRoute', 'CSemVerPlayground.Website.Modals']);
            app.controller(CSemVerPlayground.Website.VersionYourMind);
        })(VersionYourMind = Website.VersionYourMind || (Website.VersionYourMind = {}));
    })(Website = CSemVerPlayground.Website || (CSemVerPlayground.Website = {}));
})(CSemVerPlayground || (CSemVerPlayground = {}));
//# sourceMappingURL=CSemVerPlayground.Website.js.map