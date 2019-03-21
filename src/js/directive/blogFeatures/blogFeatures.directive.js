app.directive("btBlogFeatures", function(appConfig){
    return {
        scope: {
            blogList: '=',
            blog: '=',
            jwtPayLoad: '=',
            index: '='
        },
        templateUrl: appConfig.dir_directive + 'blogFeatures/blogFeatures.html',
        controller: function($scope, $rootScope, BlogService){

            $scope.delete = function(){
                BlogService.delete($scope.blog.restaurant_id, 
                                   $scope.blog.id, 
                                   $scope.blog.user_id,
                                   $scope.blog.token).then(function(response){
                
                    $rootScope.$broadcast('alerts', {type:'info', id:'blogDelete', message:'Review Successfully Deleted'});
                    $scope.blogList.splice($scope.index, 1);
                    if($scope.blogList.length == 0){
                        $scope.$emit('loadMoreComments', {pagerDecrease:true});
                    }
                    $scope.$emit("reviewUpdate",{rate:$scope.blog.rate, reviewIncrement:false});

                },function(response){
                    if(response.status == 401){
                        $rootScope.$broadcast('alerts', {type:'warn', id:'blogDelete', message:'Not Authorised'});
                    }else{
                        $rootScope.$broadcast('alerts', {type:'error', id:'blogDelete', message:'Technical Error, please try again later'});
                    }
                });
            };

            $scope.flagged = false;
            $scope.flag = function(){
                if(!$scope.flagged){
                    BlogService.flag($scope.blog.restaurant_id, 
                                    $scope.blog.id, 
                                    $scope.blog.user_id,
                                    $scope.blog.token).then(function(response){
                    
                        $rootScope.$broadcast('alerts', {type:'warn', id:'blogFlagged', message:'Thank you for reporting to us, we will review it.'});
                        $scope.flagged = true;

                    },function(response){
                        if(response.status == 401){
                            $rootScope.$broadcast('alerts', {type:'warn', id:'blogFlagged', message:'Not Authorised'});
                        }else{
                            $rootScope.$broadcast('alerts', {type:'error', id:'blogFlagged', message:'Technical Error, please try again later'});
                        }
                    });
                }
            };

        }
    };
});