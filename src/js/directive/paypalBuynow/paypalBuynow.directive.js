app.directive("btPaypalBuynow", function(appConfig, paypalConfig, JwtService){
    return {
        templateUrl: appConfig.dir_directive + 'paypalBuynow/paypalBuynow.html',
        scope:{
            formIsValid: "=",
            form: "="
        },
        controller: function($scope, $rootScope){
            
            var payload = JwtService.decodejwt();

            function isFolmValid(actions){
                $scope.formIsValid ? actions.enable() : actions.disable();
            }
            
            paypal.Button.render({
                env: paypalConfig.environment.sandbox, //paypalConfig.environment.sandbox | paypalConfig.environment.production
                client: {
                    sandbox: paypalConfig.sandbox.api_key,  // from https://developer.paypal.com/developer/applications/
                    production: paypalConfig.production.api_key
                },
                style: {
                    label: 'buynow',
                    fundingicons: true, // optional
                    branding: true, // optional
                    size:  'responsive', // small | medium | large | responsive
                    shape: 'rect',   // pill | rect
                    color: 'gold'   // gold | blue | silver | black
                },
                validate: function(actions){
                    isFolmValid(actions);
                    $scope.$watch("formIsValid", function(){
                        isFolmValid(actions);
                    });
                },
                onClick: function(data) {
                    if(!$scope.formIsValid){
                        $rootScope.$broadcast("paypalEvent", {payment: "FORMVALIDATION"});
                        $rootScope.$apply();
                    }
                },
                payment: function(data, actions) {
                    return actions.payment.create({
                        transactions: [
                            {
                                amount: {
                                    total:  appConfig.restaurant_signup_cost,
                                    currency: 'GBP',
                                    details: {
                                        subtotal: (appConfig.restaurant_signup_cost - (appConfig.restaurant_signup_cost * (appConfig.vat_tax / 100))),
                                        tax: (appConfig.restaurant_signup_cost * (appConfig.vat_tax / 100))
                                    }
                                },
                                description: 'The payment transaction description.',
                                item_list: {
                                    items: [
                                      {
                                        name: 'Bytesizedeals',
                                        description: $scope.form.title.value,
                                        quantity: '1',
                                        price: (appConfig.restaurant_signup_cost - (appConfig.restaurant_signup_cost * (appConfig.vat_tax / 100))),
                                        tax: (appConfig.restaurant_signup_cost * (appConfig.vat_tax / 100)),
                                        sku: 'bytesizedeals' + payload.user_id,
                                        currency: 'GBP'
                                      }
                                    ]
                                }
                            }
                        ]
                    });
                },
                // Display a "Pay Now" button rather than a "Continue" button
                commit: true,
                // Pass a function to be called when the customer completes the payment
                onAuthorize: function(data, actions) {
                    return actions.payment.execute().then(function(response) {
                        $rootScope.$broadcast("paypalEvent", {payment: "SUCCESS", response:response});
                        $rootScope.$apply();
                    });
                },
                // Pass a function to be called when the customer cancels the payment
                onCancel: function(data) {
                    console.log('The payment was cancelled!');
                }
            }, '#myContainerElement');
        },
        link: function(scope, elm, attr){
        }
    };
});