module CSemVerPlayground.Website.VersionYourMind {
    export interface IPredecessorsGameScope extends ng.IScope {

    }

    export class PredecessorsGameCtrl {
        private answer: PredecessorsGameAnswer;

        public gameStarted = false;
        public versionA: ReleaseTagVersion.ReleaseTagVersion;
        public versionB: ReleaseTagVersion.ReleaseTagVersion;
        public totalQuestions = 0;
        public wonQuestions = 0;
        public answered = false;

        constructor(private $scope: IPredecessorsGameScope, private toaster: ngtoaster.IToasterService) {

        }

        public get answerText(): string {
            switch (this.answer) {
                case PredecessorsGameAnswer.AB:
                    return "A is a direct predecessor of B";
                case PredecessorsGameAnswer.BA:
                    return "B is a direct predecessor of A";
                case PredecessorsGameAnswer.Neither:
                    return "Neither is a direct predecessor";
            }
        }

        public getButtonClass(btn: PredecessorsGameAnswer): string {
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
        }

        public start() {
            this.gameStarted = true;
            this.nextQuestion();
        }

        public nextQuestion() {
            this.totalQuestions++;
            this.answered = false;
            this.pickRandomVersions();
        }

        public winQuestion() {
            this.answered = true;
            this.toaster.success("Correct!", this.answerText);
            this.wonQuestions++;
        }

        public loseQuestion() {
            this.answered = true;
            this.toaster.error("Wrong!", this.answerText);
        }

        public chooseAB() {
            if (this.answer == PredecessorsGameAnswer.AB) {
                this.winQuestion();
            }
            else {
                this.loseQuestion();
            }
        }

        public chooseBA() {
            if (this.answer == PredecessorsGameAnswer.BA) {
                this.winQuestion();
            }
            else {
                this.loseQuestion();
            }
        }

        public chooseNeither() {
            if (this.answer == PredecessorsGameAnswer.Neither) {
                this.winQuestion();
            }
            else {
                this.loseQuestion();
            }
        }

        private pickRandomVersions() {
            var answer = this.getRandomNumber(0, 2);

            if (answer == PredecessorsGameAnswer.AB || answer == PredecessorsGameAnswer.BA) {
                var v1Number = this.getRandomNumber(1, 1300010000130001);
                var v1 = ReleaseTagVersion.ReleaseTagVersion.fromDecimal(new Big(v1Number));
                var v1Successors = v1.getDirectSuccessors();

                var v2Number = this.getRandomNumber(0, v1Successors.length - 1);
                var v2 = v1Successors[v2Number];

                if (answer == PredecessorsGameAnswer.AB) {
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

                this.versionA = ReleaseTagVersion.ReleaseTagVersion.fromDecimal(new Big(v1Number));
                this.versionB = ReleaseTagVersion.ReleaseTagVersion.fromDecimal(new Big(v2Number));

                if (this.versionA.isDirectPredecessor(this.versionB) || this.versionB.isDirectPredecessor(this.versionA) ) {
                    this.pickRandomVersions();
                }
            }

            this.answer = answer;
        }

        private getRandomNumber(min: number, max: number): number {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        }
    }
}   