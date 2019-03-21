app.service("PurchaseService", PurchaseService);

function PurchaseService($rootScope, $httpParamSerializer, $http, appConfig, JwtService){

    var _priv = {

        getListUser: function(token){
            return $http({
                method: 'GET',
                url: appConfig.api_endpoint + '/purchase/list/',
                headers: {
                    'X-Token': token
                }
            });
        },

        paid: function(id, payment_id, payment_token, paid, token){

            var data ={
                id: id,
                payment_id: payment_id,
                token: payment_token,
                paid: paid
            };

            return $http({
                method: 'POST',
                url: appConfig.api_endpoint + '/purchase/paid/',
                data: $httpParamSerializer(data),
                headers: {
                    'Content-Type' : 'application/x-www-form-urlencoded',
                    'X-Token': token
                }
            });
        }
    };

    return{
        getListUser: _priv.getListUser,
        paid: _priv.paid
    };
}