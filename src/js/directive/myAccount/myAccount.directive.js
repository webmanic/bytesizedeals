app.directive("btMyAccount", function(appConfig){
    return {
        templateUrl: appConfig.dir_directive + 'myAccount/myAccount.html',
        controller: function($scope, $rootScope, $state){
        }
    }
});