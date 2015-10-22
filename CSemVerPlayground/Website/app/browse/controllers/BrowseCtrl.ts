module CSemVerPlayground.Website.Browse {
    export interface IBrowseScope extends ng.IScope {

    }

    export class BrowseCtrl {
        public totalItems = new Big("13000100000000000000");
        public currentPage = new Big(1);
        public maxPage = new Big("1300010000000000000");
        public maxSize = 10;
        public itemsPerPage: Models.SelectOption<number>;
        public itemsPerPageOptions = new Array<Models.SelectOption<number>>();
        public items: Array<CSemVersion.CSemVersion>;
        public goToVersionNumberInput: string;
        public goToVersionTagInput: string;
        public goToFileVersionInput: string;

        constructor(private $scope: IBrowseScope, private $modal: ng.ui.bootstrap.IModalService) {
            this.generateItemsPerPageOptions();
            this.goToVersionNumberInput = "1";
            this.goToVersionNumber();
            this.onScroll();
        }

        private onScroll() {
            var _me = this;

            $('html').bind('mousewheel DOMMouseScroll', function (e) {
                var event = <any> e.originalEvent;
                var delta = +event.wheelDelta || +event.detail;
                if (_me.isVersionNumberValid()) {
                    var currentVersion = new Big(_me.goToVersionNumberInput);

                    if (delta < 0) currentVersion = currentVersion.plus(1);
                    if (delta > 0) currentVersion = currentVersion.minus(1);

                    if (_me.isVersionNumberValid(currentVersion)) {
                        _me.goToVersionNumberInput = currentVersion.toString();
                        _me.goToVersionNumber();
                    }

                    _me.$scope.$apply();
                }
            });
        }

        public generateItemsPerPageOptions() {
            var options = [10, 25, 50, 100];

            for (var i = 0; i < options.length; i++) {
                var option = new Models.SelectOption<number>(options[i] + " items per page", options[i]);
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

        public isVersionNumberValid(input?: BigJsLibrary.BigJS): boolean {
            var n = new Big(this.goToVersionNumberInput);
            if (input) n = input;

            return n.gte(1) && n.lte(this.totalItems);
        }

        public goToVersionNumber() {
            if (!this.isVersionNumberValid()) {
                this.error("Error", "Version number must be a numeric defined between 1 and " + this.totalItems.toString() + ".");
            }
            else {
                var pageNumber = new Big(this.goToVersionNumberInput).div(this.itemsPerPage.value);
                if (pageNumber.lt(1)) pageNumber = new Big(1);
                this.currentPage = pageNumber.round(0, 3);

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

        public goFirst() {
            this.goToVersionNumberInput = "1";
            this.goToVersionNumber();
        }

        public goLast() {
            this.goToVersionNumberInput = this.totalItems.toString();
            this.goToVersionNumber();
        }

        public canGoPrevious(): boolean {
            if (this.currentPage.eq(1)) return false;
            else return true;
        }

        public goPrevious() {
            this.currentPage = this.currentPage.minus(1);
            this.generateItems();
        }

        public canGoNext(): boolean {
            if (this.currentPage.eq(this.maxPage)) return false;
            else return true;
        }

        public goNext() {
            this.currentPage = this.currentPage.plus(1);
            this.generateItems();
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