module CSemVerPlayground.Website.Home {
    export interface IHomeScope extends ng.IScope {
        
    }

    export class HomeCtrl {
        constructor(private $scope: IHomeScope) {

        }
    }
} 