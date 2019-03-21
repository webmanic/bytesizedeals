app.service("WishListService", WishListService);

function WishListService($rootScope, $localStorage, appConfig){

    var _priv = {

        wishTotalList: function(){
            return $localStorage.restaurant ? Object.keys($localStorage.restaurant).length : 0;
        },

        getTotalList: function(scope, callback){
            var handler = $rootScope.$on('wishListService-service-event', callback);
            scope.$on('$destroy', handler);
            $rootScope.$emit('wishListService-service-event', {total:_priv.wishTotalList()});
        },

        add: function(restaurant){
            if(!$localStorage.restaurant){
                $localStorage.restaurant = {};
            }
            $localStorage.restaurant[restaurant.id] = restaurant;
            $rootScope.$emit('wishListService-service-event', {total:_priv.wishTotalList()});
        },

        remove: function(restaurant){
            delete $localStorage.restaurant[restaurant.id];
            $rootScope.$emit('wishListService-service-event', {total:_priv.wishTotalList()});
        },

        exists: function(restaurant){
            return $localStorage.restaurant && $localStorage.restaurant[restaurant.id] ? true: false;
        },

        getList: function(limit){
            var list = {};
            var count = 0;
            var i = 0;
            angular.forEach($localStorage.restaurant, function(value, key){
                count ++;
                if(!list[i]){
                    list[i] = [value];
                }else{
                    list[i].push(value);
                }
                if(count == limit){
                    i ++;
                    count = 0;
                }
            });
            return list;
        }
    };

    return{
        add: _priv.add,
        remove: _priv.remove,
        exists: _priv.exists,
        getTotalList: _priv.getTotalList,
        getList: _priv.getList
    };
}