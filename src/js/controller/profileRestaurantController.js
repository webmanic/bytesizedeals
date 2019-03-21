app.controller("profileRestaurantController", function($scope, $rootScope, $state, $stateParams, $localStorage, $sce, RestaurantService, DatetimeService, JwtService, appConfig, appPath, LoginService){

    $scope.appConfig = appConfig;

    $scope.showLocation = false;

    function getContractLeftDays(startDate, endDate){
        var currentDate = moment();
        var startDate = moment(startDate, "YYYY-MM-DD");
        var endDate = moment(endDate, "YYYY-MM-DD");
        $scope.contractNoOfDays =  Math.ceil(moment.duration(endDate.diff(currentDate)).asDays()) + 1;
        if($scope.restaurant.active != 2){
            alertExpiryNotification();
        }
    }

    function alertExpiryNotification(){
        if($scope.contractNoOfDays < 1){
            $rootScope.$broadcast('alerts', {type:'error', id:'expiryNotification', message:"Your contract has been expired <a href='#' ng-click='navigateRestaurantProfile($event, \"expiryNotification\")'>click here</a> for more info."});
        }else if($scope.contractNoOfDays > 0 &&  $scope.contractNoOfDays <= $scope.appConfig.contract_renewal){
            $rootScope.$broadcast('alerts', {type:'warn', id:'expiryNotification', message:"Your contract is about to expire <a href='#' ng-click='navigateRestaurantProfile($event, \"expiryNotification\")'>click here</a> for more info."});
        }
    }

    function alertCashPaymentRenwal(){
        $scope.cashPaymentRenwal = true;
        $rootScope.$broadcast('alerts', {type:'warn', id:'renewalResturant', message:'Please wait for an admin to review and approve your renewal'});
    }

    $scope.showLocationPanel = function(){
        if($scope.showLocation){
            $scope.showLocation = false;
        }else{
            $scope.showLocation = true;
        }
    };

    $scope.geolocation = $localStorage.geolocation;
    var token = JwtService.getJwt();
    RestaurantService.restaurantProfileId($stateParams.id, $scope.geolocation, token).then(function(response){
        $scope.restaurant = response.data.data.data[0];
        $scope.profile = {
            title:{
                value: $scope.restaurant.title
            } 
        };
        getContractLeftDays($scope.restaurant.start_date, $scope.restaurant.end_date);
        if($scope.restaurant.active == 2){
            alertCashPaymentRenwal();
        }
    }, function(response){
        if(response.status == 401){
            $state.go(appPath.restaurant.name, {id:$stateParams.id});
        }else if(response.status == 404){
            $rootScope.$broadcast('alerts', {type:'error', id:'restaurant', message:'The page you\'re looking is not found'});
            $state.go(appPath.home.name, {});
        }else{
            $rootScope.$broadcast('alerts', {type:'error', id:'restaurant', message:'Technical Error, please try again later'});
            $state.go(appPath.home.name, {});
        }
    });

    $scope.src = './img/gif/loading-placeholder.gif';
    $scope.doThis = function(image){
        $scope.src = image;
    };

    $scope.formatDate = function(date){
        return DatetimeService.formateDate(date, 'YYYY-MM-DD HH:mm:SS');
    };

    LoginService.isLoggedIn($scope, function somethingChanged(event, data){
        $scope.jwtPayLoad = data.payload;
        $scope.isLoggedIn = data.isLoggedIn;
        if(!$scope.isLoggedIn && !$stateParams.id){
            $rootScope.$broadcast('alerts', {type:'error', id:'restaurant', message:'The page you\'re looking is not found'});
            $state.go(appPath.home.name, {});
        }
    });


    function renewContract(data){
        RestaurantService.renew($scope.restaurant.id,
                                $scope.restaurant.token, 
                                $scope.contractNoOfDays, 
                                data,
                                token).then(function(response){
            if($scope.restaurant.active == 1){
                $rootScope.$broadcast('alerts', {type:'info', id:'renewalResturant', message:'Contract has been successfully renewed'});
                $scope.restaurant.start_date = response.data.data.start_date;
                $scope.restaurant.end_date = response.data.data.end_date;
            }else if($scope.restaurant.active == 2){
                alertCashPaymentRenwal();
            }
            getContractLeftDays(moment(response.data.data.start_date, 'DD/MM/YYYY').format('YYYY-MM-DD'), moment(response.data.data.end_date, 'DD/MM/YYYY').format('YYYY-MM-DD'));
        });
    }

    $rootScope.$on("paypalEvent", function(event, data){
        switch(data.payment){
            case "SUCCESS":
                data.response.type = "paypal";
                renewContract(data.response);
            break;
            case "CASH":
                data.response.type = "cash";
                renewContract(data.response);
            break;
        }
    });

    $scope.to_trusted = function(html_code) {
        return $sce.trustAsHtml(html_code);
    };
});