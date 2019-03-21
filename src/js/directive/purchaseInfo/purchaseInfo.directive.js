app.directive("btPurchaseInfo", function(appConfig, JwtService){
    return {
        templateUrl: appConfig.dir_directive + 'purchaseInfo/purchaseInfo.html',
        controller: function($scope, $rootScope, $state, PurchaseService, JwtService, DatetimeService){

            $scope.purchaseInfo = false;

            $rootScope.$on("purchaseInfoEvent", function(event, data){
                $scope.purchaseInfo = true;
                $scope.info = data.data;
            });

            $scope.formatDate = function(date){
                return DatetimeService.formateDate(date, 'YYYY-MM-DD HH:mm:SS');
            };

            $scope.close = function(){
                $scope.purchaseInfo = false;
            };
        }
    };
});