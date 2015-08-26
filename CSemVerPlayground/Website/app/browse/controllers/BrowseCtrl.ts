module CSemVerPlayground.Website.Browse {
    export interface IBrowseScope extends ng.IScope {

    }

    export class BrowseCtrl {
        public totalItems = 13000100000000000000;
        public currentPage = 1;
        public maxSize = 10;
        public itemsPerPage = 10;
        public itemsPerPageOptions = [10, 25, 50, 100];
        public items: Array<CSemVersion.CSemVersion>;
        public goToVersionNumberInput: number;
        public goToVersionTagInput: string;

        constructor(private $scope: IBrowseScope, private $modal: ng.ui.bootstrap.IModalService) {
            this.generateItems();
        }

        public generateItems() {
            this.items = new Array<CSemVersion.CSemVersion>();
            
            var maxNumber = this.currentPage * this.itemsPerPage;
            var minNumber = ((this.currentPage * this.itemsPerPage) - this.itemsPerPage) + 1;

            for (var i = minNumber; i <= maxNumber; i++) {
                var v = CSemVersion.CSemVersion.fromDecimal(new Big(i));
                this.items.push(v);
            }
        }

        public error(title: string, content: string) {
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

        public isVersionNumberValid(): boolean {
            var n = this.goToVersionNumberInput;

            return !isNaN(n) && n > 1 && n <= 13000100000000000000;
        }

        public goToVersionNumber(sync = true) {
            if (!this.isVersionNumberValid()) {
                this.error("Error", "Version number must be a numeric defined between 1 and 13000100000000000000.");
            }
            else {
                var pageNumber = Math.ceil(this.goToVersionNumberInput / this.itemsPerPage);
                if (pageNumber < 1) pageNumber = 1;
                this.currentPage = pageNumber;

                if (sync) {
                    var v = CSemVersion.CSemVersion.fromDecimal(new Big(this.goToVersionNumberInput));
                    this.goToVersionTagInput = v.toString();
                }

                this.generateItems();
            }
        }

        public goToVersionTag() {
            var v = CSemVersion.CSemVersion.tryParse(this.goToVersionTagInput, true);
            
            if (!v.parseErrorMessage) {
                this.goToVersionNumberInput = +v.orderedVersion.toFixed();
                this.goToVersionNumber(false);
            }
            else {
                this.error("Error", v.parseErrorMessage);
            }
        }

        public getNormalizedVersion(v: CSemVersion.CSemVersion) : string {
            return v.toString(CSemVersion.Format.Normalized);
        }

        public getSemVerVersion(v: CSemVersion.CSemVersion): string {
            return v.toString(CSemVersion.Format.SemVerWithMarker);
        }

        public getNugetVersion(v: CSemVersion.CSemVersion): string {
            return v.toString(CSemVersion.Format.NugetPackageV2);
        }

        public getDottedOrderedVersion(v: CSemVersion.CSemVersion): string {
            return v.toString(CSemVersion.Format.DottedOrderedVersion);
        }
    }
}  