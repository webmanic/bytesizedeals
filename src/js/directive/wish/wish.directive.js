app.directive("btWish", function(appConfig, LoginService, JwtService, WishListService){
    return {
        templateUrl: appConfig.dir_directive + 'wish/wish.html',
        scope:{
            type: "=",
            restaurant: "="
        },
        controller: function($scope, $rootScope, $state){
            $scope.checkWishListExists = function(){
                $scope.wishListExists = WishListService.exists($scope.restaurant);
                if($scope.wishListExists){
                    WishListService.add($scope.restaurant);
                }
            };
            $scope.checkWishListExists();
        },
        link: function(scope, elm, attr){
            scope.addRemove = function(wishListExists, event){
                event.stopPropagation();
                if(!wishListExists){
                    WishListService.add(scope.restaurant);
                }else{
                    WishListService.remove(scope.restaurant);
                }
                scope.checkWishListExists();
            };
        }
    };
});