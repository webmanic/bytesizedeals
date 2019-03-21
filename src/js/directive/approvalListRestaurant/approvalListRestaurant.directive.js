app.directive("btApprovalListRestaurant", function(appConfig){
    return {
        templateUrl: appConfig.dir_directive + 'approvalListRestaurant/approvalListRestaurant.html',
        scope: {
            restaurantApprovalList: "=",
            rowNo: "=",
            pageNo: "=",
            loadMore: "&"
        },
        controller: function($scope, $rootScope){

        }
    };
});