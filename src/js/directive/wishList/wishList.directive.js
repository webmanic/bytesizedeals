app.directive("btWishList", function(appConfig, LoginService, JwtService, WishListService){
    return {
        templateUrl: appConfig.dir_directive + 'wishList/wishList.html',
        controller: function($scope, $rootScope, $state){

            $scope.pageNo = 0;
            $scope.limit = 8;
            $scope.rowNo = 0;

            $scope.wishList = [];

            WishListService.getTotalList($scope, function(event, data){
                $scope.wishListTotal = data.total;
                $scope.rowNo = Math.ceil(data.total / $scope.limit) - 1;
            });

            var loadWishList = function(){
                $scope.wishList = $scope.wishList.concat(WishListService.getList($scope.limit)[$scope.pageNo]);
            };

            $scope.load_more = function(){
                if($scope.pageNo < $scope.rowNo){
                    $scope.pageNo ++;
                    loadWishList();
                }
            };

            loadWishList();
        }
    };
});