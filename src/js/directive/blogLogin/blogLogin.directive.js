app.directive("btBlogLogin", function(appConfig){
    return {
        templateUrl: appConfig.dir_directive + 'blogLogin/blogLogin.html',
        controller: function($scope, $rootScope, $transitions, $state, LoginService, JwtService){

            $scope.blogLogin ={
                username:{
                    value: undefined
                },
                password:{
                    value: undefined
                }
            };
        
            $scope.blog_login_submit = function(event, form){
                event.preventDefault();
                $scope.loader = true;
                if(($scope.blogLogin.username.value && $scope.blogLogin.username.value.length > 0) && 
                   ($scope.blogLogin.password.value && $scope.blogLogin.password.value.length > 0)){
                    LoginService.login($scope.blogLogin)
                    .then(function(response){
                        if(response.data.data.token){
                            JwtService.setJwt(response.data.data.token);
                            LoginService.notifyLogin();
                        }
                        $scope.loader = false;
                    },function(response){
                        if(response.status == 401){
                            $rootScope.$broadcast('alerts', {type:'error', id:'login', message:'Incorrect Login'});
                        }else{
                            $rootScope.$broadcast('alerts', {type:'error', id:'login', message:'Technical Error, please try again later'});
                        }
                        $scope.loader = false;
                    });
                }else{
                    $rootScope.$broadcast('alerts', {type:'error', message:'Incorrect Login'});
                    $scope.loader = false;
                }
            };
        }
    };
});