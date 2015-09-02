module CSemVerPlayground.Website.Browse {
    export interface IBrowseScope extends ng.IScope {

    }

    export class BrowseCtrl {
        public totalItems = new Big("13000100000000000000");
        public currentPage = new Big(1);
        public maxSize = 10;
        public itemsPerPage: Models.SelectOption<number>;
        public itemsPerPageOptions = new Array<Models.SelectOption<number>>();
        public items: Array<CSemVersion.CSemVersion>;
        public goToVersionNumberInput: string;
        public goToVersionTagInput: string;
        public goToFileVersionInput: string;

        constructor(private $scope: IBrowseScope, private $modal: ng.ui.bootstrap.IModalService) {
            this.generateItems();
            this.generateItemsPerPageOptions();
        }

        public generateItemsPerPageOptions() {
            var options = [10, 25, 50, 100];

            for (var i = 0; i < options.length; i++) {
                var option = new Models.SelectOption<number>(options[i] + " items per page", i);
                this.itemsPerPageOptions.push(option);

                if (i == 0) this.itemsPerPage = option;
            }
        }

        public generateItems() {
            this.items = new Array<CSemVersion.CSemVersion>();
            
            var maxNumber = this.currentPage.times(this.itemsPerPage.value);
            var minNumber = this.currentPage.times(this.itemsPerPage.value).minus(this.itemsPerPage.value).plus(1);

            for (var i = minNumber; i.lte(maxNumber); i = i.plus(1)) {
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
            var n = new Big(this.goToVersionNumberInput);

            return n.gte(1) && n.lte(this.totalItems);
        }

        public goToVersionNumber() {
            if (!this.isVersionNumberValid()) {
                this.error("Error", "Version number must be a numeric defined between 1 and 13000100000000000000.");
            }
            else {
                var pageNumber = new Big(this.goToVersionNumberInput).div(this.itemsPerPage.value);
                if (pageNumber.lt(1)) pageNumber = new Big(1);
                this.currentPage = pageNumber;

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

        public getNugetVersion(v: CSemVersion.CSemVersion): string {
            return v.toString(CSemVersion.Format.NugetPackageV2);
        }

        public getDottedOrderedVersion(v: CSemVersion.CSemVersion): string {
            return v.toString(CSemVersion.Format.DottedOrderedVersion);
        }
    }
}  