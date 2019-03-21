app.directive("btDiscountPanel", function(appConfig, LoginService, JwtService){
    return {
        scope:{
            restaurant: "="
        },
        templateUrl: appConfig.dir_directive + 'discountPanel/discountPanel.html',
        controller: function($scope){
            $scope.collapsed = false;
        },
        link: function(scope, elm, attr){

            new QRCode(document.getElementById("qrcode"), scope.restaurant.id + "-" + scope.restaurant.title + "-" + scope.restaurant.discount);

            $(elm[0].firstChild).hide();
            var busy = false;
            scope.showLocationPanel = function(){
                if(!busy){
                    busy = true;
                    $(elm[0].firstChild).slideToggle("slow", function() {
                        if(scope.collapsed){
                            scope.collapsed = false;
                        }else{
                            scope.collapsed = true;
                        }
                        busy = false;
                        scope.$apply();
                    });
                }
            };
        }
    };
});