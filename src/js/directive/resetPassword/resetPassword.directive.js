app.directive("btResetPassword", function(appConfig){
    return {
        templateUrl: appConfig.dir_directive + 'resetPassword/resetPassword.html',
        controller: function($scope, $rootScope, $state){
            
        }
    };
});