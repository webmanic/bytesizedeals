app.directive("btFooter", function(appConfig, contactConfig){
    return {
        templateUrl: appConfig.dir_directive + 'footer/footer.html',
        controller: function($scope, appPath){
            $scope.appPath = appPath;
            $scope.contactConfig = contactConfig;
        }
    };
});