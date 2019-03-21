app.directive("btApprovalConfirm", function(appConfig){
    return {
        templateUrl: appConfig.dir_directive + 'approvalConfirm/approvalConfirm.html',
        scope: {
            restaurant: "=",
            restaurantApprovalList: "=",
            index: "="
        },
        controller: function($scope, $rootScope, RestaurantService, JwtService){
            $scope.confirm = function(active){
                var token = JwtService.getJwt();
                var restaurant_id = $scope.restaurant.restaurant_id;
                var restaurant_title = $scope.restaurant.title;
                RestaurantService.approvalConfirm(token, active, $scope.restaurant)
                .then(function(response){
                    var message = active ? "You have approved: " + restaurant_id + " - " + restaurant_title + "." : "You have decline :" + restaurant_id + " - " + restaurant_title + ".";
                    $scope.$emit('approvalConfirm', {});
                    $rootScope.$broadcast('alerts', {type:'info', id:'approval', message:message});
                    //$scope.restaurantApprovalList.splice($scope.index, 1);
                    // if($scope.restaurantApprovalList.length == 0){
                    //     $scope.$emit("loadMoreApprovalList", {});
                    // }
                    $scope.restaurant.hide = true;
                },
                function(response){
                    if(response.status == 401){
                        $rootScope.$broadcast('alerts', {type:'error', id:'approval', message:'Invalid Token'});
                    }else{
                        $rootScope.$broadcast('alerts', {type:'error', id:'approval', message:'Technical Error, please try again later'});
                    }
                });
            };
        }
    };
});