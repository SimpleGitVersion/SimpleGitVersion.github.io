module CSemVerPlayground.Website {
    export interface IAppScope extends ng.IScope {

    }

    export class AppCtrl {

        constructor(private $scope: IAppScope) {

        }
    }
}  