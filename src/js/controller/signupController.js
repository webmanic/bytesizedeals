app.controller("signupController", function($scope,$rootScope, SignupService, ValidationService, appPath){

    $scope.appPath = appPath;

    $scope.signup = {
        username:{
            valid: undefined,
            value: undefined,
            focus: false
        },
        password:{
            valid: undefined,
            value: undefined,
            focus: false
        },
        confirm_password:{
            valid: undefined,
            value: undefined,
            focus: false
        },
        email:{
            valid: undefined,
            value: undefined,
            focus: false
        },
        firstname:{
            valid: undefined,
            value: undefined,
            focus: false
        },
        lastname:{
            valid: undefined,
            value: undefined,
            focus: false
        },
        type:{
            valid: undefined,
            value: undefined
        },
        terms_and_conditions:{
            valid: undefined,
            value: undefined
        }
    };

    $scope.fieldFocus = function(field){
        $scope.signup[field].focus = true;
    };

    $scope.fieldBlur = function(field){
        $scope.signup[field].focus = false;
    };

    $scope.validateLength= function(field, length){
        $scope.signup[field].valid = false;
        var value = $scope.signup[field].value;
        if(value == undefined || value == '' || value.length <= length){
            $scope.signup[field].valid = false;
            $scope.signup[field].error = 'length';
            $scope.signup[field].length = length;
        }else{
            $scope.signup[field].error = '';
            $scope.signup[field].valid = true;
        }
    };

    $scope.validateConfirmPassword = function(bool){
        if(bool){
            if($scope.signup.confirm_password.value.length > 0 && $scope.signup.password.value == $scope.signup.confirm_password.value){
                $scope.signup.confirm_password.valid = true;
            }else{
                $scope.signup.confirm_password.valid = false;
            }
        }else{
            if($scope.signup.password.valid){
                if($scope.signup.password.value == $scope.signup.confirm_password.value){
                    $scope.signup.confirm_password.valid = true;
                }else{
                    $scope.signup.confirm_password.valid = false;
                }
            }
        }
    };

    $scope.validateEmail = function(){
        if(!ValidationService.validateEmail($scope.signup.email.value)){
            $scope.signup.email.valid = false;
            $scope.signup.email.error = 'email_not_valid';
        }else{
            $scope.signup.email.valid = true;
        }
    };

    $scope.validateType = function(){
        if($scope.signup.type.value == undefined){
            $scope.signup.type.valid = false;
            $scope.signup.type.error = 'type_not_selected';
        }
    };

    $scope.selected_type = function(type){
        $scope.signup.type.valid = true;
        $scope.signup.type.value = type;
    };
    
    $scope.validateTermsAndConditions = function(){
        if($scope.formIsValidWithoutTermsAndCondition){
            if($scope.signup.terms_and_conditions.value){
                $scope.signup.terms_and_conditions.valid = true;
            }else{
                $scope.signup.terms_and_conditions.valid = false;
            }
        }else{
            if(!$scope.signup.terms_and_conditions.value){
                $scope.signup.terms_and_conditions.valid = undefined;
            }
        }
    };

    var checkFormIsValid = function(){
        $scope.formIsValid = true;
        $scope.formIsValidWithoutTermsAndCondition = true;
        angular.forEach($scope.signup, function(value, key){
            if(value.valid == undefined || value.valid == false){
                $scope.formIsValid = false;
            }
            if((value.valid == undefined || value.valid == false) && key != 'terms_and_conditions'){
                $scope.formIsValidWithoutTermsAndCondition = false;
            }
        });
    };

    var validateField = function(){
        $scope.validateLength('username', 5);
        $scope.validateLength('password', 5);
        $scope.validateLength('firstname', 1);
        $scope.validateLength('lastname', 1);
        $scope.validateConfirmPassword(false);
        $scope.validateEmail();
        $scope.validateType();
        $scope.validateTermsAndConditions();
    };

    $scope.$watch("signup", function(){
        checkFormIsValid();
    }, true);

    $scope.signup_submit = function(form){
        $scope.loader = true;
        validateField();
        if($scope.formIsValid){
            SignupService.signup($scope.signup)
            .then(function(response){
                $scope.loader = false;
                $scope.signup_confirm = true;
            },function(response){
                $scope.loader = false;
                if(response.status == 409){
                    if(response.data.data.list.email){
                        $scope.signup.email.error = 'exists';
                        $scope.signup.email.valid = false;
                    }
                    if(response.data.data.list.username){
                        $scope.signup.username.error = 'exists';
                        $scope.signup.username.valid = false;
                    }
                }else{
                    $rootScope.$broadcast('alerts', {type:'error', id:'login', message:'Technical Error, please try again later'});
                }
            });
        }else{
            $scope.loader = false;
        }
    };

});