app.service("RestaurantService", RestaurantService);

function RestaurantService($localStorage, $httpParamSerializer, $http, appConfig){

    var _priv = {
        list: function(search, geolocation, pageNo){

            var data = {
                search: search,
                pageNo: pageNo,
                latitude: geolocation ? geolocation.latitude: undefined,
                longitude: geolocation ? geolocation.longitude: undefined
            };

            return $http({
                method: 'GET',
                url: appConfig.api_endpoint + '/restaurant/list/',
                params: data
            });
        },

        approval: function(token, search, geolocation, pageNo, active){

            var data = {
                search: search,
                pageNo: pageNo,
                latitude: geolocation ? geolocation.latitude: undefined,
                longitude: geolocation ? geolocation.longitude: undefined,
                active: active
            };

            return $http({
                method: 'GET',
                url: appConfig.api_endpoint + '/restaurant/list/admin/',
                params: data,
                headers: {
                    'X-Token': token
                }
            });
        },

        approvalConfirm: function(token, active, restaurant){
            var data = {
                restaurant_id: restaurant.restaurant_id,
                restaurant_user_id: restaurant.user_id,
                restaurant_token: restaurant.restaurant_token,
                restaurant_active: restaurant.active,
                restaurant_end_date: restaurant.end_date,
                restaurant_token: restaurant.token,
                restaurant_extra_days: restaurant.extra_days,
                active: active
            };

            return $http({
                method: 'POST',
                url: appConfig.api_endpoint + '/restaurant/active/',
                data: $httpParamSerializer(data),
                headers: {
                    'Content-Type' : 'application/x-www-form-urlencoded',
                    'X-Token': token
                }
            });
        },

        signup: function(formData, token){

            return $http({
                method: 'POST',
                url: appConfig.api_endpoint + '/restaurant/signup/',
                data: formData,
                transformRequest: angular.identity,
                headers: {
                    'Content-Type': undefined,
                    'X-Token': token
                }
            });
        },

        update: function(formData, token){

            return $http({
                method: 'POST',
                url: appConfig.api_endpoint + '/restaurant/update/',
                data: formData,
                transformRequest: angular.identity,
                headers: {
                    'Content-Type': undefined,
                    'X-Token': token
                }
            });
        },

        restaurantId: function(id, geolocation){

            var latitude = 0;
            var longitude = 0;

            if(geolocation){
                latitude = geolocation.latitude;
                longitude = geolocation.longitude;
            }

            var data ={
                id: id,
                latitude: latitude,
                longitude: longitude
            };

            return $http({
                method: 'GET',
                url: appConfig.api_endpoint + '/restaurant/list/id/',
                params: data
            });
        },


        restaurantProfileId: function(id, geolocation, token){

            var latitude = 0;
            var longitude = 0;

            if(geolocation){
                latitude = geolocation.latitude;
                longitude = geolocation.longitude;
            }

            var data ={
                id: id,
                latitude: latitude,
                longitude: longitude
            };

            return $http({
                method: 'GET',
                url: appConfig.api_endpoint + '/restaurant/list/profile/',
                params: data,                
                headers: {
                    'Content-Type': undefined,
                    'X-Token': token
                }
            });
        },

        restaurantActive: function(token){
            return $http({
                method: 'POST',
                url: appConfig.api_endpoint + '/restaurant/list/active/',
                headers: {
                    'X-Token': token
                }
            });
        },

        restaurantUser: function(token){
            return $http({
                method: 'POST',
                url: appConfig.api_endpoint + '/restaurant/list/user/',
                headers: {
                    'X-Token': token
                }
            });
        },

        renew: function(restaurant_id, restaurant_token, extra_days, paymentData, token){

            var data ={
                restaurant_id: restaurant_id,
                restaurant_token: restaurant_token,
                data: JSON.stringify(paymentData),
                extra_days: extra_days
            };

            return $http({
                method: 'POST',
                url: appConfig.api_endpoint + '/restaurant/renew/',
                data: $httpParamSerializer(data),
                headers: {
                    'Content-Type' : 'application/x-www-form-urlencoded',
                    'X-Token': token
                }
            });
        }
    };

    return{
        list: _priv.list,
        signup: _priv.signup,
        update: _priv.update,
        restaurantId: _priv.restaurantId,
        restaurantActive: _priv.restaurantActive,
        restaurantUser: _priv.restaurantUser,
        restaurantProfileId: _priv.restaurantProfileId,
        approval: _priv.approval,
        approvalConfirm: _priv.approvalConfirm,
        renew: _priv.renew
    };
}