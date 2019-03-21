app.controller("resetPasswordController", function($scope,$rootScope,$state,$stateParams,LoginService,JwtService,appPath){
    
    $scope.resetPassword = {
        password:{
            valid: undefined,
            value: undefined,
            focus: false
        },
        confirm_password:{
            valid: undefined,
            value: undefined,
            focus: false
        }
    };

    $scope.fieldFocus = function(field){
        $scope.resetPassword[field].focus = true;
    };

    $scope.fieldBlur = function(field){
        $scope.resetPassword[field].focus = false;
    };

    $scope.validateLength= function(field, length){
        $scope.resetPassword[field].valid = false;
        var value = $scope.resetPassword[field].value;
        if(value == undefined || value == '' || value.length <= length){
            $scope.resetPassword[field].valid = false;
            $scope.resetPassword[field].error = 'length';
            $scope.resetPassword[field].length = length;
        }else{
            $scope.resetPassword[field].error = '';
            $scope.resetPassword[field].valid = true;
        }
    };

    $scope.validateConfirmPassword = function(bool){
        if(bool){
            if($scope.resetPassword.confirm_password.value.length > 0 && $scope.resetPassword.password.value == $scope.resetPassword.confirm_password.value){
                $scope.resetPassword.confirm_password.valid = true;
            }else{
                $scope.resetPassword.confirm_password.valid = false;
            }
        }else{
            if($scope.resetPassword.password.valid){
                if($scope.resetPassword.password.value == $scope.resetPassword.confirm_password.value){
                    $scope.resetPassword.confirm_password.valid = true;
                }else{
                    $scope.resetPassword.confirm_password.valid = false;
                }
            }
        }
    };

    var checkFormIsValid = function(){
        $scope.formIsValid = true;
        angular.forEach($scope.resetPassword, function(value, key){
            if(value.valid == undefined || value.valid == false){
                $scope.formIsValid = false;
            }
        });
    };

    var validateField = function(){
        $scope.validateLength('password', 5);
        $scope.validateConfirmPassword(false);
    };

    $scope.$watch("resetPassword", function(){
        checkFormIsValid();
    }, true);

    $scope.reset_password_submit = function(form){

        $scope.loader = true;

        validateField();

        if($scope.formIsValid){

            var token = $stateParams.token;

            LoginService.resetPassword($scope.resetPassword, token)
            .then(function(response){
                $scope.loader = false;
                if(response.data.data.token){
                    JwtService.setJwt(response.data.data.token);
                    $state.go(appPath.home.name, {});
                    $rootScope.$broadcast('alerts', {type:'info', id:'reset', message:'Your password has been reset successfully'});
                }
            },function(response){
                $scope.loader = false;
                if(response.status == 401){
                    $rootScope.$broadcast('alerts', {type:'error', id:'reset', message:'Reset account link is not valid'});
                }else if(response.status == 404){
                    $rootScope.$broadcast('alerts', {type:'error', id:'reset', message:'Reset account link is not valid'});
                }else{
                    $rootScope.$broadcast('alerts', {type:'error', id:'reset', message:'Technical Error, please try again later'});
                }
            });
        }else{
            $scope.loader = false;
        }
    };

});