app.directive("btApprovalRestaurant", function(appConfig){
    return {
        templateUrl: appConfig.dir_directive + 'approvalRestaurant/approvalRestaurant.html',
        scope: {
            restaurant: "=",
            restaurantApprovalList: "=",
            index: "="
        },
        controller: function($scope, $rootScope, DatetimeService){
            $scope.currentDay = moment();
            $scope.appConfig = appConfig;

            $scope.dayLong = $scope.currentDay.format("dddd").toLowerCase();

            $scope.src = './img/gif/loading-placeholder.gif';
            $scope.doThis = function(image){
                $scope.src = image;
            };

            $scope.$watch("isLast", function(oldVal, newVal){
                if(newVal == true){
                    $scope.$emit("restuarntList", {isLast: newVal});
                }
            });

            $scope.getText = function(rate, review){
                var rateInt = parseInt(rate);
                var reviewInt = parseInt(review);
                if(reviewInt == 0){
                    return '0 Review';
                }else if(reviewInt == 1){
                    return 'Rate:' + Math.floor(rateInt/reviewInt) + ' (' + reviewInt + ' Review)';
                }else if(reviewInt > 1){
                    return 'Rate:' + Math.floor(rateInt/reviewInt) + ' (' + reviewInt + ' Reviews)';
                }
            };

            $scope.formatDate = function(date){
                return DatetimeService.formateDate(date, 'YYYY-MM-DD HH:mm:SS');
            };

            $scope.close = function(){
                $scope.showModal = false;
            };

            $scope.$on('approvalConfirm', function(){
                $scope.close();
            });
        }
    };
});