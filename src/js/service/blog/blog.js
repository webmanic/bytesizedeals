app.service("BlogService", BlogService);

function BlogService($http, $httpParamSerializer, appConfig, JwtService){

    var _priv = {

        list: function(restaurant_id, pageNo){

            var data ={
                restaurant_id: restaurant_id,
                pageNo: pageNo
            };

            return $http({
                method: 'GET',
                url: appConfig.api_endpoint + '/blog/list/',
                params: data
            });
        },

        comment: function(restaurant_id, comment, rate, token){

            var data ={
                restaurant_id: restaurant_id,
                comment: comment,
                rate: rate
            };

            return $http({
                method: 'POST',
                url: appConfig.api_endpoint + '/blog/comment/',
                headers:{
                    'Content-Type' : 'application/x-www-form-urlencoded',
                    'X-Token': token
                },
                data: $httpParamSerializer(data)
            });
        },

        delete: function(restaurant_id, blog_id, blog_user_id, blog_token){

            var token = JwtService.getJwt();

            var data ={
                restaurant_id: restaurant_id,
                blog_id: blog_id,
                blog_user_id: blog_user_id,
                blog_token: blog_token
            };

            return $http({
                method: 'POST',
                url: appConfig.api_endpoint + '/blog/comment/delete/',
                headers:{
                    'Content-Type' : 'application/x-www-form-urlencoded',
                    'X-Token': token
                },
                data: $httpParamSerializer(data)
            });
        },


        flag: function(restaurant_id, blog_id, blog_user_id, blog_token){

            var token = JwtService.getJwt();

            var data ={
                restaurant_id: restaurant_id,
                blog_id: blog_id,
                blog_user_id: blog_user_id,
                blog_token: blog_token
            };

            return $http({
                method: 'POST',
                url: appConfig.api_endpoint + '/blog/comment/flag/',
                headers:{
                    'Content-Type' : 'application/x-www-form-urlencoded',
                    'X-Token': token
                },
                data: $httpParamSerializer(data)
            });
        }

    };

    return{
        list: _priv.list,
        comment: _priv.comment,
        delete: _priv.delete,
        flag: _priv.flag
    };
}