app.controller("searchController", function ($scope, $rootScope, $localStorage, $location, RestaurantService, appConfig, appPath) {

    $scope.appConfig = appConfig;
    $scope.pageNo = 0;
    $scope.rowNo = 0;
    $scope.restaurant_list = [];
    $scope.search_results = false;
    $scope.currentDay = moment();

    var geolocationConfig = {
        maximumAge: 60000
    };

    $scope.geolocation = {
        latitude: undefined,
        longitude: undefined
    };

    $scope.getLocation = function () {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(showPosition, handleError, geolocationConfig);
        } else {
            x.innerHTML = "Geolocation is not supported by this browser.";
        }
    };

    function showPosition(position) {
        $scope.geolocation.latitude = position.coords.latitude;
        $scope.geolocation.longitude = position.coords.longitude;
        $localStorage.geolocation = $scope.geolocation;
        $rootScope.$broadcast('alerts', {
            type: 'clear',
            id: 'geoLocation'
        });
    }

    var checkGeoLocation = function () {
        if (!$localStorage.geolocation) {
            $scope.getLocation();
            $rootScope.$broadcast('alerts', {
                type: 'warn',
                id: 'geoLocation',
                message: 'Share location will help you find nearest restaurants'
            });
        } else {
            $scope.geolocation = $localStorage.geolocation;
        }
    };

    checkGeoLocation();

    function handleError(error) {
        //Handle Errors
        switch (error.code) {
            case error.PERMISSION_DENIED:
                console.log("User denied the request for Geolocation.");
                break;
            case error.POSITION_UNAVAILABLE:
                console.log("Location information is unavailable.");
                break;
            case error.TIMEOUT:
                console.log("The request to get user location timed out.");
                break;
            case error.UNKNOWN_ERROR:
                console.log("An unknown error occurred.");
                break;
        }
    }


    var searchRestaurant = function(search, pageNo){
        $scope.loader = true;
        if(search.length > 0){
            RestaurantService.list(search, $scope.geolocation, pageNo).then(
            function(response){
                $scope.loader = false;
                $scope.search_results = true;
                $scope.restaurant_list = $scope.restaurant_list.concat(response.data.data.data);
                $scope.rowNo = response.data.data.rowNo;
                $scope.pageNo ++;
                $scope.callFunction = true;
            },
            function(response){
                $location.search('q', null);
                if(response.status == 404){
                    $scope.loader = false;
                    $scope.search_results = true;
                    $scope.restaurant_list = [];
                }else{
                    $scope.loader = false;
                    $rootScope.$broadcast('alerts', {type:'error', id:'login', message:'Technical Error, please try again later'});
                }
            });
        }else{
            $location.search('q', null);
            $scope.loader = false;
            $scope.search_results = true;
            $scope.restaurant_list = [];
        }
    };

    $scope.search_restaurant = function(event){
        $scope.pageNo = 0;
        if(event.which == 13 || event.which == 1){
            if(!$scope.search || $scope.search == '' || $scope.search.length == 0){
                $scope.restaurant_list = [];
                $scope.search_results = true;
            }else{
                $scope.restaurant_list = [];
                $location.url(appPath.home.path + '?q=' + $scope.search, false);
                searchRestaurant($scope.search, $scope.pageNo);
                event.preventDefault();
                return false;
            }
        }else{
            if(!$scope.search || $scope.search == '' || $scope.search.length == 0){
                $scope.restaurant_list = [];
                $scope.search_results = false;
                $scope.search = '';
                $location.search({});
            }
        }
    };

    $scope.$on("restuarntList", function(event, data){
        if(data.isLast == true){
            $(function(){
                if (($("#restaurants-list").offset().top + $("#restaurants-list").height()) >= $(window).height()) {

                }else{
                    if($scope.rowNo > $scope.pageNo ){
                        searchRestaurant($scope.search, $scope.pageNo);
                    }
                }
            });
        }
    });

    $(document).ready(function() {
        $scope.callFunction = true;
        $(window).scroll(function() {
            if($scope.callFunction && $(window).scrollTop() + $(window).height() == $(document).height() ) {
                if($scope.pageNo < $scope.rowNo){
                    searchRestaurant($scope.search, $scope.pageNo);
                    $scope.callFunction = false;
                }
            }
        });
     });

     var searchQuery = $location.search().q; 
     if(searchQuery){
        $scope.search = searchQuery;
        searchRestaurant(searchQuery, $scope.pageNo);
     }

     $rootScope.$on("cleanUrl", function(){
        $scope.restaurant_list = [];
        $scope.search_results = false;
        $scope.search = '';
     });
});