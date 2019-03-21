app.directive("btCashPayment", function (appConfig) {
    return {
        templateUrl: appConfig.dir_directive + 'cashPayment/cashPayment.html',
        scope: {
            formIsValid: "=",
            form: "=",
            loader: "="
        },
        controller: function ($scope, $rootScope, TokenService, JwtService) {

            var payload = JwtService.decodejwt();
            var currentDateTime = moment("YYYY-MM-DDThh:mm:ssZ");
            var id = "CASH-" + TokenService.generateToken(24);
            var paymentId = TokenService.generateToken(17);
            
            var response = {
                "id": id,
                "intent": "sale",
                "create_time": currentDateTime,
                "payer": {
                    "payment_method": "cash",
                },
                "transactions": [{
                    "amount": {
                        "total": appConfig.restaurant_signup_cost,
                        "currency": 'GBP',
                        "details": {
                            subtotal: (appConfig.restaurant_signup_cost - (appConfig.restaurant_signup_cost * (appConfig.vat_tax / 100))),
                            tax: (appConfig.restaurant_signup_cost * (appConfig.vat_tax / 100))
                        }
                    },
                    "item_list": {
                        "items": [{
                            name: 'Bytesizedeals',
                            description: $scope.form.title.value,
                            quantity: '1',
                            price: (appConfig.restaurant_signup_cost - (appConfig.restaurant_signup_cost * (appConfig.vat_tax / 100))),
                            tax: (appConfig.restaurant_signup_cost * (appConfig.vat_tax / 100)),
                            sku: 'bytesizedeals' + payload.user_id,
                            currency: 'GBP'
                        }]
                    },
                    "related_resources": [{
                        "sale": {
                            "id": paymentId,
                            "state": "completed",
                            "payment_mode": "cash",
                            "parent_payment": id,
                            "create_time": currentDateTime,
                            "update_time": currentDateTime,
                            "amount": {
                                "total": appConfig.restaurant_signup_cost,
                                "currency": "GBP",
                                "details": {
                                    "subtotal": (appConfig.restaurant_signup_cost - (appConfig.restaurant_signup_cost * (appConfig.vat_tax / 100))),
                                    "tax": (appConfig.restaurant_signup_cost * (appConfig.vat_tax / 100))
                                }
                            }
                        }
                    }]
                }],
                "type": "cash"
            };

            $scope.cashPayment = function(){
                $scope.loader = true;
                if($scope.formIsValid){
                    $rootScope.$broadcast("paypalEvent", {
                        payment: "CASH",
                        response: response
                    });
                }else{
                    $scope.loader = false;
                    $rootScope.$broadcast("paypalEvent", {payment: "FORMVALIDATION"});
                }
            };
        }
    };
});