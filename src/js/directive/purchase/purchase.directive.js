app.directive("btPurchase", function(appConfig, JwtService){
    return {
        templateUrl: appConfig.dir_directive + 'purchase/purchase.html',
        controller: function($scope, $rootScope, $state, PurchaseService, JwtService, DatetimeService){
            var token = JwtService.getJwt();
            PurchaseService.getListUser(token)
            .then(function(response){
                $scope.purchaseList = response.data.data.data;
                $scope.resultsFound = true;
                $scope.loader = true;
            },function(response){
                if(response.status == 404){
                    $scope.resultsFound = false;
                    $scope.loader = true;
                }else{
                    $state.go(appPath.home.name, {});
                    $scope.loader = true;
                }
            });

            $scope.formatDate = function(date){
                return DatetimeService.formateDate(date, 'YYYY-MM-DD HH:mm:SS');
            };

            $scope.showPurchaseInfo = function(purchase){
                $rootScope.$broadcast("purchaseInfoEvent", {data:purchase});
            };

            $scope.paidChanged = function(purchase){
                if(purchase.paid){
                    PurchaseService.paid(purchase.id, purchase.payment_id, purchase.token, purchase.paid, token)
                    .then(function(data){
                        purchase.paid = true;
                    },function(error){
                        purchase.paid = false;
                    });
                }else{
                    purchase.paid = true;
                }
            };
        }
    };
});