app.controller("updateRestaurantController", function($scope, $rootScope, $state, $sce, RestaurantService, CountryService, JwtService, ValidationService, FileService, appConfig, appPath, categories){

    var x = 0;
    var galleries = {};

    var formData = new FormData();

    $scope.appConfig = appConfig;

    $scope.categories = categories;

    $scope.update = {
        restaurant_id: {
            value: undefined
        },
        restaurant_token:{
            value: undefined
        },
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
            valid: true,
            value: undefined,
            focus: false,
            error:{
                message: undefined,
                reason: undefined
            }
        },
        gallery:{
            valid: true,
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
            value: false,
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
        start_date: "",
        end_date: ""
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
    
    function dataURLtoFile(dataurl, filename) {
        var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
            bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
        while(n--){
            u8arr[n] = bstr.charCodeAt(n);
        }
        return new File([u8arr], filename, {type:mime});
    }

    function getImageFormUrl(url, fileName, callback) {
        var xhr = new XMLHttpRequest();
        xhr.onload = function() {
            var reader = new FileReader();
            reader.onloadend = function() {
                callback(dataURLtoFile(reader.result, fileName));
            }
            reader.readAsDataURL(xhr.response);
        };
        xhr.open('GET', url);
        xhr.responseType = 'blob';
        xhr.send();
    }

    function getImageHeightWidth(imageData, callback){
        var i = new Image(); 
        i.onload = function(){
            callback(i);
        };
        i.src = imageData; 
    }

    function getContractLeftDays(startDate, endDate){
        var currentDate = moment();
        var startDate = moment(startDate, "YYYY-MM-DD");
        var endDate = moment(endDate, "YYYY-MM-DD");
        $scope.contractNoOfDays =  Math.ceil(moment.duration(endDate.diff(currentDate)).asDays()) + 1;
    }

    $scope.fieldFocus = function(field){
        $scope.update[field].focus = true;
    };

    $scope.fieldBlur = function(field){
        $scope.update[field].focus = false;
    };

    $scope.validateLength= function(field, length, fieldValue){
        $scope.update[field].valid = false;
        var value = $scope.update[field].value;
        if(field == 'description'){
            value = fieldValue;
        }
        if(value == undefined || value == '' || value.length <= length){
            $scope.update[field].valid = false;
            $scope.update[field].error = 'length';
            $scope.update[field].length = length;
        }else{
            $scope.update[field].error = '';
            $scope.update[field].valid = true;
        }
    };

    $scope.validateImage = function(){
        if(!$scope.update.logo.value){
            $scope.update.logo.valid = false;
            $scope.update.logo.error.message = 'empty';
        }
    };

    $scope.validateNumber = function(field, check){
        var number = $scope.update[field].value;
        if(!ValidationService.validateNumber(number)){
            if(field != "mobile_no"){
                $scope.update[field].valid = false;
                $scope.update[field].error = 'number_not_valid';
                if(!check && $scope.update[field].value && $scope.update[field].value.length == 0){
                    $scope.update[field].valid = true;
                    $scope.update[field].error = '';
                }
            }else if(field == "mobile_no" && $scope.update[field].value.length > 0){
                $scope.update[field].valid = false;
                $scope.update[field].error = 'number_not_valid';
                if(!check && $scope.update[field].value && $scope.update[field].value.length == 0){
                    $scope.update[field].valid = true;
                    $scope.update[field].error = '';
                }
            }else if(field == "mobile_no" && $scope.update[field].value.length == 0){
                $scope.update[field].valid = true;
                $scope.update[field].error = '';
            }
        }else{
            $scope.update[field].valid = true;
        }
    };

    $scope.validateUrl = function(){
        var link = $scope.update.link;
        if(link.value.length > 0){
            $scope.update.link.valid = ValidationService.isURL(link.value);
            $scope.update.link.error = 'invalid';
        }else{
            $scope.update.link.valid = true;
        }
    };

    $scope.validateDiscount = function(){
        var discount = $scope.update.discount;
        if(discount.value.length > 0){
            $scope.update.discount.valid = true
            $scope.update.discount.error = 'invalid';
        }else{
            $scope.update.link.valid = true;
        }
    };

    $scope.countries = CountryService.list();
    $scope.update.country.value = 'United Kingdom';
    $scope.update.country.valid = true;


    var checkFormIsValid = function(){
        $scope.formIsValid = true;
        angular.forEach($scope.update, function(value, key){
            if(key != 'gallery' && key != 'opening_hours' && key != 'restaurant_id' && key != 'restaurant_token' && key != 'start_date' && key != 'end_date'){
                if(value.valid == undefined || value.valid == false){
                    $scope.formIsValid = false;
                }
            }
        });
    };

    $scope.$watch("update", function(){
        checkFormIsValid();
    }, true);


    // Assign blob to component when selecting a image
    $scope.imageLoaded = function (elm) {
        var reader = new FileReader();
        reader.onload = function (e) {
            // bind new Image to Component
            $scope.$apply(function () {
                $scope.cropped.source = e.target.result;
                $scope.update.logo.value = {name: elm.files[0].name};
            });
        }
        reader.readAsDataURL(elm.files[0]);
    };
    
    $scope.$watch('cropped.image', function(){
        formData.delete("logo");
        getImageHeightWidth($scope.cropped.image, function(data){
            if(data.width == 679 && data.height == 400){
                $scope.update.logo.valid = true;
                formData.append('logo',  FileService.imageBase64ToBlob($scope.cropped.image), $scope.update.logo.value.name);  
            }else{
                $scope.update.logo.valid = false;
                $scope.update.logo.error.message = 'invalid';
                $scope.update.logo.error.reason = {height:$scope.appConfig.image_size.height, 
                                                   width:$scope.appConfig.image_size.width};
            }
            $scope.$apply();
        });
    });

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
                            $scope.update.gallery.valid = true;
                            $scope.update.gallery.value[x] = 
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
            $rootScope.$broadcast('alerts', {type:'error', id:'updateRestaurant', message:'Maximum upload up to 5'});
            $scope.update.gallery.valid = false;
            $scope.update.gallery.error.message = 'max';
            return true;
        }else if($scope.galleryCount > 0 && $scope.fileSize){
            $rootScope.$broadcast('alerts', {type:'error', id:'updateRestaurant', message:'Gallery image size too big'});
            $scope.update.gallery.valid = false;
            $scope.update.gallery.error.message = 'big';
        }
        else{
            $scope.update.gallery.valid = true;
        }
        return false;
    };

    $scope.removeGallery = function(index){
        delete $scope.update.gallery.value[index];
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
                    //$scope.fileSize = true;
                }
                formData.append('gallery[]', value); 
            });
        }
        $scope.validateGalleryImage();
    }

    var validateField = function(bool){
        $scope.validateLength('title', 1);
        $scope.validateLength('address_line1', 5);
        $scope.validateLength('city', 5);
        $scope.validateLength('county', 5);
        $scope.validateLength('postcode', 5);
        $scope.validateImage();
        $scope.validateGalleryImage();
        $scope.validateNumber('telephone_no');
        if($scope.update.categories.list.length > 0){
            $scope.update.categories.valid = true;
            $scope.update.categories.error = '';
        }else{
            $scope.update.categories.valid = false;
            $scope.update.categories.error = 'length';
        }
        if(bool){
            $scope.validateImage();
        }
    };

    $scope.update_submit = function(){
        validateField(true);
        if($scope.formIsValid && $scope.contractNoOfDays >= 1){

            angular.forEach($scope.update, function(data, key){
                if((key != 'logo' || key != 'gallery' || key != 'opening_hours') && (data.value || data.value == false)){
                    formData.append(key, data.value);
                }else if(key == 'opening_hours' ){
                    formData.append(key, JSON.stringify(data));
                }else if((key != 'logo' || key != 'gallery' || key != 'opening_hours') && data.value == undefined){
                    formData.append(key, '');
                }
            });

            RestaurantService.update(formData, JwtService.getJwt())
            .then(function(response){
                $rootScope.$broadcast('alerts', {type:'info', id:'updateRestaurant', message:'Successfully Updated'});
                $scope.update.restaurant_token.value = response.data.data.token;
            },function(response){
                if(response.status == 400 && response.data.data.message == 'Invalid Image'){
                    $scope.update.logo.valid = false;
                    $scope.update.logo.error.message = 'invalid';
                    $scope.update.logo.error.reason = {height:response.data.data.height, 
                                                        width:response.data.data.width};
                }else if(response.status == 401){
                    $rootScope.$broadcast('alerts', {type:'error', id:'updateRestaurant', message:'Unauthorised'});
                }else{
                    $rootScope.$broadcast('alerts', {type:'error', id:'updateRestaurant', message:'Technical Error, please try again later'});
                }
            });
        }
    };

    var checkCategories = function(categories){
        var category = {};
        var check = categories.some(function(value){
            category[value] = true;
        });
        return category;
    };

    var z = 0;
    var initUplaodGalery = function(gallery){
        var gallery = gallery;
        function call(z){
            if(gallery[z]){
                getImageFormUrl($scope.appConfig.domain + gallery[z], gallery[z], function(img){
                    $scope.update.gallery.value[z] = {
                        img: $scope.appConfig.domain + gallery[z], 
                        name: gallery[z].split("/")[gallery[z].split("/").length - 1],
                        size: (img.size / Math.pow(1024,2)).toFixed(2), 
                        index:x
                    };
                    galleries[z] = img;
                    x ++;
                    z ++;
                    if(z == gallery.length){
                        addFormGallery();
                        $scope.$apply();
                    }
                    if(z != gallery.length){
                        call(z);
                    }
                });
            }
        }
        call(z);
    }

    var token = JwtService.getJwt();
    RestaurantService.restaurantUser(token).then(function(response){
        var data = response.data.data.data[0];
        $scope.update.restaurant_id.value = data.restaurant_id;
        $scope.update.restaurant_token.value = data.token;
        $scope.update.title.value = data.title;
        $scope.update.description.value = data.description;
        $scope.update.discount.value = data.discount;
        $scope.update.link.value = data.link;
        $scope.cropped.source = $scope.appConfig.domain + data.logo;
        $scope.update.logo.value = {name: data.logoName};
        initUplaodGalery(data.gallery);
        $scope.update.telephone_no.value = data.telephone_no;
        $scope.update.mobile_no.value = data.mobile_no;
        $scope.update.address_line1.value = data.address_line1;
        $scope.update.address_line2.value = data.address_line2;
        $scope.update.address_line3.value = data.address_line3;
        $scope.update.city.value = data.city;
        $scope.update.county.value = data.county;
        $scope.update.postcode.value = data.post_code;
        $scope.update.country.value = data.country;
        $scope.update.opening_hours = JSON.parse(data.opening_hours);
        $scope.update.categories.value = data.categories.join(',');
        $scope.update.categories.list = data.categories;
        $scope.update.categories.checked = checkCategories(data.categories);
        $scope.update.profile_visible.value = data.visible;
        $scope.update.start_date = moment(data.start_date, "YYYY-MM-DD").format("DD/MM/YYYY");
        $scope.update.end_date = moment(data.end_date, "YYYY-MM-DD").format("DD/MM/YYYY");
        validateField(false);
        $scope.$broadcast("restaurantUser",{complete : true});
        checkFormIsValid();
        getContractLeftDays(data.start_date, data.end_date);
        if(data.active == 2){
            alertCashPaymentRenwal()
        }
    },function(response){
        $state.go(appPath.restaurantSignup.name, {});
    });

    function alertCashPaymentRenwal(){
        $scope.cashPaymentRenwal = true;
        $rootScope.$broadcast('alerts', {type:'warn', id:'renewalResturant', message:'Please wait for an admin to review and approve your renewal'});
    }

    function renewContract(data, paymentType){
        RestaurantService.renew($scope.update.restaurant_id.value,
                                $scope.update.restaurant_token.value,
                                $scope.contractNoOfDays, 
                                data, 
                                token).then(function(response){
            if(paymentType == 'paypal'){
                $scope.update.start_date = response.data.data.start_date;
                $scope.update.end_date = response.data.data.end_date;
                $rootScope.$broadcast('alerts', {type:'info', id:'renewalResturant', message:'Contract has been successfully renewed'});
            }else{
                alertCashPaymentRenwal();
            }
            $scope.update.restaurant_token.value = response.data.data.token;
            getContractLeftDays(moment(response.data.data.start_date, 'DD/MM/YYYY').format('YYYY-MM-DD'), moment(response.data.data.end_date, 'DD/MM/YYYY').format('YYYY-MM-DD'));
        });
    }

    $rootScope.$on("paypalEvent", function(event, data){
        switch(data.payment){
            case "SUCCESS":
                event.preventDefault();
                data.response.type = "paypal";
                renewContract(data.response, 'paypal');
            break;
            case "FORMVALIDATION":
                validateField();
            break;
            case "CASH":
                event.preventDefault();
                data.response.type = "cash";
                renewContract(data.response, 'cash');
            break;
        }
    });
});