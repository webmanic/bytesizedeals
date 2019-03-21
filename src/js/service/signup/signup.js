app.service("SignupService", SignupService);

function SignupService($httpParamSerializer, $http, appConfig){

    var _priv = {
        signup: function(signup){

            var data = {
                username: signup.username.value,
                password: signup.password.value,
                email: signup.email.value,
                firstname: signup.firstname.value,
                lastname: signup.lastname.value,
                type: signup.type.value,
            };

            return $http({
                method: 'POST',
                url: appConfig.api_endpoint + '/signup/',
                headers:{
                    'Content-Type' : 'application/x-www-form-urlencoded'
                },
                data: $httpParamSerializer(data)
            });
        },
        activate: function(token){

            return $http({
                method: 'GET',
                url: appConfig.api_endpoint + '/signup/activate/',
                headers:{
                    'X-Token': token
                },
            });
        }
    };

    return{
        signup: _priv.signup,
        activate: _priv.activate
    };
}