app.directive("btAdvert", function(appConfig){
    return {
        scope: {
        },
        templateUrl: appConfig.dir_directive + 'advert/advert.html',
        controller: function($scope, $state, $rootScope, $sce, $transitions, appPath){
            $scope.appPath = appPath;
        }
    }
});