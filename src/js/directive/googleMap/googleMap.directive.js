app.directive("btGoogleMap", function(appConfig, GoogleService){
    return {
        scope: {
            id: "=",
            zoom: "=",
            restaurant: "="
        },
        templateUrl: appConfig.dir_directive + 'googleMap/googleMap.html',
        controller: function($scope){
            $scope.config ={
                id: $scope.id,
                zoom: parseInt($scope.zoom),
                latitude: parseFloat($scope.restaurant.latitude),
                longitude: parseFloat($scope.restaurant.longitude)
            };
        },
        link: function(scope, ele, attr){
            scope.$watch('id', function(oldVal, newVal){
                GoogleService.initialize(scope.config);
            });
        }
    };
});