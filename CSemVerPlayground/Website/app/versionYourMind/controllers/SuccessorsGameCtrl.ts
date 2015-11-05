module CSemVerPlayground.Website.VersionYourMind {
    export interface ISuccessorsGameScope extends ng.IScope {

    }

    export class SuccessorsGameCtrl {
        public totalQuestions = 0;
        public wonQuestions = 0;
        public gameStarted = false;
        public submitted = false;
        public selectedVersion: CSemVersion.CSemVersion;
        public firstInput: SuccessorInput<string>;
        public lastInput: SuccessorInput<string>;
        public howManyInput: SuccessorInput<number>;
        public possibleVersions: Array<CSemVersion.CSemVersion>;

        constructor(private $scope: ISuccessorsGameScope, private toaster: ngtoaster.IToasterService, private $modal: ng.ui.bootstrap.IModalService) {

        }

        public start() {
            this.totalQuestions++;
            this.firstInput = new SuccessorInput<string>();
            this.lastInput = new SuccessorInput<string>();
            this.howManyInput = new SuccessorInput<number>();

            this.selectedVersion = CSemVersion.CSemVersion.fromDecimal(new Big(this.getRandomNumber()));
            this.possibleVersions = this.selectedVersion.getDirectSuccessors();

            this.firstInput.expectedValue = this.possibleVersions[0].toString();
            this.lastInput.expectedValue = this.possibleVersions[this.possibleVersions.length - 1].toString();
            this.howManyInput.expectedValue = this.possibleVersions.length;

            this.submitted = false;
            this.gameStarted = true;
        }

        public submit() {
            this.submitted = true;

            this.firstInput.solve();
            this.lastInput.solve();
            this.howManyInput.solve();

            if (this.isFormValid) this.wonQuestions++;
        }

        private get allCheated() {
            return this.firstInput.cheated && this.lastInput.cheated && this.howManyInput.cheated;
        }

        private get isFormValid() {
            return this.firstInput.isValid && this.lastInput.isValid && this.howManyInput.isValid;
        }

        public getGroupClass<T>(input: SuccessorInput<T>) {
            if (this.submitted) {
                return input.isValid ? 'has-success' : 'has-error';
            }
        }

        public get panelClass() {
            if (!this.submitted) return "panel-primary";
            if (this.isFormValid) return "panel-success";
            return "panel-danger";
        }

        private getRandomNumber(): number {
            var max = new Big(1300010000130001);
            var min = 1;

            var randomValue = max.times(Math.random()).plus(min);

            return Math.floor(+randomValue.toFixed());
        }
    }
}  