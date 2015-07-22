module CSemVerPlayground.Website.VersionYourMind {
    export interface ISuccessorsGameScope extends ng.IScope {

    }

    export class SuccessorsGameCtrl {
        private millisecondsElapsed = 0;
        private timer: ng.IPromise<any>;

        public gameStarted = false;
        public selectedVersion: ReleaseTagVersion.ReleaseTagVersion;
        public versionInput: string;
        public foundVersions: Array<ReleaseTagVersion.ReleaseTagVersion>;
        public possibleVersions: Array<ReleaseTagVersion.ReleaseTagVersion>;

        constructor(private $scope: ISuccessorsGameScope, private $interval: ng.IIntervalService, private toaster: ngtoaster.IToasterService, private $modal: ng.ui.bootstrap.IModalService) {

        }

        public start() {
            if (this.timer != null) this.stopTimer();

            this.foundVersions = new Array();
            this.versionInput = null;
            this.millisecondsElapsed = 0;
            this.selectedVersion = ReleaseTagVersion.ReleaseTagVersion.fromDecimal(new Big(this.getRandomNumber()));
            this.possibleVersions = this.selectedVersion.getDirectSuccessors();

            this.startTimer();
            this.gameStarted = true;
        }

        private startTimer() {
            var that = this;

            this.timer = this.$interval(function () {
                that.millisecondsElapsed += 100;
            }, 100);
        }

        private stopTimer() {
            this.$interval.cancel(this.timer);
        }

        private getRandomNumber(): number {
            var max = new Big(1300010000130001);
            var min = 1;

            var randomValue = max.times(Math.random()).plus(min);

            return Math.floor(+randomValue.toFixed());
        }

        public get millisecondsCount(): string {
            var s = Math.floor(this.millisecondsElapsed / 1000);
            var ms = this.millisecondsElapsed - (s * 1000);

            var digit1 = ms < 10 ? "0" : "";
            var digit2 = ms < 100 ? "0" : "";

            return digit1 + digit2 + ms;
        }

        public get secondsCount(): string {
            var s = Math.floor(this.millisecondsElapsed / 1000);
            var m = Math.floor(s / 60);
            s -= m * 60;

            var digit1 = s < 10 ? "0" : "";

            return digit1 + s;
        }

        public get minutesCount(): string {
            var s = Math.floor(this.millisecondsElapsed / 1000);
            var m = Math.floor(s / 60);

            var digit1 = m < 10 ? "0" : "";

            return digit1 + m;
        }

        public win() {
            this.stopTimer();

            this.alert("You won!", "You found the " + this.possibleVersions.length + " possible versions in " + this.minutesCount + ":" + this.secondsCount + ":" + this.millisecondsCount + "!");
        }

        public alert(title: string, content: string) {
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
        }

        public submitVersion() {
            if (this.versionInput != null) {
                var v = ReleaseTagVersion.ReleaseTagVersion.tryParse(this.versionInput, true);

                if (!v.parseErrorMessage) {
                    // Note : isDirectPredecessor() is buggy. We use the array of successors instead
                    var successor = this.possibleVersions.filter(function (value, index, array): boolean {
                        return value.toString() == v.toString();
                    });

                    if (successor.length == 1) {
                        var existing = this.foundVersions.filter(function (value, index, array) : boolean {
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
        }
    }
}  