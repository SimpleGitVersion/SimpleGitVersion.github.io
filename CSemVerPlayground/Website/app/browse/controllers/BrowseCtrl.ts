module CSemVerPlayground.Website.Browse {
    export interface IBrowseScope extends ng.IScope {

    }

    export class BrowseCtrl {
        public totalItems = 13000100000000000000;
        public currentPage = 1;
        public maxSize = 10;
        public itemsPerPage = 10;
        public itemsPerPageOptions = [10, 25, 50, 100];
        public items: Array<ReleaseTagVersion.ReleaseTagVersion>;
        public goToVersionNumberInput: number;
        public goToVersionTagInput: string;

        constructor(private $scope: IBrowseScope) {
            this.generateItems();
        }

        public generateItems() {
            this.items = new Array<ReleaseTagVersion.ReleaseTagVersion>();

            var maxNumber = this.currentPage * this.itemsPerPage;
            var minNumber = ((this.currentPage * this.itemsPerPage) - this.itemsPerPage) + 1;

            for (var i = minNumber; i <= maxNumber; i++) {
                var v = ReleaseTagVersion.ReleaseTagVersion.fromDecimal(new Big(i));
                this.items.push(v);
            }
        }

        public goToVersionNumber() {
            var pageNumber = Math.ceil(this.goToVersionNumberInput / this.itemsPerPage);
            if (pageNumber < 1) pageNumber = 1;
            this.currentPage = pageNumber;

            var v = ReleaseTagVersion.ReleaseTagVersion.fromDecimal(new Big(this.goToVersionNumberInput));
            this.goToVersionTagInput = v.toString();

            this.generateItems();
        }

        public goToVersionTag() {
            var v = ReleaseTagVersion.ReleaseTagVersion.tryParse(this.goToVersionTagInput, true);
            
            if (!v.parseErrorMessage) {
                this.goToVersionNumberInput = +v.orderedVersion.toFixed();
                this.goToVersionNumber();
            }
            else {
                console.log(v);
            }
        }

        public getNormalizedVersion(v: ReleaseTagVersion.ReleaseTagVersion) : string {
            return v.toString(ReleaseTagVersion.Format.Normalized);
        }

        public getSemVerVersion(v: ReleaseTagVersion.ReleaseTagVersion): string {
            return v.toString(ReleaseTagVersion.Format.SemVerWithMarker);
        }

        public getNugetVersion(v: ReleaseTagVersion.ReleaseTagVersion): string {
            return v.toString(ReleaseTagVersion.Format.NugetPackageV2);
        }

        public getDottedOrderedVersion(v: ReleaseTagVersion.ReleaseTagVersion): string {
            return v.toString(ReleaseTagVersion.Format.DottedOrderedVersion);
        }
    }
}  