app.controller("resetLoginController", function($scope, $rootScope, LoginService){

    $scope.resetLoginConfirm = false;

    function validateEmail(email) {
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }

    $scope.reset = {
        username:{
            valid: undefined,
            value: undefined,
            focus: false
        }
    };

    $scope.validateEmail = function(){
        if(!validateEmail($scope.signup.email.value)){
            $scope.reset.username.valid = false;
            $scope.reset.username.error = 'email_not_valid';
        }else{
            $scope.reset.username.valid = true;
        }
    };

    $scope.validateLength = function(field, length){
        $scope.reset[field].valid = false;
        var value = $scope.reset[field].value;
        if(value == undefined || value == '' || value.length <= length){
            $scope.reset[field].valid = false;
            $scope.reset[field].error = 'length';
            $scope.reset[field].length = length;
        }else{
            $scope.reset[field].error = '';
            $scope.reset[field].valid = true;
        }
    };

    $scope.fieldFocus = function(field){
        $scope.reset[field].focus = true;
    };

    $scope.fieldBlur = function(field){
        $scope.reset[field].focus = false;
    };

    var checkFormIsValid = function(){
        $scope.formIsValid = true;
        angular.forEach($scope.reset, function(value, key){
            if(value.valid == undefined || value.valid == false){
                $scope.formIsValid = false;
            }
        });
    };

    var validateField = function(){
        $scope.validateLength('username', 5);
    };

    $scope.$watch("reset", function(){
        checkFormIsValid();
    }, true);

    $scope.reset_password_submit = function(reset, isResetLink){
        $scope.loader = true;
        validateField();
        if($scope.formIsValid){
            LoginService.reset($scope.reset)
            .then(function(response){
                $scope.loader = false;
                $scope.resetLoginConfirm = true;
                if(isResetLink){
                    $rootScope.$broadcast('alerts', {type:'info', id:'reset', message:'Reset account has been sent to your email'});
                }
            },function(response){
                $scope.loader = false;
                if(response.status == 404){
                    $rootScope.$broadcast('alerts', {type:'error', id:'reset', message:'Account not found...'});
                }else{
                    $rootScope.$broadcast('alerts', {type:'error', id:'reset', message:'Technical Error, please try again later'});
                }
            });
        }else{
            $scope.loader = false;
        }
    };
}); 