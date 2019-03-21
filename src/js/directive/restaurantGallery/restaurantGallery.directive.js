app.directive("btRestaurantGallery", function(appConfig){
    return {
        scope:{
            galleries: "="
        },
        templateUrl: appConfig.dir_directive + 'restaurantGallery/restaurantGallery.html',
        controller: function($scope, $rootScope, $state){
            $scope.appConfig = appConfig;
            $scope.slickConfig = {
                enabled: true,
                autoplay: false,
                draggable: true,
            };
        },
        link: function(scope, elm, attr){
            // $(document).ready(function(){
            //     $('.image').featherlightGallery();
            // });
        }
    };
});