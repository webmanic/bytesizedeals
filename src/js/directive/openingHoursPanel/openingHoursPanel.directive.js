app.directive("btOpeningHoursPanel", function(appConfig, LoginService, JwtService){
    return {
        scope:{
            restaurant: "="
        },
        templateUrl: appConfig.dir_directive + 'openingHoursPanel/openingHoursPanel.html',
        controller: function($scope){
            $scope.collapsed = false;
            $scope.dayLong = moment().format('dddd').toLowerCase();
        },
        link: function(scope, elm, attr){
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