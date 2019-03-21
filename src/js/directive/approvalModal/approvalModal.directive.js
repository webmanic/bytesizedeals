app.directive("btApprovalModal", function(appConfig){
    return {
        templateUrl: appConfig.dir_directive + 'approvalModal/approvalModal.html',
        scope: {
            restaurant: "=",
            showModal: "=",
            close: "&",
            restaurantApprovalList: "=",
            index: "="
        },
        controller: function($scope, $rootScope, $sce, DatetimeService){
            $scope.appConfig = appConfig;
            $scope.formatDate = function(date){
                return DatetimeService.formateDate(date, 'YYYY-MM-DD HH:mm:SS');
            };
            $scope.to_trusted = function(html_code) {
                return $sce.trustAsHtml(html_code);
            };
        }
    };
});