app.config(function(appPath, $stateProvider, $urlRouterProvider, $locationProvider){
    
    $locationProvider.hashPrefix("");

    $urlRouterProvider.otherwise('/');

    $stateProvider

    .state(appPath.home.name, {
        url: appPath.home.path,
        templateUrl: './view/searchController.html'
    })

    .state(appPath.signup.name, {
        url: appPath.signup.path,
        templateUrl: './view/signupController.html',
        controller: function($scope, $state, LoginService){
            LoginService.isLoggedIn($scope, function somethingChanged(event, data){
                $scope.isLoggedIn = data.isLoggedIn;
                if($scope.isLoggedIn){
                    $state.go(appPath.home.name, {});
                }
            });
        }
    })

    .state(appPath.restaurantSignup.name, {
        url: appPath.restaurantSignup.path,
        templateUrl: './view/signupRestaurantController.html',
        controller: function($scope, $state, JwtService, RestaurantService, LoginService){
            LoginService.isLoggedIn($scope, function somethingChanged(event, data){
                $scope.isLoggedIn = data.isLoggedIn;
                $scope.jwtPayLoad = data.payload;
                if(!$scope.isLoggedIn || $scope.jwtPayLoad.role.indexOf('restaurant') == -1){
                    $state.go(appPath.home.name, {});
                }else{
                    RestaurantService.restaurantActive(JwtService.getJwt()).then(function(response){
                        if(response.data.data.data.active == 1 || response.data.data.data.active == 2){
                            $state.go(appPath.restaurantUpdate.name, {});
                        }
                    },function(){});
                }
            });
        }
    })


    .state(appPath.restaurantUpdate.name, {
        url: appPath.restaurantUpdate.path,
        templateUrl: './view/updateRestaurantController.html',
        controller: function($scope, $state, LoginService){
            LoginService.isLoggedIn($scope, function somethingChanged(event, data){
                $scope.isLoggedIn = data.isLoggedIn;
                $scope.jwtPayLoad = data.payload;
                if(!$scope.isLoggedIn || $scope.jwtPayLoad.role.indexOf('restaurant') == -1){
                    $state.go(appPath.home.name, {});
                }
            });
        }
    })

    .state(appPath.restaurantApproval.name, {
        url: appPath.restaurantApproval.path,
        templateUrl: './view/approvalRestaurantController.html',
        controller: function($scope, $state, LoginService){
            LoginService.isLoggedIn($scope, function somethingChanged(event, data){
                $scope.isLoggedIn = data.isLoggedIn;
                $scope.jwtPayLoad = data.payload;
                if(!$scope.isLoggedIn || $scope.jwtPayLoad.role.indexOf('administrator') == -1 ){
                    $state.go(appPath.home.name, {});
                }
            });
        }
    })

    .state(appPath.login.name, {
        url: appPath.login.path,
        templateUrl: './view/loginController.html',
        controller: function($scope, $state, LoginService){
            LoginService.isLoggedIn($scope, function somethingChanged(event, data){
                $scope.isLoggedIn = data.isLoggedIn;
                if($scope.isLoggedIn){
                    $state.go(appPath.home.name, {});
                }
            });
        }
    })

    .state(appPath.reset.name, {
        url: appPath.reset.path,
        templateUrl: './view/resetLoginController.html',
        controller: function($scope, $state, LoginService){
            LoginService.isLoggedIn($scope, function somethingChanged(event, data){
                $scope.isLoggedIn = data.isLoggedIn;
                if($scope.isLoggedIn){
                    $state.go(appPath.home.name, {});
                }
            });
        }
    })

    .state(appPath.resetPassword.name, {
        url: appPath.resetPassword.path,
        templateUrl: './view/resetPasswordController.html',
        controller: function($scope, $rootScope, $state, $stateParams, JwtService, LoginService){
            LoginService.isLoggedIn($scope, function somethingChanged(event, data){
                $scope.isLoggedIn = data.isLoggedIn;
                if($scope.isLoggedIn){
                    $state.go(appPath.home.name, {});
                }else{
                    var token = $stateParams.token;
                    var jwt = JwtService.isValid(token);
                    if(jwt && jwt.reset){
                        LoginService.resetValid(token).then(function(){

                        }, function(response){
                            if(response.status == 401){
                                $rootScope.$broadcast('alerts', {type:'error', id:'resetValid', message:'Reset account link is not valid'});
                            }else if(response.status == 404){
                                $rootScope.$broadcast('alerts', {type:'error', id:'resetValid', message:'Reset account link is not valid'});
                            }else{
                                $rootScope.$broadcast('alerts', {type:'error', id:'resetValid', message:'Technical Error, please try again later'});
                            }
                            $state.go(appPath.login.name, {});
                        });
                    }else{
                        $rootScope.$broadcast('alerts', {type:'error', id:'resetValid', message:'Reset account link is not valid'});
                        $state.go(appPath.login.name, {});
                    }
                }
            });
        }
    })

    .state(appPath.activate.name, {
        url: appPath.activate.path,
        templateUrl: './view/searchController.html',
        controller: function($scope, $rootScope, $state, $stateParams, SignupService, JwtService, LoginService){
            LoginService.isLoggedIn($scope, function somethingChanged(event, data){
                $scope.isLoggedIn = data.isLoggedIn;
                if($scope.isLoggedIn){
                    $state.go(appPath.home.name, {});
                }else{
                    var token = $stateParams.token;
                    var jwt = JwtService.isValid(token);
                    if(jwt && token){
                        SignupService.activate(token)
                        .then(function(response){
                            $rootScope.$broadcast('alerts', {type:'info', id:'activate', message:'Account successfully activated'});
                            $state.go(appPath.home.name, {});
                        },function(response){
                            if(response.status == 409){
                                $rootScope.$broadcast('alerts', {type:'warn', id:'activate', message:'Your account have already activated'});
                            }else{
                                $rootScope.$broadcast('alerts', {type:'error', id:'activate', message:'There seems to be an issue with activation link'});
                            }
                            $state.go(appPath.home.name, {});
                        });
                    }else{ 
                        $state.go(appPath.home.name, {});
                        $rootScope.$broadcast('alerts', {type:'error', id:'resetValid', message:'Activate account link is not valid'});
                    }
                }
            });
        }
    })
    
    .state(appPath.restaurant.name, {
        url: appPath.restaurant.path,
        templateUrl: './view/restaurantController.html',
        controller: function($stateParams){
        }
    })

    .state(appPath.restaurantProfile.name, {
        url: appPath.restaurantProfile.path,
        templateUrl: './view/profileRestaurantController.html',
        controller: function($stateParams){
        }
    })

    .state(appPath.wishList.name, {
        url: appPath.wishList.path,
        templateUrl: './view/wishListController.html',
        controller: function($scope, $state, $stateParams, WishListService){
            var wishListTotal = 0;
            WishListService.getTotalList($scope, function(event, data){
                wishListTotal = data.total;
            });
            if(wishListTotal <= 0){
                $state.go(appPath.home.name, {});
            }
        }
    })

    .state(appPath.contactUs.name, {
        url: appPath.contactUs.path,
        templateUrl: './view/contactUsController.html',
        controller: function($scope, $state, $stateParams, WishListService){

        }
    })

    .state(appPath.myAccount.name, {
        url: appPath.myAccount.path,
        templateUrl: './view/myAccountController.html',
        controller: function($scope, $rootScope, $state, JwtService, MyAccountService, LoginService){
            LoginService.isLoggedIn($scope, function somethingChanged(event, data){
                var token = JwtService.getJwt();
                var jwt = JwtService.isValid(token);
                if(token && jwt){
                    MyAccountService.get(token)
                    .then(function(response){
                        $scope.myAccount = response.data.data.data[0];
                    },function(response){
                        if(response.status == 401){
                            $rootScope.$broadcast('alerts', {type:'error', id:'resetValid', message:'Unauthorised'});
                        }else if(response.status == 404){
                            $rootScope.$broadcast('alerts', {type:'error', id:'resetValid', message:'Token is required'});
                        }else{
                            $rootScope.$broadcast('alerts', {type:'error', id:'resetValid', message:'Technical Error, please try again later'});
                        }
                        $state.go(appPath.login.name, {});
                    });
                }else{
                    $state.go(appPath.home.name, {});
                }
            });
        }
    })

    .state(appPath.aboutUs.name, {
        url: appPath.aboutUs.path,
        templateUrl: './view/aboutUsController.html',
        controller: function($scope, $state, $stateParams, WishListService){

        }
    })

    .state(appPath.purchaseHistory.name, {
        url: appPath.purchaseHistory.path,
        templateUrl: './view/purchaseHistoryController.html',
        controller: function($scope, $state, $stateParams, LoginService){
            LoginService.isLoggedIn($scope, function somethingChanged(event, data){
                $scope.isLoggedIn = data.isLoggedIn;
                $scope.jwtPayLoad = data.payload;
                if(!$scope.jwtPayLoad && !$scope.isLoggedIn){
                    $state.go(appPath.home.name, {});
                }
            });
        }
    })

    .state(appPath.termsAndConditions.name, {
        url: appPath.termsAndConditions.path,
        templateUrl: './view/termsAndConditionsController.html',
        controller: function($scope, $state, $stateParams, WishListService, contactConfig){
            $scope.contactConfig = contactConfig;
        }
    })

    .state(appPath.privacyPolicy.name, {
        url: appPath.privacyPolicy.path,
        templateUrl: './view/privacyPolicyController.html',
        controller: function($scope, $state, $stateParams, WishListService, contactConfig){
            $scope.contactConfig = contactConfig;
        }
    });
  });