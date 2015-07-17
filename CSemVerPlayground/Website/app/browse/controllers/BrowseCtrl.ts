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
    }
}  