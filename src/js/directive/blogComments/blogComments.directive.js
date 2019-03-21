app.directive("btBlogComments", function(appConfig){
    return {
        scope: {
            blogList: '=',
            rowNo: '=',
            pageNo: '=',
            loadMore: '&',
            isLoggedIn: '=',
            jwtPayLoad: '=',
            loaderBlog: '='
        },
        templateUrl: appConfig.dir_directive + 'blogComments/blogComments.html',
        controller: function($scope){

        }
    };
});