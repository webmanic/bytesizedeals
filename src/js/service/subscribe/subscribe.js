app.service("SubscribeService", SubscribeService);

function SubscribeService($httpParamSerializer, $http, appConfig){

    var _priv = {
        subscribe: function(subscribe){

            var data = {
                email: subscribe.email.value,
            };

            return $http({
                method: 'POST',
                url: appConfig.api_endpoint + '/subscribe/',
                headers:{
                    'Content-Type' : 'application/x-www-form-urlencoded'
                },
                data: $httpParamSerializer(data)
            });
        }
    };
    return {
        subscribe: _priv.subscribe
    };
}