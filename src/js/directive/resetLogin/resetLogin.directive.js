app.directive("btResetLogin", function(appConfig){
    return {
        templateUrl: appConfig.dir_directive + 'resetLogin/resetLogin.html',
        controller: function($scope, $rootScope, $state){
            
        }
    };
});