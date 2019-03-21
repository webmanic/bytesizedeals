app.service("LoginService", LoginService);

function LoginService($rootScope, $httpParamSerializer, $http, appConfig, JwtService){

    var _priv = {
        login: function(login){

            var data = {
                username: login.username.value,
                password: login.password.value,
            };

            return $http({
                method: 'POST',
                url: appConfig.api_endpoint + '/login/',
                headers:{
                    'Content-Type' : 'application/x-www-form-urlencoded'
                },
                data: $httpParamSerializer(data)
            });
        },
        isLoggedIn: function(scope, callback){
            var payload = JwtService.decodejwt();
            var isLoggedIn = payload ? true : false;
            var handler = $rootScope.$on('notifying-loggedin-service-event', callback);
            scope.$on('$destroy', handler);
            $rootScope.$emit('notifying-loggedin-service-event', {payload:payload, isLoggedIn:isLoggedIn});
        },
        logout: function(){
            JwtService.removeJwt();
            $rootScope.$emit('notifying-loggedin-service-event', {payload:false, isLoggedIn:false});
        },
        notifyLogin: function(){
            var payload = JwtService.decodejwt();
            var isLoggedIn = payload ? true : false;
            $rootScope.$emit('notifying-loggedin-service-event',  {payload:payload, isLoggedIn:isLoggedIn});
        },
        reset: function(reset){

            var data = {
                username: reset.username.value
            };

            return $http({
                method: 'POST',
                url: appConfig.api_endpoint + '/login/reset/',
                headers:{
                    'Content-Type' : 'application/x-www-form-urlencoded'
                },
                data: $httpParamSerializer(data)
            });
        },
        resetValid: function(token){
            return $http({
                method: 'POST',
                url: appConfig.api_endpoint + '/login/reset/valid/',
                headers:{
                    'X-Token': token
                }
            });
        },
        resetPassword: function(resetPassword, token){

            var data = {
                password: resetPassword.password.value
            };

            return $http({
                method: 'POST',
                url: appConfig.api_endpoint + '/login/reset/password/',
                headers:{
                    'Content-Type' : 'application/x-www-form-urlencoded',
                    'X-Token': token
                },
                data: $httpParamSerializer(data)
            });
        }
    };

    return{
        login: _priv.login,
        logout: _priv.logout,
        reset: _priv.reset,
        resetValid: _priv.resetValid,
        resetPassword: _priv.resetPassword,
        isLoggedIn: _priv.isLoggedIn,
        notifyLogin: _priv.notifyLogin
    };
}