/// <reference path="../libs/angularjs/angular.d.ts" />
var CSemVerPlayground;
(function (CSemVerPlayground) {
    var Website;
    (function (Website) {
        var app = angular.module('CSemVerPlayground.Website', ['ngRoute', 'CSemVerPlayground.Website.Browse', 'CSemVerPlayground.Website.DirectSuccessors', 'CSemVerPlayground.Website.VersionYourMind']);
        app.controller(CSemVerPlayground.Website);
        app.config(function ($routeProvider, $locationProvider) {
            // Browse
            $routeProvider.when('/', {
                templateUrl: 'app/browse/views/browse.tpl.html',
                controller: 'BrowseCtrl',
                controllerAs: 'ctrl',
                name: 'Browse'
            });
            // DirectSuccessors
            $routeProvider.when('/directSuccessors', {
                templateUrl: 'app/directSuccessors/views/directSuccessors.tpl.html',
                controller: 'DirectSuccessorsCtrl',
                controllerAs: 'ctrl',
                name: 'DirectSuccessors'
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
            var app = angular.module('CSemVerPlayground.Website.Browse', ['ui.bootstrap', 'ngRoute', 'CSemVerPlayground.Website.Modals', 'CSemVerPlayground.Website.Services']);
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
                function BrowseCtrl($scope, $modal, VersionSuggestionsProvider) {
                    this.$scope = $scope;
                    this.$modal = $modal;
                    this.VersionSuggestionsProvider = VersionSuggestionsProvider;
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
                BrowseCtrl.prototype.getSuggestions = function (input) {
                    return this.VersionSuggestionsProvider.getSuggestions(input);
                };
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
                        templateUrl: 'app/modals/views/alertModal.tpl.html',
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
                    var valid = true;
                    try {
                        var n = input || new Big(this.goToVersionNumberInput);
                        valid = n.gte(1) && n.lte(this.totalItems);
                    }
                    catch (err) {
                        valid = false;
                    }
                    return valid;
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
                BrowseCtrl.prototype.getReleaseKind = function (v) {
                    return v.kind == CSemVerPlayground.CSemVersion.ReleaseTagKind.OfficialRelease ? "Official Release" : "PreRelease";
                };
                BrowseCtrl.prototype.getReleaseKindColor = function (v) {
                    if (v.kind == CSemVerPlayground.CSemVersion.ReleaseTagKind.OfficialRelease)
                        return "label-success";
                    else
                        return "label-primary";
                };
                BrowseCtrl.prototype.getReleaseSubKind = function (v) {
                    if (v.kind == CSemVerPlayground.CSemVersion.ReleaseTagKind.OfficialRelease) {
                        if (v.minor == 0 && v.patch == 0)
                            return "Major";
                        else if (v.patch == 0)
                            return "Minor";
                        else
                            return "Patch";
                    }
                    else {
                        if (v.preReleaseNumber == 0 && v.preReleaseFix == 0)
                            return "Main";
                        else if (v.preReleaseFix == 0)
                            return "Numbered";
                        else
                            return "Patch";
                    }
                };
                BrowseCtrl.prototype.getReleaseSubKindColor = function (v) {
                    var kind = this.getReleaseSubKind(v);
                    if (kind == "Major" || kind == "Main")
                        return "label-info";
                    else if (kind == "Minor" || kind == "Numbered")
                        return "label-info";
                    else
                        return "label-default";
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
        var DirectSuccessors;
        (function (DirectSuccessors) {
            var DirectSuccessorsCtrl = (function () {
                function DirectSuccessorsCtrl($scope, $modal, VersionSuggestionsProvider) {
                    this.$scope = $scope;
                    this.$modal = $modal;
                    this.VersionSuggestionsProvider = VersionSuggestionsProvider;
                    this.test = CSemVerPlayground.CSemVersion.CSemVersion.standardPreReleaseNames;
                    this.successors = new Array();
                }
                DirectSuccessorsCtrl.prototype.getDirectSuccessors = function () {
                    if (this.givenVersionTagInput) {
                        var v = CSemVerPlayground.CSemVersion.CSemVersion.tryParse(this.givenVersionTagInput, true);
                        if (!v.parseErrorMessage) {
                            this.errorMessage = null;
                            this.submittedVersion = this.givenVersionTagInput;
                            this.currentVersion = v;
                            this.givenVersionTagInput = v.toString();
                            this.successors = this.currentVersion.getDirectSuccessors();
                        }
                        else {
                            this.errorMessage = v.parseErrorMessage;
                        }
                    }
                };
                DirectSuccessorsCtrl.prototype.getCorrectVersion = function () {
                    return this.currentVersion.toString();
                };
                DirectSuccessorsCtrl.prototype.getSuggestions = function (input) {
                    return this.VersionSuggestionsProvider.getSuggestions(input);
                };
                DirectSuccessorsCtrl.prototype.viewDetails = function (v) {
                    var modalInstance = this.$modal.open({
                        templateUrl: 'app/modals/views/versionDetailsModal.tpl.html',
                        controller: 'VersionDetailsModalCtrl',
                        controllerAs: 'ctrl',
                        resolve: {
                            version: function () {
                                return v;
                            }
                        }
                    });
                };
                return DirectSuccessorsCtrl;
            })();
            DirectSuccessors.DirectSuccessorsCtrl = DirectSuccessorsCtrl;
        })(DirectSuccessors = Website.DirectSuccessors || (Website.DirectSuccessors = {}));
    })(Website = CSemVerPlayground.Website || (CSemVerPlayground.Website = {}));
})(CSemVerPlayground || (CSemVerPlayground = {}));
var CSemVerPlayground;
(function (CSemVerPlayground) {
    var Website;
    (function (Website) {
        var Modals;
        (function (Modals) {
            var VersionDetailsModalCtrl = (function () {
                function VersionDetailsModalCtrl($scope, version, $modalInstance) {
                    this.$scope = $scope;
                    this.version = version;
                    this.$modalInstance = $modalInstance;
                }
                VersionDetailsModalCtrl.prototype.getNugetVersion = function () {
                    return this.version.toString(CSemVerPlayground.CSemVersion.Format.NugetPackageV2);
                };
                VersionDetailsModalCtrl.prototype.getFileVersion = function () {
                    return this.version.toString(CSemVerPlayground.CSemVersion.Format.FileVersion);
                };
                VersionDetailsModalCtrl.prototype.close = function () {
                    this.$modalInstance.close();
                };
                return VersionDetailsModalCtrl;
            })();
            Modals.VersionDetailsModalCtrl = VersionDetailsModalCtrl;
        })(Modals = Website.Modals || (Website.Modals = {}));
    })(Website = CSemVerPlayground.Website || (CSemVerPlayground.Website = {}));
})(CSemVerPlayground || (CSemVerPlayground = {}));
var CSemVerPlayground;
(function (CSemVerPlayground) {
    var Website;
    (function (Website) {
        var DirectSuccessors;
        (function (DirectSuccessors) {
            var app = angular.module('CSemVerPlayground.Website.DirectSuccessors', ['ui.bootstrap', 'ngRoute', 'CSemVerPlayground.Website.Modals', 'CSemVerPlayground.Website.Services']);
            app.controller(CSemVerPlayground.Website.DirectSuccessors);
        })(DirectSuccessors = Website.DirectSuccessors || (Website.DirectSuccessors = {}));
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
            var app = angular.module('CSemVerPlayground.Website.Modals', ['ui.bootstrap', 'CSemVerPlayground.Website.Services']);
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
        var Services;
        (function (Services) {
            var app = angular.module('CSemVerPlayground.Website.Services', []);
            app.service(CSemVerPlayground.Website.Services);
        })(Services = Website.Services || (Website.Services = {}));
    })(Website = CSemVerPlayground.Website || (CSemVerPlayground.Website = {}));
})(CSemVerPlayground || (CSemVerPlayground = {}));
var CSemVerPlayground;
(function (CSemVerPlayground) {
    var Website;
    (function (Website) {
        var Services;
        (function (Services) {
            var VersionSuggestionsProvider = (function () {
                function VersionSuggestionsProvider() {
                }
                VersionSuggestionsProvider.prototype.getSuggestions = function (input) {
                    if (input && input.indexOf("-") > -1) {
                        var leftPart = input.split("-")[0];
                        return CSemVerPlayground.CSemVersion.CSemVersion.standardPreReleaseNames.map(function (val) {
                            return leftPart + "-" + val;
                        });
                    }
                    return [];
                };
                return VersionSuggestionsProvider;
            })();
            Services.VersionSuggestionsProvider = VersionSuggestionsProvider;
        })(Services = Website.Services || (Website.Services = {}));
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
                    this.toaster.clear();
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
                function SuccessorsGameCtrl($scope, toaster, $modal) {
                    this.$scope = $scope;
                    this.toaster = toaster;
                    this.$modal = $modal;
                    this.totalQuestions = 0;
                    this.wonQuestions = 0;
                    this.gameStarted = false;
                    this.submitted = false;
                }
                SuccessorsGameCtrl.prototype.start = function () {
                    this.totalQuestions++;
                    this.firstInput = new VersionYourMind.SuccessorInput();
                    this.lastInput = new VersionYourMind.SuccessorInput();
                    this.howManyInput = new VersionYourMind.SuccessorInput();
                    this.selectedVersion = CSemVerPlayground.CSemVersion.CSemVersion.fromDecimal(new Big(this.getRandomNumber()));
                    this.possibleVersions = this.selectedVersion.getDirectSuccessors();
                    this.firstInput.expectedValue = this.possibleVersions[0].toString();
                    this.lastInput.expectedValue = this.possibleVersions[this.possibleVersions.length - 1].toString();
                    this.howManyInput.expectedValue = this.possibleVersions.length;
                    this.submitted = false;
                    this.gameStarted = true;
                };
                SuccessorsGameCtrl.prototype.submit = function () {
                    this.submitted = true;
                    this.firstInput.solve();
                    this.lastInput.solve();
                    this.howManyInput.solve();
                    if (this.isFormValid)
                        this.wonQuestions++;
                };
                Object.defineProperty(SuccessorsGameCtrl.prototype, "allCheated", {
                    get: function () {
                        return this.firstInput.cheated && this.lastInput.cheated && this.howManyInput.cheated;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(SuccessorsGameCtrl.prototype, "isFormValid", {
                    get: function () {
                        return this.firstInput.isValid && this.lastInput.isValid && this.howManyInput.isValid;
                    },
                    enumerable: true,
                    configurable: true
                });
                SuccessorsGameCtrl.prototype.getGroupClass = function (input) {
                    if (this.submitted) {
                        return input.isValid ? 'has-success' : 'has-error';
                    }
                };
                Object.defineProperty(SuccessorsGameCtrl.prototype, "panelClass", {
                    get: function () {
                        if (!this.submitted)
                            return "panel-primary";
                        if (this.isFormValid)
                            return "panel-success";
                        return "panel-danger";
                    },
                    enumerable: true,
                    configurable: true
                });
                SuccessorsGameCtrl.prototype.getRandomNumber = function () {
                    var max = new Big(1300010000130001);
                    var min = 1;
                    var randomValue = max.times(Math.random()).plus(min);
                    return Math.floor(+randomValue.toFixed());
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
            var SuccessorInput = (function () {
                function SuccessorInput() {
                }
                Object.defineProperty(SuccessorInput.prototype, "isValid", {
                    get: function () {
                        return this.expectedValue == this.inputValue && !this.cheated;
                    },
                    enumerable: true,
                    configurable: true
                });
                SuccessorInput.prototype.cheat = function () {
                    this.inputValue = this.expectedValue;
                    this.cheated = true;
                };
                SuccessorInput.prototype.solve = function () {
                    if (this.inputValue != this.expectedValue) {
                        this.cheat();
                    }
                };
                return SuccessorInput;
            })();
            VersionYourMind.SuccessorInput = SuccessorInput;
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