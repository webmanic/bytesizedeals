app.directive("btLogin", function(appConfig, appPath, LoginService, JwtService){
    return {
        templateUrl: appConfig.dir_directive + 'login/login.html',
        controller: function($scope, $rootScope, $state){

            $scope.login ={
                username:{
                    value: undefined
                },
                password:{
                    value: undefined
                }
            };
        
            $scope.login_submit = function(event, form){
                event.preventDefault();
                $scope.loader = true;
                if(($scope.login.username.value && $scope.login.username.value.length > 0) && 
                   ($scope.login.password.value && $scope.login.password.value.length > 0)){
                    LoginService.login($scope.login)
                    .then(function(response){
                        if(response.data.data.token){
                            $scope.loader = false;
                            JwtService.setJwt(response.data.data.token);
                            $state.go(appPath.home.name, {});
                            LoginService.notifyLogin();
                        }
                    },function(response){
                        $scope.loader = false;
                        if(response.status == 401){
                            $rootScope.$broadcast('alerts', {type:'error', id:'login', message:'Incorrect Login'});
                        }else{
                            $rootScope.$broadcast('alerts', {type:'error', id:'login', message:'Technical Error, please try again later'});
                        }
                        LoginService.logout();
                    });
                }else{
                    $scope.loader = false;
                    $rootScope.$broadcast('alerts', {type:'error', message:'Incorrect Login'});
                }
            };
        }
    };
});