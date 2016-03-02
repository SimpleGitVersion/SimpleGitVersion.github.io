module CSemVerPlayground.Website.Modals {
    export interface IVersionDetailsModalScope extends ng.ui.bootstrap.IModalScope {

    }

    export class VersionDetailsModalCtrl {
        constructor(private $scope: IVersionDetailsModalScope, private version: CSemVersion.CSemVersion, private $modalInstance: ng.ui.bootstrap.IModalServiceInstance) {

        }

        public getNugetVersion(): string {
            return this.version.toString(CSemVersion.Format.NugetPackageV2);
        }

        public getFileVersion(): string {
            return this.version.toString(CSemVersion.Format.FileVersion);
        }

        public close() {
            this.$modalInstance.close();
        }
    }
} 