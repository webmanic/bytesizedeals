app.directive("btShare", function(appConfig, appPath){
    return {
        templateUrl: appConfig.dir_directive + 'share/share.html',

        controller: function($scope, $rootScope, $transitions, $state, $location){

            var allowedPath = [appPath.home.name, appPath.restaurant.name];

            $scope.viewSubscribe = function(){
                $rootScope.$broadcast("showSubscribe",{type:"show"});
            };

            $transitions.onSuccess({}, function() {
                $scope.fullUrlPath = $location.absUrl();
                if(allowedPath.indexOf($state.current.name) >= 0){
                    $scope.show = true;
                }else{
                    $scope.show = false;
                }
            });
        },
        link: function(scope, elm, attr){

            $("#panel").hide();

            var toggle = false;

            scope.showPanel = function(){
                if(!toggle){
                    $("#panel").slideDown( "slow", function() {toggle=true;});
                }else{
                    $("#panel").slideUp( "slow", function() {toggle=false;});
                }
            };

            $('body').on('click', function (evt) {
                toggle = true;
                scope.showPanel();
            });

            $('#shares').click(function(e){
                e.stopPropagation();
            });
        }
    };
});