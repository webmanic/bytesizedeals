app.directive("btAlerts", function(appConfig){
    return {
        scope: {
        },
        templateUrl: appConfig.dir_directive + 'alerts/alerts.html',
        controller: function($scope, $state, $rootScope, $sce, $transitions, appPath){

            $scope.alerts = {};

            $rootScope.$on("alerts", function(event, data){
                switch(data.type){
                    case "info":
                        $scope.alerts[data.id] = {message:data.message, class:'info', id:data.id};
                    break;
                    case "warn":
                        $scope.alerts[data.id] = {message:data.message, class:'warn', id:data.id};
                    break;
                    case "error":
                        $scope.alerts[data.id] = {message:data.message, class:'error', id:data.id};
                    break;
                    case "clear":
                        delete $scope.alerts[data.id];
                    break;
                }
            });

            $scope.close = function(id){
                delete $scope.alerts[id];
            };

            $scope.trustAsHtmlFun = function(text){
                return $sce.trustAsHtml(text);
            };

            $scope.navigateRestaurantProfile = function(event, id){
                event.preventDefault();
                $state.go(appPath.restaurantUpdate.name, {});
                $scope.close(id);
            };
            
        }
    };
});