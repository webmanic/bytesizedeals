app.directive("btSubscribe", function(appConfig){
    return {
        templateUrl: appConfig.dir_directive + 'subscribe/subscribe.html',
        controller: function($scope, $rootScope, SubscribeService){

            $scope.showSubscribe = false;

            function validateEmail(email) {
                var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                return re.test(String(email).toLowerCase());
            }
        
            $scope.subscribe = {
                email:{
                    valid: undefined,
                    value: undefined,
                    focus: false
                }
            };
        
            $scope.fieldFocus = function(field){
                $scope.subscribe[field].focus = true;
            };
        
            $scope.fieldBlur = function(field){
                $scope.subscribe[field].focus = false;
            };

            $scope.validateEmail = function(){
                if(!validateEmail($scope.subscribe.email.value)){
                    $scope.subscribe.email.valid = false;
                    $scope.subscribe.email.error = 'email_not_valid';
                }else{
                    $scope.subscribe.email.valid = true;
                }
            };

            
            $scope.close = function(){
                $scope.showSubscribe = false;
            };


            var checkFormIsValid = function(){
                $scope.formIsValid = true;
                angular.forEach($scope.subscribe, function(value, key){
                    if(value.valid == undefined || value.valid == false){
                        $scope.formIsValid = false;
                    }
                });
            };

            var validateField = function(){
                $scope.validateEmail();
            };
        
            $scope.$watch("subscribe", function(){
                checkFormIsValid();
            }, true);

            $scope.subscribe_submit = function(form){
                validateField();
                if($scope.formIsValid){
                    SubscribeService.subscribe($scope.subscribe)
                    .then(function(response){
                        $scope.close();
                        $rootScope.$broadcast('alerts', {type:'info', id:'subscribe', message:'Thank you for subscribing'});
                    },function(response){
                        if(response.status == 400){
                            $rootScope.$broadcast('alerts', {type:'error', id:'subscribe', message:'Bad Request'});
                        }else if(response.status == 401){
                            $rootScope.$broadcast('alerts', {type:'warn', id:'subscribe', message:'You have already subscribed'});
                        }else{
                            $rootScope.$broadcast('alerts', {type:'error', id:'subscribe', message:'Technical Error, please try again later'});
                        }
                    });
                }
            };

            $rootScope.$on("showSubscribe", function(event, data){
                switch(data.type){
                    case "show":
                        $scope.showSubscribe = true;
                    break;
                    case "hide":
                        $scope.showSubscribe = false;
                    break;
                }
            });
        },
        link: function(scope, elm, attr){
        }
    };
});