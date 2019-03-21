app.directive("btSignupRestaurant", function(appConfig){
    return {
        templateUrl: appConfig.dir_directive + 'signupRestaurant/signupRestaurant.html',
        controller: function($scope, CountryService){

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
                    $scope.signup.categories.list.push(category);
                }else{
                    $scope.signup.categories.list.splice($scope.signup.categories.list.indexOf(category), 1);
                }
                if($scope.signup.categories.list.length > 0){
                    $scope.signup.categories.valid = true;
                }else{
                    $scope.signup.categories.valid = false;
                }

                $scope.signup.categories.value = $scope.signup.categories.list.join(",");
            };
        },
        link: function(scope, elm, attr){

        }
    };
});