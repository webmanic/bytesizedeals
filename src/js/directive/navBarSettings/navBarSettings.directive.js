app.directive("btNavBarSettings", function(appConfig){
    return {
        templateUrl: appConfig.dir_directive + 'navBarSettings/navBarSettings.html',
        scope:{
            wishListCount: '=',
            jwtPayLoad: '=',
            restaurantId: '=',
            restaurantSignup: '='
        },
        controller: function($scope, appPath){
            $scope.appPath = appPath;
        },
        link: function(scope, elm, attr){

            $(".sub_menu").hide();

            var toggle = false;

            scope.settings = function(){
                if(!toggle){
                    $("#sub_menu .sub_menu").slideDown( "slow", function() {toggle=true;});
                }else{
                    $("#sub_menu .sub_menu").slideUp( "slow", function() {toggle=false;});
                }
            };

            $('body').on('click', function (evt) {
                toggle = true;
                scope.settings();
            });

            $('#sub_menu').click(function(e){
                e.stopPropagation();
            });

            $('#sub_menu .sub_menu a').click(function(e){
                toggle = true;
                scope.settings();
            });
        }
    };
});