module CSemVerPlayground.Website.DirectSuccessors {
    export interface IDirectSuccessorsScope extends ng.IScope {

    }

    export class DirectSuccessorsCtrl {
        public errorMessage: string;
        public givenVersionTagInput: string;
        public submittedVersion: string;
        public successors: Array<CSemVersion.CSemVersion>;
        public currentVersion: CSemVersion.CSemVersion;
        public test = CSemVersion.CSemVersion.standardPreReleaseNames;

        constructor(private $scope: IDirectSuccessorsScope, private $modal: ng.ui.bootstrap.IModalService, private VersionSuggestionsProvider: Services.IVersionSuggestionsProvider) {
            this.successors = new Array<CSemVersion.CSemVersion>();
        }

        public getDirectSuccessors() {
            if (this.givenVersionTagInput) {
                var v = CSemVersion.CSemVersion.tryParse(this.givenVersionTagInput, true);
                
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
        }

        public getNormalizedSubmittedVersion(): string {
            return this.submittedVersion[0] == 'v' ? this.submittedVersion : 'v' + this.submittedVersion;
        }

        public getCorrectVersion(): string {
            return this.currentVersion.toString();
        }

        public getSuggestions(input: string): Array<string> {
            return this.VersionSuggestionsProvider.getSuggestions(input);
        }

        public viewDetails(v: CSemVersion.CSemVersion) {
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
        }
    }
} 