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
                controller: 'HomeCtrl',
                controllerAs: 'ctrl',
                name: 'Home'
            });
            // Browse
            $routeProvider.when('/browse', {
                templateUrl: '/app/browse/views/browse.tpl.html',
                controller: 'BrowseCtrl',
                controllerAs: 'ctrl',
                name: 'Browse'
            });
            // VersionYourMind
            $routeProvider.when('/versionYourMind', {
                templateUrl: '/app/versionYourMind/views/versionYourMind.tpl.html',
                controller: 'VersionYourMindCtrl',
                controllerAs: 'ctrl',
                name: 'VersionYourMind'
            });
            // SuccessorsGame
            $routeProvider.when('/versionYourMind/successorsGame', {
                templateUrl: '/app/versionYourMind/views/successorsGame.tpl.html',
                controller: 'SuccessorsGameCtrl',
                controllerAs: 'ctrl',
                name: 'SuccessorsGame'
            });
            // PredecessorsGame
            $routeProvider.when('/versionYourMind/predecessorsGame', {
                templateUrl: '/app/versionYourMind/views/predecessorsGame.tpl.html',
                controller: 'PredecessorsGameCtrl',
                controllerAs: 'ctrl',
                name: 'PredecessorsGame'
            });
            $routeProvider.otherwise({
                redirectTo: '/'
            });
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
                    this.totalItems = new Big("4000050000000000000");
                    this.currentPage = new Big(1);
                    this.maxSize = 10;
                    this.itemsPerPageOptions = new Array();
                    this.generateItemsPerPageOptions();
                    this.goToVersionNumberInput = "1";
                    this.goToVersionNumber();
                    this.onScroll();
                }
                Object.defineProperty(BrowseCtrl.prototype, "maxPage", {
                    get: function () {
                        return this.totalItems.div(this.itemsPerPage.value);
                    },
                    enumerable: true,
                    configurable: true
                });
                BrowseCtrl.prototype.onScroll = function () {
                    var _me = this;
                    $('html').bind('mousewheel DOMMouseScroll', function (e) {
                        var event = e.originalEvent;
                        var delta = +event.wheelDelta || +event.detail;
                        if (_me.isVersionNumberValid()) {
                            var currentVersion = new Big(_me.goToVersionNumberInput);
                            if (delta < 0)
                                currentVersion = currentVersion.plus(1);
                            if (delta > 0)
                                currentVersion = currentVersion.minus(1);
                            if (_me.isVersionNumberValid(currentVersion)) {
                                _me.goToVersionNumberInput = currentVersion.toString();
                                _me.goToVersionNumber();
                            }
                            _me.$scope.$apply();
                        }
                    });
                };
                BrowseCtrl.prototype.generateItemsPerPageOptions = function () {
                    var options = [10, 25, 50, 100];
                    for (var i = 0; i < options.length; i++) {
                        var option = new Website.Models.SelectOption(options[i] + " items per page", options[i]);
                        this.itemsPerPageOptions.push(option);
                        if (i == 0)
                            this.itemsPerPage = option;
                    }
                };
                BrowseCtrl.prototype.generateItems = function () {
                    this.items = new Array();
                    var maxNumber = this.currentPage.times(this.itemsPerPage.value);
                    var minNumber = this.currentPage.times(this.itemsPerPage.value).minus(this.itemsPerPage.value).plus(1);
                    for (var i = minNumber; i.lte(maxNumber); i = i.plus(1)) {
                        var v = CSemVerPlayground.CSemVersion.CSemVersion.fromDecimal(new Big(i));
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
                BrowseCtrl.prototype.isVersionNumberValid = function (input) {
                    var n = new Big(this.goToVersionNumberInput);
                    if (input)
                        n = input;
                    return n.gte(1) && n.lte(this.totalItems);
                };
                BrowseCtrl.prototype.goToVersionNumber = function () {
                    if (!this.isVersionNumberValid()) {
                        this.error("Error", "Version number must be a numeric defined between 1 and " + this.totalItems.toString() + ".");
                    }
                    else {
                        var pageNumber = new Big(this.goToVersionNumberInput).div(this.itemsPerPage.value);
                        if (pageNumber.lt(1))
                            pageNumber = new Big(1);
                        this.currentPage = pageNumber.round(0, 3);
                        var v = CSemVerPlayground.CSemVersion.CSemVersion.fromDecimal(new Big(this.goToVersionNumberInput));
                        this.goToVersionTagInput = v.toString();
                        this.goToFileVersionInput = this.getFileVersion(v);
                        this.generateItems();
                    }
                };
                BrowseCtrl.prototype.goToVersionTag = function () {
                    var v = CSemVerPlayground.CSemVersion.CSemVersion.tryParse(this.goToVersionTagInput, true);
                    if (!v.parseErrorMessage) {
                        this.goToVersionNumberInput = v.orderedVersion.toFixed();
                        this.goToVersionNumber();
                    }
                    else {
                        this.error("Error", v.parseErrorMessage);
                    }
                };
                BrowseCtrl.prototype.goToFileVersion = function () {
                    var v = CSemVerPlayground.CSemVersion.CSemVersion.tryParseFileVersion(this.goToFileVersionInput);
                    if (!v.parseErrorMessage) {
                        var orderedVersion = v.orderedVersion;
                        if (orderedVersion.round().toFixed() != orderedVersion.toFixed()) {
                            orderedVersion = orderedVersion.eq(0.5) ? orderedVersion.plus(0.5) : orderedVersion.minus(0.5);
                            this.error("CSemVer-CI", "Odd file versions are reserved for CI builds.");
                        }
                        this.goToVersionNumberInput = orderedVersion.toFixed();
                        this.goToVersionNumber();
                    }
                    else {
                        this.error("Error", v.parseErrorMessage);
                    }
                };
                BrowseCtrl.prototype.goFirst = function () {
                    this.goToVersionNumberInput = "1";
                    this.goToVersionNumber();
                };
                BrowseCtrl.prototype.goLast = function () {
                    this.goToVersionNumberInput = this.totalItems.toString();
                    this.goToVersionNumber();
                };
                BrowseCtrl.prototype.canGoPrevious = function () {
                    if (this.currentPage.eq(1))
                        return false;
                    else
                        return true;
                };
                BrowseCtrl.prototype.goPrevious = function () {
                    this.currentPage = this.currentPage.minus(1);
                    this.generateItems();
                };
                BrowseCtrl.prototype.canGoNext = function () {
                    if (this.currentPage.eq(this.maxPage))
                        return false;
                    else
                        return true;
                };
                BrowseCtrl.prototype.goNext = function () {
                    this.currentPage = this.currentPage.plus(1);
                    this.generateItems();
                };
                BrowseCtrl.prototype.getNormalizedVersion = function (v) {
                    return v.toString(CSemVerPlayground.CSemVersion.Format.Normalized);
                };
                BrowseCtrl.prototype.getNugetVersion = function (v) {
                    return v.toString(CSemVerPlayground.CSemVersion.Format.NugetPackageV2);
                };
                BrowseCtrl.prototype.getFileVersion = function (v) {
                    return v.toString(CSemVerPlayground.CSemVersion.Format.FileVersion);
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
        var Models;
        (function (Models) {
            var SelectOption = (function () {
                function SelectOption(description, value) {
                    this.description = description;
                    this.value = value;
                }
                return SelectOption;
            })();
            Models.SelectOption = SelectOption;
        })(Models = Website.Models || (Website.Models = {}));
    })(Website = CSemVerPlayground.Website || (CSemVerPlayground.Website = {}));
})(CSemVerPlayground || (CSemVerPlayground = {}));
var CSemVerPlayground;
(function (CSemVerPlayground) {
    var Website;
    (function (Website) {
        var VersionYourMind;
        (function (VersionYourMind) {
            (function (PredecessorsGameAnswer) {
                PredecessorsGameAnswer[PredecessorsGameAnswer["AB"] = 0] = "AB";
                PredecessorsGameAnswer[PredecessorsGameAnswer["BA"] = 1] = "BA";
                PredecessorsGameAnswer[PredecessorsGameAnswer["Neither"] = 2] = "Neither";
            })(VersionYourMind.PredecessorsGameAnswer || (VersionYourMind.PredecessorsGameAnswer = {}));
            var PredecessorsGameAnswer = VersionYourMind.PredecessorsGameAnswer;
        })(VersionYourMind = Website.VersionYourMind || (Website.VersionYourMind = {}));
    })(Website = CSemVerPlayground.Website || (CSemVerPlayground.Website = {}));
})(CSemVerPlayground || (CSemVerPlayground = {}));
var CSemVerPlayground;
(function (CSemVerPlayground) {
    var Website;
    (function (Website) {
        var VersionYourMind;
        (function (VersionYourMind) {
            var PredecessorsGameCtrl = (function () {
                function PredecessorsGameCtrl($scope, toaster) {
                    this.$scope = $scope;
                    this.toaster = toaster;
                    this.gameStarted = false;
                    this.totalQuestions = 0;
                    this.wonQuestions = 0;
                    this.answered = false;
                }
                Object.defineProperty(PredecessorsGameCtrl.prototype, "answerText", {
                    get: function () {
                        switch (this.answer) {
                            case VersionYourMind.PredecessorsGameAnswer.AB:
                                return "A is a direct predecessor of B";
                            case VersionYourMind.PredecessorsGameAnswer.BA:
                                return "B is a direct predecessor of A";
                            case VersionYourMind.PredecessorsGameAnswer.Neither:
                                return "Neither is a direct predecessor";
                        }
                    },
                    enumerable: true,
                    configurable: true
                });
                PredecessorsGameCtrl.prototype.getButtonClass = function (btn) {
                    if (this.answered) {
                        if (btn == this.answer) {
                            return "btn-success";
                        }
                        else {
                            return "btn-danger";
                        }
                    }
                    else {
                        return "btn-primary";
                    }
                };
                PredecessorsGameCtrl.prototype.start = function () {
                    this.gameStarted = true;
                    this.nextQuestion();
                };
                PredecessorsGameCtrl.prototype.nextQuestion = function () {
                    this.totalQuestions++;
                    this.answered = false;
                    this.pickRandomVersions();
                };
                PredecessorsGameCtrl.prototype.winQuestion = function () {
                    this.answered = true;
                    this.toaster.success("Correct!", this.answerText);
                    this.wonQuestions++;
                };
                PredecessorsGameCtrl.prototype.loseQuestion = function () {
                    this.answered = true;
                    this.toaster.error("Wrong!", this.answerText);
                };
                PredecessorsGameCtrl.prototype.chooseAB = function () {
                    if (this.answer == VersionYourMind.PredecessorsGameAnswer.AB) {
                        this.winQuestion();
                    }
                    else {
                        this.loseQuestion();
                    }
                };
                PredecessorsGameCtrl.prototype.chooseBA = function () {
                    if (this.answer == VersionYourMind.PredecessorsGameAnswer.BA) {
                        this.winQuestion();
                    }
                    else {
                        this.loseQuestion();
                    }
                };
                PredecessorsGameCtrl.prototype.chooseNeither = function () {
                    if (this.answer == VersionYourMind.PredecessorsGameAnswer.Neither) {
                        this.winQuestion();
                    }
                    else {
                        this.loseQuestion();
                    }
                };
                PredecessorsGameCtrl.prototype.pickRandomVersions = function () {
                    var answer = this.getRandomNumber(0, 2);
                    if (answer == VersionYourMind.PredecessorsGameAnswer.AB || answer == VersionYourMind.PredecessorsGameAnswer.BA) {
                        var v1Number = this.getRandomNumber(1, 1300010000130001);
                        var v1 = CSemVerPlayground.CSemVersion.CSemVersion.fromDecimal(new Big(v1Number));
                        var v1Successors = v1.getDirectSuccessors();
                        var v2Number = this.getRandomNumber(0, v1Successors.length - 1);
                        var v2 = v1Successors[v2Number];
                        if (answer == VersionYourMind.PredecessorsGameAnswer.AB) {
                            this.versionA = v1;
                            this.versionB = v2;
                        }
                        else {
                            this.versionA = v2;
                            this.versionB = v1;
                        }
                    }
                    else {
                        var v1Number = this.getRandomNumber(1, 1300010000130001);
                        var v2Number = this.getRandomNumber(1, 1300010000130001);
                        this.versionA = CSemVerPlayground.CSemVersion.CSemVersion.fromDecimal(new Big(v1Number));
                        this.versionB = CSemVerPlayground.CSemVersion.CSemVersion.fromDecimal(new Big(v2Number));
                        if (this.versionA.isDirectPredecessor(this.versionB) || this.versionB.isDirectPredecessor(this.versionA)) {
                            this.pickRandomVersions();
                        }
                    }
                    this.answer = answer;
                };
                PredecessorsGameCtrl.prototype.getRandomNumber = function (min, max) {
                    return Math.floor(Math.random() * (max - min + 1)) + min;
                };
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
                    this.selectedVersion = CSemVerPlayground.CSemVersion.CSemVersion.fromDecimal(new Big(this.getRandomNumber()));
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
                        var v = CSemVerPlayground.CSemVersion.CSemVersion.tryParse(this.versionInput, true);
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
            var app = angular.module('CSemVerPlayground.Website.VersionYourMind', ['ui.bootstrap', 'ngRoute', 'toaster', 'CSemVerPlayground.Website.Modals']);
            app.controller(CSemVerPlayground.Website.VersionYourMind);
        })(VersionYourMind = Website.VersionYourMind || (Website.VersionYourMind = {}));
    })(Website = CSemVerPlayground.Website || (CSemVerPlayground.Website = {}));
})(CSemVerPlayground || (CSemVerPlayground = {}));
//# sourceMappingURL=Website.js.map