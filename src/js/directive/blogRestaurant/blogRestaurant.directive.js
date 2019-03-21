app.directive("btBlogRestaurant", function(appConfig){
    return {
        scope:{
            restaurantId: "="
        },
        templateUrl: appConfig.dir_directive + 'blogRestaurant/blogRestaurant.html',
        controller: function($scope, $rootScope, $transitions, $state, BlogService, JwtService, LoginService){

            $scope.showLogin = false;
            $scope.pageNo = 0;
            $scope.rowNo = 0;
            $scope.blogList = [];
            $scope.rate = appConfig.rate;
            $scope.toolbar = ['bold', 'italic', 'underline', 'strikethrough', '|'];
            $scope.allowedTags = ['b', 'br', 'strong', 'i', 'u', 'font'];
            $scope.appConfig = appConfig;

            $scope.blog = {
                blog:{
                    valid: undefined,
                    value: undefined
                }
            }

            var loadBlog = function(pageNo){
                $scope.loaderBlog = true;
                BlogService.list($scope.restaurantId, pageNo).then(function(response){
                    $scope.blogList = $scope.blogList.concat(response.data.data.data);
                    $scope.rowNo = response.data.data.rowNo;
                    $scope.pageNo ++;
                    $scope.loaderBlog = false;
                }, function(response){
                    if(response.status == 404){
                        //$rootScope.$broadcast('alerts', {type:'warning', id:'blog', message:'Blog review not found'});
                    }else{
                        $rootScope.$broadcast('alerts', {type:'error', id:'blog', message:'Technical Error, please try again later'});
                    }
                    $scope.loaderBlog = false;
                });
            };

            loadBlog($scope.pageNo);

            $scope.loadMore = function(){
                loadBlog($scope.pageNo);
            };

            $scope.getRate = function(rate){
                $scope.rate = rate;
            };

            $scope.blog_comment = function(event){
                if($scope.blog.blog.valid){
                    BlogService.comment($scope.restaurantId, $scope.blog.blog.value, $scope.rate, JwtService.getJwt()).then(function(){
                        $rootScope.$broadcast('alerts', {type:'info', id:'comment', message:'You comment has been posted'});
                        $scope.blogList = [];
                        $scope.pageNo = 0;
                        loadBlog($scope.pageNo);
                        $("#blog_review").text('');
                        $("#blog_review").click();
                        $scope.$emit("reviewUpdate",{rate:$scope.rate, reviewIncrement:true});
                    }, function(response){
                        if(response.status == 401){
                            $rootScope.$broadcast('alerts', {type:'warn', id:'blog_comment', message:'You are not allowed to comment'});
                        }else{
                            $rootScope.$broadcast('alerts', {type:'error', id:'blog_comment', message:'Technical Error, please try again later'});
                        }
                    });
                }
            };

            $scope.showBlogLogin = function(event){
                event.preventDefault(); 
                $scope.showLogin = true;
            };

            LoginService.isLoggedIn($scope, function somethingChanged(event, data){
                $scope.jwtPayLoad = data.payload;
                $scope.isLoggedIn = data.isLoggedIn;
                if($scope.isLoggedIn){
                    $scope.showLogin = false;
                }
            });

            $scope.$on('loadMoreComments', function(event, data){
                if(data.pagerDecrease){
                    $scope.pageNo --;
                }
                $scope.loadMore();
            });

            $scope.validateLength= function(field, length, fieldValue){
                $scope.blog[field].valid = false;
                var value = $scope.blog[field].value;
                if(field == 'blog'){
                    value = fieldValue;
                }
                if(value == undefined || value == '' || value.length <= length){
                    $scope.blog[field].valid = false;
                    $scope.blog[field].error = 'length';
                    $scope.blog[field].length = length;
                }else{
                    $scope.blog[field].error = '';
                    $scope.blog[field].valid = true;
                }
            };

            $scope.fieldFocus = function(field){
                $scope.blog[field].focus = true;
            };
        
            $scope.fieldBlur = function(field){
                $scope.blog[field].focus = false;
            };
        }
    };
});