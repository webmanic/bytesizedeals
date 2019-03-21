app.controller("restaurantController", function($scope, $rootScope, $state, $stateParams, $localStorage, $location, $sce, RestaurantService, DatetimeService, appConfig, appPath){

    $scope.appConfig = appConfig;

    $scope.showLocation = false;

    $scope.showLocationPanel = function(){
        if($scope.showLocation){
            $scope.showLocation = false;
        }else{
            $scope.showLocation = true;
        }
    };

    $scope.geolocation = $localStorage.geolocation;
    RestaurantService.restaurantId($stateParams.id, $scope.geolocation).then(function(response){
        $scope.restaurant = response.data.data.data[0];
    }, function(response){
        if(response.status == 404){
            $rootScope.$broadcast('alerts', {type:'error', id:'restaurant', message:'The page you\'re looking is not found'});
        }else{
            $rootScope.$broadcast('alerts', {type:'error', id:'restaurant', message:'Technical Error, please try again later'});
        }
        $state.go(appPath.home.name, {});
    });

    $scope.src = './img/gif/loading-placeholder.gif';
    $scope.doThis = function(image){
        $scope.src = image;
    };

    $scope.$on("reviewUpdate", function(event, data){
        var rate = parseInt(data.rate);
        if(data.reviewIncrement){
            $scope.restaurant.review = parseInt($scope.restaurant.review) + 1; 
            $scope.restaurant.rate = parseInt($scope.restaurant.rate) + rate;
        }else{
            $scope.restaurant.review = parseInt($scope.restaurant.review) - 1; 
            $scope.restaurant.rate = parseInt($scope.restaurant.rate) - rate;
        }
        
    });

    $scope.formatDate = function(date){
        return DatetimeService.formateDate(date, 'YYYY-MM-DD HH:mm:SS');
    };
    
    $scope.searchCategories = function(category){
        $location.url(appPath.home.path + '?q=' + category);
    };

    $scope.to_trusted = function(html_code) {
        return $sce.trustAsHtml(html_code);
    };
});