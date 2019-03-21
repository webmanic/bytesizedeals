app.controller("contactUsController", function($scope, $rootScope, ContactUsService){
    
    function validateEmail(email) {
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }

    $scope.contactUs = {
        subject:{
            valid: undefined,
            value: undefined,
            focus: false
        },
        email:{
            valid: undefined,
            value: undefined,
            focus: false
        },
        message:{
            valid: undefined,
            value: undefined,
            focus: false
        },
        type:{
            valid: undefined,
            value: undefined
        }
    };

    $scope.fieldFocus = function(field){
        $scope.contactUs[field].focus = true;
    };

    $scope.fieldBlur = function(field){
        $scope.contactUs[field].focus = false;
    };

    $scope.validateLength= function(field, length){
        $scope.contactUs[field].valid = false;
        var value = $scope.contactUs[field].value;
        if(value == undefined || value == '' || value.length <= length){
            $scope.contactUs[field].valid = false;
            $scope.contactUs[field].error = 'length';
            $scope.contactUs[field].length = length;
        }else{
            $scope.contactUs[field].error = '';
            $scope.contactUs[field].valid = true;
        }
    };

    $scope.validateEmail = function(){
        if(!validateEmail($scope.contactUs.email.value)){
            $scope.contactUs.email.valid = false;
            $scope.contactUs.email.error = 'email_not_valid';
        }else{
            $scope.contactUs.email.valid = true;
        }
    };

    $scope.validateType = function(){
        if($scope.contactUs.type.value == undefined){
            $scope.contactUs.type.valid = false;
            $scope.contactUs.type.error = 'type_not_selected';
        }
    };

    $scope.selected_type = function(type){
        $scope.contactUs.type.valid = true;
        $scope.contactUs.type.value = type;
    };

    var checkFormIsValid = function(){
        $scope.formIsValid = true;
        angular.forEach($scope.contactUs, function(value, key){
            if(value.valid == undefined || value.valid == false){
                $scope.formIsValid = false;
            }
        });
    };

    var validateField = function(){
        $scope.validateLength('subject', 5);
        $scope.validateLength('message', 5);
        $scope.validateEmail();
        $scope.validateType();
    };

    $scope.$watch("contactUs", function(){
        checkFormIsValid();
    }, true);

    $scope.contactUs_submit = function(form){
        $scope.loader = true;
        validateField();
        if($scope.formIsValid){
            ContactUsService.submit($scope.contactUs)
            .then(function(response){
                $scope.loader = false;
                $scope.showConfirm = true;
            },function(response){
                $scope.loader = false;
                if(response.status == 400){
                    $rootScope.$broadcast('alerts', {type:'error', id:'login', message:'Email Address Invalid'});
                }else{
                    $rootScope.$broadcast('alerts', {type:'error', id:'login', message:'Technical Error, please try again later'});
                }
            });
        }else{
            $scope.loader = false;
        }
    };
});