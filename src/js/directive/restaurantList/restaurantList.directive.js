app.directive("btRestaurantList", function(appConfig){
    return {
        scope:{
            restaurant: "=",
            isLast:"=",
            currentDay:"="
        },
        templateUrl: appConfig.dir_directive + 'restaurantList/restaurantList.html',
        controller: function($scope, $rootScope, $state){
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
        }
    };
});