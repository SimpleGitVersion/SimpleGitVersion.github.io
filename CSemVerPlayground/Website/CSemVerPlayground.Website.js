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
                function SuccessorsGameCtrl($scope, $interval, toaster, $modal) {
                    this.$scope = $scope;
                    this.$interval = $interval;
                    this.toaster = toaster;
                    this.$modal = $modal;
                    this.millisecondsElapsed = 0;
                    this.gameStarted = false;
                }
                SuccessorsGameCtrl.prototype.start = function () {
                    if (this.timer != null)
                        this.stopTimer();
                    this.foundVersions = new Array();
                    this.versionInput = null;
                    this.millisecondsElapsed = 0;
                    this.selectedVersion = CSemVerPlayground.ReleaseTagVersion.ReleaseTagVersion.fromDecimal(new Big(this.getRandomNumber()));
                    this.possibleVersions = this.selectedVersion.getDirectSuccessors();
                    this.startTimer();
                    this.gameStarted = true;
                };
                SuccessorsGameCtrl.prototype.startTimer = function () {
                    var that = this;
                    this.timer = this.$interval(function () {
                        that.millisecondsElapsed += 100;
                    }, 100);
                };
                SuccessorsGameCtrl.prototype.stopTimer = function () {
                    this.$interval.cancel(this.timer);
                };
                SuccessorsGameCtrl.prototype.getRandomNumber = function () {
                    var max = new Big(1300010000130001);
                    var min = 1;
                    var randomValue = max.times(Math.random()).plus(min);
                    return Math.floor(+randomValue.toFixed());
                };
                Object.defineProperty(SuccessorsGameCtrl.prototype, "millisecondsCount", {
                    get: function () {
                        var s = Math.floor(this.millisecondsElapsed / 1000);
                        var ms = this.millisecondsElapsed - (s * 1000);
                        var digit1 = ms < 10 ? "0" : "";
                        var digit2 = ms < 100 ? "0" : "";
                        return digit1 + digit2 + ms;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(SuccessorsGameCtrl.prototype, "secondsCount", {
                    get: function () {
                        var s = Math.floor(this.millisecondsElapsed / 1000);
                        var m = Math.floor(s / 60);
                        s -= m * 60;
                        var digit1 = s < 10 ? "0" : "";
                        return digit1 + s;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(SuccessorsGameCtrl.prototype, "minutesCount", {
                    get: function () {
                        var s = Math.floor(this.millisecondsElapsed / 1000);
                        var m = Math.floor(s / 60);
                        var digit1 = m < 10 ? "0" : "";
                        return digit1 + m;
                    },
                    enumerable: true,
                    configurable: true
                });
                SuccessorsGameCtrl.prototype.win = function () {
                    this.stopTimer();
                    this.alert("You won!", "You found the " + this.possibleVersions.length + " possible versions in " + this.minutesCount + ":" + this.secondsCount + ":" + this.millisecondsCount + "!");
                };
                SuccessorsGameCtrl.prototype.alert = function (title, content) {
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
                SuccessorsGameCtrl.prototype.submitVersion = function () {
                    if (this.versionInput != null) {
                        var v = CSemVerPlayground.ReleaseTagVersion.ReleaseTagVersion.tryParse(this.versionInput, true);
                        if (!v.parseErrorMessage) {
                            // Note : isDirectPredecessor() is buggy. We use the array of successors instead
                            var successor = this.possibleVersions.filter(function (value, index, array) {
                                return value.toString() == v.toString();
                            });
                            if (successor.length == 1) {
                                var existing = this.foundVersions.filter(function (value, index, array) {
                                    return value.toString() == v.toString();
                                });
                                if (existing.length == 0) {
                                    this.versionInput = null;
                                    this.foundVersions.push(v);
                                    this.toaster.success("Success!", "New successor found");
                                    if (this.possibleVersions.length == this.foundVersions.length) {
                                        this.win();
                                    }
                                }
                                else {
                                    this.toaster.warning("Alert!", v.toString() + " was already found");
                                }
                            }
                            else {
                                this.toaster.error("Error!", v.toString() + " is not a direct successor of " + this.selectedVersion.toString());
                            }
                        }
                        else {
                            this.toaster.error("Error!", v.parseErrorMessage);
                        }
                    }
                    else {
                        this.toaster.error("Error!", "Please enter a valid successor version");
                    }
                };
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
            var app = angular.module('CSemVerPlayground.Website.VersionYourMind', ['ui.bootstrap', 'ngRoute', 'ngAnimate', 'toaster', 'CSemVerPlayground.Website.Modals']);
            app.controller(CSemVerPlayground.Website.VersionYourMind);
        })(VersionYourMind = Website.VersionYourMind || (Website.VersionYourMind = {}));
    })(Website = CSemVerPlayground.Website || (CSemVerPlayground.Website = {}));
})(CSemVerPlayground || (CSemVerPlayground = {}));
//# sourceMappingURL=CSemVerPlayground.Website.js.map