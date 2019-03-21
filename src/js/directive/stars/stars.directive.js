app.directive("btStars", function(appConfig, LoginService, JwtService){
    return {
        scope:{
            rate: "=",
            getRate: "="
        },
        templateUrl: appConfig.dir_directive + 'stars/stars.html',
        controller: function($scope, $rootScope, $state){

            $scope.stars = [1,2,3,4,5];
        }
    };
});