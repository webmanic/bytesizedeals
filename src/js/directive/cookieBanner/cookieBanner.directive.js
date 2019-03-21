app.directive("btCookieBanner", function(appConfig){
    return {
        templateUrl: appConfig.dir_directive + 'cookieBanner/cookieBanner.html',
        controller: function($scope, $cookies, appPath){
            $scope.appPath = appPath;
            $scope.displayCookieBanner = $cookies.get("cookieBanner") ? false : true;
            $scope.accept = function(){
                $cookies.put("cookieBanner", true);
                $scope.displayCookieBanner = false;
            };
        }
    };
});