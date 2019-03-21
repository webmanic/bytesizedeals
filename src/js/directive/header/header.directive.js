app.directive("btHeader", function(appConfig){
    return {
        scope: {
        },
        templateUrl: appConfig.dir_directive + 'header/header.html',
        controller: function($scope, $rootScope, $location, JwtService, LoginService, RestaurantService, WishListService, appPath){

            var checkRestaurant = function(){
                if($scope.jwtPayLoad && $scope.jwtPayLoad.role.indexOf('restaurant') != -1){
                    RestaurantService.restaurantActive(JwtService.getJwt()).then(function(response){
                        if(response.data.data.data.active == 1 || response.data.data.data.active == 2){
                            $scope.restaurantSignup = false;
                            $scope.restaurantId = response.data.data.data.restaurant_id;
                        }else{
                            $scope.restaurantSignup = true;
                        }
                    }, function(){
                        $scope.restaurantSignup = true;
                    });
                }
            };

            $scope.logout = function(){
                LoginService.logout();
            };

            WishListService.getTotalList($scope, function(event, data){
                $scope.wishListCount = data.total;
            });

            LoginService.isLoggedIn($scope, function somethingChanged(event, data){
                $scope.jwtPayLoad = data.payload;
                $scope.isLoggedIn = data.isLoggedIn;
                checkRestaurant();
            });

            $scope.cleanUrl = function(){
                $location.search('q', null);
                $rootScope.$broadcast("cleanUrl", {});
            };
        }
    };
});