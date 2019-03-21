app.directive("btSignup", function(appConfig){
    return {
        templateUrl: appConfig.dir_directive + 'signup/signup.html',
        controller: function($scope){
            $scope.appConfig = appConfig;
        }
    };
});