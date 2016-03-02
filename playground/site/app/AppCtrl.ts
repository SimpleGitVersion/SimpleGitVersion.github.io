module CSemVerPlayground.Website {
    export interface IAppScope extends ng.IScope {

    }

    export class AppCtrl {
        public currentPage: string;

        constructor(private $scope: IAppScope, private $route, private $routeParams) {
            var me = this;

            $scope.$on('$routeChangeSuccess', function (e, route) {
                me.currentPage = route.$$route.name; 
            });
        }

        public isActive(pageName: string): boolean {
            return this.currentPage ? pageName == this.currentPage : false;
        }
    }
}  