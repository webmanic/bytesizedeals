app.controller("approvalRestaurantController", function($scope, $rootScope, $state, $stateParams, $localStorage, RestaurantService, appConfig, JwtService){

    var active = false;
    $scope.appConfig = appConfig;
    $scope.pageNo = 0;
    $scope.rowNo = 0;
    $scope.restaurantApprovalList = [];
    $scope.geolocation = $localStorage.geolocation;
    var token = JwtService.getJwt();

    var approvalRestaurant = function(search, pageNo){
        $scope.loader = true;
        RestaurantService.approval(token, $scope.search, $scope.geolocation, pageNo, active).then(function(response){
            $scope.loader = false;
            $scope.restaurantApprovalList = $scope.restaurantApprovalList.concat(response.data.data.data);
            $scope.rowNo = response.data.data.rowNo;
            $scope.pageNo ++;
        },function(response){
            if(response.status == 404){
                $scope.loader = false;
                $scope.search_results = true;
                $scope.restaurantApprovalList = [];
            }else{
                $scope.loader = false;
                if(response.status == 404){
                    
                }else{
                    $rootScope.$broadcast('alerts', {type:'error', id:'login', message:'Technical Error, please try again later'});
                }
            }
        });
    };

    $scope.approval_restaurant = function(event){
        $scope.pageNo ++;
        if(event.which == 13 || event.which == 1){
            if(!$scope.search || $scope.search == '' || $scope.search.length == 0){
                $scope.restaurant_approval_list = [];
                $scope.search_results = true;
            }else{
                $scope.restaurant_approval_list = [];
                searchRestaurant($scope.search, $scope.pageNo);
                event.preventDefault();
                return false;
            }
        }else{
            if(!$scope.search || $scope.search == '' || $scope.search.length == 0){
                $scope.restaurant_list = [];
                $scope.search_results = false;
            }
        }
    };

    $scope.loadMore = function(){
        approvalRestaurant($scope.search, $scope.pageNo);
    };

    $scope.$on("loadMoreApprovalList", function(){
        $scope.pageNo --;
        $scope.loadMore();
    });

    approvalRestaurant($scope.search, $scope.pageNo);
});