app.controller("signupRestaurantController", function($scope, $rootScope, RestaurantService, CountryService, JwtService, ValidationService, FileService, appConfig, categories){

    var x = 0;
    var galleries = {};

    var formData = new FormData();

    $scope.appConfig = appConfig;

    $scope.categories = categories;

    $scope.signup = {
        title:{
            valid: undefined,
            value: undefined,
            focus: false
        },
        description:{
            valid: undefined,
            value: undefined,
            focus: false
        },
        discount:{
            valid: true,
            value: undefined,
            focus: false
        },
        link:{
            valid: true,
            value: undefined,
            focus: false
        },
        logo:{
            valid: undefined,
            value: undefined,
            focus: false,
            error:{
                message: undefined,
                reason: undefined
            }
        },
        gallery:{
            valid: undefined,
            value: {},
            focus: false,
            error:{
                message: undefined,
                reason: undefined
            }
        },
        telephone_no:{
            valid: undefined,
            value: undefined,
            focus: false
        },
        mobile_no:{
            valid: true,
            value: undefined,
            focus: true
        },
        address_line1:{
            valid: undefined,
            value: undefined,
            focus: false
        },
        address_line2:{
            valid: true,
            value: undefined,
            focus: false
        },
        address_line3:{
            valid: true,
            value: undefined,
            focus: false
        },
        city:{
            valid: undefined,
            value: undefined,
            focus: false
        },
        county:{
            valid: undefined,
            value: undefined,
            focus: false
        },
        postcode:{
            valid: undefined,
            value: undefined,
            focus: false
        },
        country:{
            valid: undefined,
            value: undefined,
            focus: false
        },
        categories:{
            valid: undefined,
            list: [],
            value:undefined
        },
        profile_visible:{
            value: true,
            valid: true
        },
        opening_hours: {
            monday:{
                from: {
                    hour: "",
                    minute: ""
                },
                to: {
                    hour: "",
                    minute: ""                
                },
                closed: false
            },
            tuesday:{
                from: {
                    hour: "",
                    minute: ""
                },
                to: {
                    hour: "",
                    minute: ""                
                },
                closed: false
            },
            wednesday:{
                from: {
                    hour: "",
                    minute: ""
                },
                to: {
                    hour: "",
                    minute: ""                
                },
                closed: false
            },
            thursday:{
                from: {
                    hour: "",
                    minute: ""
                },
                to: {
                    hour: "",
                    minute: ""                
                },
                closed: false
            },
            friday:{
                from: {
                    hour: "",
                    minute: ""
                },
                to: {
                    hour: "",
                    minute: ""                
                },
                closed: false
            },
            saturday:{
                from: {
                    hour: "",
                    minute: ""
                },
                to: {
                    hour: "",
                    minute: ""                
                },
                closed: false
            },
            sunday: {
                from: {
                    hour: "",
                    minute: ""
                },
                to: {
                    hour: "",
                    minute: ""                
                },
                closed: false            
            }
        },
        terms_and_conditions:{
            valid: undefined,
            value: undefined
        }
    };

    $scope.cropped = {
        source: ''
    };

    $scope.cropOption = {
        viewport: {
            width: 339.5,
            height: 200,
        },
        boundary: {
            height: 300
        }
    }

    $scope.imageSize = {
        width: $scope.appConfig.image_size.width,
        height: $scope.appConfig.image_size.height
    }

    RestaurantService.restaurantActive(JwtService.getJwt()).then(function(response){
        if(response.data.data.data.active == 0){
            $scope.signed_confirm = true;
            $rootScope.$broadcast('alerts', {type:'warn', id:'signupRestaurant', message:'You have already signed up waiting for the approval'});
        }
    }, function(){});

    $scope.fieldFocus = function(field){
        $scope.signup[field].focus = true;
    };

    $scope.fieldBlur = function(field){
        $scope.signup[field].focus = false;
    };

    $scope.validateLength= function(field, length, fieldValue){
        $scope.signup[field].valid = false;
        var value = $scope.signup[field].value;
        if(field == 'description'){
            value = fieldValue;
        }
        if(value == undefined || value == '' || value.length <= length){
            $scope.signup[field].valid = false;
            $scope.signup[field].error = 'length';
            $scope.signup[field].length = length;
        }else{
            $scope.signup[field].error = '';
            $scope.signup[field].valid = true;
        }
    };

    $scope.validateImage = function(){
        if(!$scope.signup.logo.value){
            $scope.signup.logo.valid = false;
            $scope.signup.logo.error.message = 'empty';
        }
    };

    $scope.validateNumber = function(field, check){
        var number = $scope.signup[field].value;
        if(!ValidationService.validateNumber(number)){
            if(field != "mobile_no"){
                $scope.signup[field].valid = false;
                $scope.signup[field].error = 'number_not_valid';
                if(!check && $scope.signup[field].value && $scope.signup[field].value.length == 0){
                    $scope.signup[field].valid = true;
                    $scope.signup[field].error = '';
                }
            }else if(field == "mobile_no" && $scope.signup[field].value.length > 0){
                $scope.signup[field].valid = false;
                $scope.signup[field].error = 'number_not_valid';
                if(!check && $scope.signup[field].value && $scope.signup[field].value.length == 0){
                    $scope.signup[field].valid = true;
                    $scope.signup[field].error = '';
                }
            }else if(field == "mobile_no" && $scope.signup[field].value.length == 0){
                $scope.signup[field].valid = true;
                $scope.signup[field].error = '';
            }
        }else{
            $scope.signup[field].valid = true;
        }
    };

    $scope.validateUrl = function(){
        var link = $scope.signup.link;
        if(link.value.length > 0){ 
            $scope.signup.link.valid = ValidationService.isURL(link.value);
            $scope.signup.link.error = 'invalid';
        }else{
            $scope.signup.link.valid = true;
        }
    };

    $scope.validateDiscount = function(){
        var discount = $scope.signup.discount;
        if(discount.value.length > 0){
            $scope.signup.discount.valid = true
            $scope.signup.discount.error = 'invalid';
        }else{
            $scope.signup.link.valid = true;
        }
    };

    $scope.countries = CountryService.list();
    $scope.signup.country.value = 'United Kingdom';
    $scope.signup.country.valid = true;


    var checkFormIsValid = function(){
        $scope.formIsValid = true;
        $scope.formIsValidWithoutTermsAndCondition = true;
        angular.forEach($scope.signup, function(value, key){
            if((value.valid == undefined || value.valid == false) && key != 'gallery' && key != 'opening_hours'){
                $scope.formIsValid = false;
            }
            if((value.valid == undefined || value.valid == false) && key != 'gallery' && key != 'opening_hours' && key != 'terms_and_conditions'){
                $scope.formIsValidWithoutTermsAndCondition = false;
            }
        });
    };

    $scope.$watch("signup", function(){
        checkFormIsValid();
    }, true);


    // Assign blob to component when selecting a image
    $scope.imageLoaded = function (elm) {
        var reader = new FileReader();
        reader.onload = function (e) {
            // bind new Image to Component
            $scope.$apply(function () {
                $scope.cropped.source = e.target.result;
                $scope.signup.logo.value = {name: elm.files[0].name};
            });
        }
        reader.readAsDataURL(elm.files[0]);
    };
    
    $scope.$watch('cropped.image', function(){
        formData.delete("logo");
        getImageHeightWidth($scope.cropped.image, function(data){
            if(data.width == 679 && data.height == 400){
                $scope.signup.logo.valid = true;
                formData.append('logo',  FileService.imageBase64ToBlob($scope.cropped.image), $scope.signup.logo.value.name);  
            }else{
                $scope.signup.logo.valid = false;
                $scope.signup.logo.error.message = 'invalid';
                $scope.signup.logo.error.reason = {height:$scope.appConfig.image_size.height, 
                                                   width:$scope.appConfig.image_size.width};
            }
            $scope.$apply();
        });
    });

    function getImageHeightWidth(imageData, callback){
        var i = new Image(); 
        i.onload = function(){
            callback(i);
        };
        i.src = imageData; 
    }

    $scope.galleryLoaded = function(elm){

        var filesAmount = elm.files.length;

        for (i = 0; i < filesAmount; i++) {

            (function(i) {

                setTimeout(function () { 

                    var dataFile = elm.files[i];

                    var reader = new FileReader();

                    reader.onloadend = function() {
                        $scope.$apply(function(){
                            $scope.dataFile = reader.result;
                            $scope.signup.gallery.valid = true;
                            $scope.signup.gallery.value[x] = 
                            {
                                img:$scope.dataFile, 
                                name: elm.files[i].name,
                                size: (elm.files[i].size / Math.pow(1024,2)).toFixed(2), 
                                index:x
                            };
                            galleries[x] = elm.files[i];
                            if(i == filesAmount - 1){
                                addFormGallery();
                            }
                        });
                        x ++;
                    };

                    reader.readAsDataURL(dataFile);

                }, 1 * i);

            })(i);
        }
    };

    $scope.validateGalleryImage = function(){
        if($scope.galleryCount > appConfig.max_gallery_upload){
            $rootScope.$broadcast('alerts', {type:'error', id:'signupRestaurant', message:'Maximum upload up to 5'});
            $scope.signup.gallery.valid = false;
            $scope.signup.gallery.error.message = 'max';
            return true;
        }else if($scope.galleryCount > 0 && $scope.fileSize){
            $rootScope.$broadcast('alerts', {type:'error', id:'signupRestaurant', message:'Gallery image size too big'});
            $scope.signup.gallery.valid = false;
            $scope.signup.gallery.error.message = 'big';
        }
        else{
            $scope.signup.gallery.valid = true;
        }
        return false;
    };

    $scope.removeGallery = function(index){
        delete $scope.signup.gallery.value[index];
        delete galleries[index];
        addFormGallery();
    };

    $scope.galleryCount = 0;

    function addFormGallery(){

        formData.delete("gallery[]");

        $scope.galleryCount = Object.keys(galleries).length;

        if(!$scope.validateGalleryImage()){
            
            $scope.fileSize = false;
            angular.forEach(galleries, function(value, key){
                if((value.size / Math.pow(1024,2)).toFixed(2) > 1){
                    $scope.fileSize = true;
                }
                formData.append('gallery[]', value); 
            });
        }
        $scope.validateGalleryImage();
    }

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

    var validateField = function(){
        $scope.validateLength('title', 1);
        $scope.validateLength('address_line1', 5);
        $scope.validateLength('city', 5);
        $scope.validateLength('county', 5);
        $scope.validateLength('postcode', 5);
        $scope.validateImage();
        $scope.validateGalleryImage();
        $scope.validateNumber('telephone_no');
        $scope.validateTermsAndConditions();
        if($scope.signup.categories.list.length > 0){
            $scope.signup.categories.valid = true;
            $scope.signup.categories.error = '';
        }else{
            $scope.signup.categories.valid = false;
            $scope.signup.categories.error = 'length';
        }
    };

    function signup_submit(data){
        $scope.loader = true;
        validateField();
        if($scope.formIsValid){

            angular.forEach($scope.signup, function(data, key){
                if((key != 'logo' && key != 'gallery' && key != 'opening_hours') && (data.value || data.value == false)){
                    formData.append(key, data.value);
                }else if(key == 'opening_hours' ){
                    formData.append(key, JSON.stringify(data));
                }else if((key != 'logo' && key != 'gallery' && key != 'opening_hours') && data.value == undefined){
                    formData.append(key, '');
                }
            });

            formData.append('data', JSON.stringify(data));

            RestaurantService.signup(formData, JwtService.getJwt())
            .then(function(response){
                $scope.loader = false;
                $scope.signup_confirm = true;
            },function(response){
                $scope.loader = false;
                if(response.status == 400 && response.data.data.message == 'Invalid Image'){
                    $scope.signup.logo.valid = false;
                    $scope.signup.logo.error.message = 'invalid';
                    $scope.signup.logo.error.reason = {height:response.data.data.height, 
                                                        width:response.data.data.width};
                }else if(response.status == 409 && response.data.data.message == 'Already signed up'){
                    $rootScope.$broadcast('alerts', {type:'warn', id:'signupRestaurant', message:'You have already signed up waiting for the approval'});
                }else{
                    $rootScope.$broadcast('alerts', {type:'error', id:'signupRestaurant', message:'Technical Error, please try again later'});
                }
            });
        }else{
            $scope.loader = false;
        }
    }

    $rootScope.$on("paypalEvent", function(event, data){
        switch(data.payment){
            case "SUCCESS":
                data.response.type = 'paypal';
                signup_submit(data.response);
            break;
            case "FORMVALIDATION":
                validateField();
            break;
            case "CASH":
                data.response.type = 'cash';
                signup_submit(data.response);
            break;
        }
    });




});