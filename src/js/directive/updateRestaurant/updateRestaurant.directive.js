app.directive("btUpdateRestaurant", function(appConfig){
    return {
        templateUrl: appConfig.dir_directive + 'updateRestaurant/updateRestaurant.html',
        controller: function($scope, CountryService){

            $scope.appConfig = appConfig;

            $scope.hours = [];
            $scope.minutes = [];
            $scope.toolbar = ['title', 'bold', 'italic', 'underline', 'strikethrough', '|', 'ol', 'ul', 'blockquote', 'hr', '|', 'indent', 'outdent', 'alignment', '|'];

            for(var i = 0; i <= 23; i++){
                var x = i.toString().length == 1 ? '0' + i : i.toString();
                $scope.hours.push(x);
            }

            for(var i = 0; i <= 11; i++){
                var x = (i * 5).toString().length == 1 ? '0' + (i * 5).toString() :  (i * 5).toString();
                $scope.minutes.push(x);
            }

            $scope.categoriesCheckbox = function(category, checked){
                if(!checked){
                    $scope.update.categories.list.push(category);
                }else{
                    $scope.update.categories.list.splice($scope.update.categories.list.indexOf(category), 1);
                }
                if($scope.update.categories.list.length > 0){
                    $scope.update.categories.valid = true;
                }else{
                    $scope.update.categories.valid = false;
                }

                $scope.update.categories.value = $scope.update.categories.list.join(",");
            };
            
        },
        link: function(scope, elm, attr){
                $("#logoImage").change(function(e) {

                    for (var i = 0; i < e.originalEvent.srcElement.files.length; i++) {
                        
                        var file = e.originalEvent.srcElement.files[i];
                        
                        var img = document.createElement("img");
                        var reader = new FileReader();
                        reader.onloadend = function() {
                             img.src = reader.result;
                        };
                        reader.readAsDataURL(file);
                        $("#image_upload").html(img);
                    }

                    $("#restaurantImage").remove();
                });
        }
    };
});