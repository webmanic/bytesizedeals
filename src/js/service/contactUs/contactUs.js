app.service("ContactUsService", ContactUsService);

function ContactUsService($rootScope, $httpParamSerializer, $http, appConfig, JwtService){

    var _priv = {
        submit: function(contactus){

            var data = {
                subject: contactus.subject.value,
                email: contactus.email.value,
                message: contactus.message.value,
                type: contactus.type.value
            };

            return $http({
                method: 'POST',
                url: appConfig.api_endpoint + '/contactus/',
                headers:{
                    'Content-Type' : 'application/x-www-form-urlencoded'
                },
                data: $httpParamSerializer(data)
            });
        }
    };

    return{
        submit: _priv.submit
    };
}