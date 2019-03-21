app.directive("btBlogComment", function(appConfig){
    return {
        templateUrl: appConfig.dir_directive + 'blogComment/blogComment.html',
        scope: {
            blogList: '=',
            blog: '=',
            jwtPayLoad: '=',
            isLoggedIn: '=',
            index: '='
        },
        controller: function($scope, $rootScope, DatetimeService){

            $scope.timeSince = function(datetime){
                if(datetime){
                    var date = DatetimeService.formateDate(datetime, 'YYYY-MM-DD HH:mm:ss');
                    return timeago().format(date);
                }
            };

            $scope.trimUsername = function(username){
                if(username){
                    var usernameArr = username.split('');
                    return usernameArr[0] + usernameArr[1];
                }
            };
        }
    };
});