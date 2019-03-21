app.service("JwtService", JwtService);

function JwtService(appConfig, $localStorage, jwtHelper){

    var _priv = {
        setJwt: function(token){
            $localStorage.token = token;
        },
        getJwt: function(){
            return $localStorage.token;
        },
        decodejwt: function(){
            try{
                var jwt = jwtHelper.decodeToken($localStorage.token);
                if(jwt){
                    return jwt;
                }else{
                    return false;
                }
            }catch(error){
                return false;
            }
        },
        removeJwt: function(){
            delete $localStorage.token;
        },
        isValid: function(token){
            try{
                var jwt = jwtHelper.decodeToken(token);
                if(jwt){
                    return jwt;
                }else{
                    return false;
                }
            }catch(error){
                return false;
            }
        }
    };

    return{
        setJwt: _priv.setJwt,
        getJwt: _priv.getJwt,
        isValid: _priv.isValid,
        decodejwt: _priv.decodejwt,
        removeJwt: _priv.removeJwt
    };
}