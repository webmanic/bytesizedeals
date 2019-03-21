app.service("MyAccountService", MyAccountService);

function MyAccountService($rootScope, $httpParamSerializer, $http, appConfig, JwtService){

    var _priv = {
        get: function(token){
            return $http({
                method: 'GET',
                url: appConfig.api_endpoint + '/myAccount/',
                headers: {
                    'X-Token': token
                }
            });
        }
    };

    return{
        get: _priv.get
    };
}