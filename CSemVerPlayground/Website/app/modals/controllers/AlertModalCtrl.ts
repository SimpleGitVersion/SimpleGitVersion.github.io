module CSemVerPlayground.Website.Modals {
    export interface IAlertModalScope extends ng.ui.bootstrap.IModalScope {

    }

    export class AlertModalCtrl {
        constructor(private $scope: IAlertModalScope, private title: string, private content: string, private $modalInstance: ng.ui.bootstrap.IModalServiceInstance) {

        }

        public close() {
            this.$modalInstance.close();
        }
    }
} 