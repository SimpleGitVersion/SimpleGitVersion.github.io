module CSemVerPlayground.Website.Browse {
    export interface IBrowseScope extends ng.IScope {

    }

    export class BrowseCtrl {
        public totalItems = 13000100000000000000;
        public currentPage = "1";
        public maxSize = 10;
        public itemsPerPage = 10;
        public itemsPerPageOptions = [10, 25, 50, 100];
        public items: Array<CSemVersion.CSemVersion>;
        public goToVersionNumberInput: string;
        public goToVersionTagInput: string;
        public goToFileVersionInput: string;

        constructor(private $scope: IBrowseScope, private $modal: ng.ui.bootstrap.IModalService) {
            this.generateItems();
        }

        public generateItems() {
            this.items = new Array<CSemVersion.CSemVersion>();
            
            //var maxNumber = this.currentPage * this.itemsPerPage;
            //var minNumber = ((this.currentPage * this.itemsPerPage) - this.itemsPerPage) + 1;

            //for (var i = minNumber; i <= maxNumber; i++) {
            //    var v = CSemVersion.CSemVersion.fromDecimal(new Big(i));
            //    this.items.push(v);
            //}
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
            var n = new Big(this.goToVersionNumberInput);

            return n.gte(1) && n.lte("13000100000000000000");
        }

        public goToVersionNumber() {
            if (!this.isVersionNumberValid()) {
                this.error("Error", "Version number must be a numeric defined between 1 and 13000100000000000000.");
            }
            else {
                var pageNumber = new Big(this.goToVersionNumberInput).div(this.itemsPerPage);
                if (pageNumber.lt(1)) pageNumber = new Big(1);
                this.currentPage = pageNumber.toString();

                var v = CSemVersion.CSemVersion.fromDecimal(new Big(this.goToVersionNumberInput));
                this.goToVersionTagInput = v.toString();
                this.goToFileVersionInput = this.getDottedOrderedVersion(v);
                
                this.generateItems();
            }
        }

        public goToVersionTag() {
            var v = CSemVersion.CSemVersion.tryParse(this.goToVersionTagInput, true);
            
            if (!v.parseErrorMessage) {
                this.goToVersionNumberInput = v.orderedVersion.toFixed();
                this.goToVersionNumber();
            }
            else {
                this.error("Error", v.parseErrorMessage);
            }
        }

        public goToFileVersion() {
            var v = CSemVersion.CSemVersion.tryParseFileVersion(this.goToFileVersionInput);

            if (!v.parseErrorMessage) {
                this.goToVersionNumberInput = v.orderedVersion.toFixed();
                this.goToVersionNumber();
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