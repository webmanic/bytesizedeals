app.directive('validateInput', function (ValidationService) {
    var validations = {
          // works
          alphabetical: /^([a-zA-Z]*(?=[^a-zA-Z]))./,
          
          // works
          alphanumeric: /^([a-zA-Z0-9]*(?=[^a-zA-Z0-9]))./,
          
          // doesn't work - need to negate?
          // taken from: http://stackoverflow.com/questions/354044/what-is-the-best-u-s-currency-regex
          currency: /(\.((?=[^\d])|\d{2}(?![^,\d.]))|,((?=[^\d])|\d{3}(?=[^,.$])|(?=\d{1,2}[^\d]))|\$(?=.)|\d{4,}(?=,)).|[^\d,.$]|^\$/,
          
          // doesn't work - need to negate?
          // taken from here: http://stackoverflow.com/questions/15196451/regular-expression-to-validate-datetime-format-mm-dd-yyyy
          date: /^(((0[1-9]|1[012])|(\d{2}\/\d{2}))(?=[^\/])|((\d)|(\d{2}\/\d{2}\/\d{1,3})|(.+\/))(?=[^\d])|\d{2}\/\d{2}\/\d{4}(?=.)).|^(1[3-9]|[2-9]\d)|((?!^)(3[2-9]|[4-9]\d)\/)|[3-9]\d{3}|2[1-9]\d{2}|(?!^)\/\d\/|^\/|[^\d/]/,
          
          // doesn't work - need to negate?
          // taken from: http://stackoverflow.com/questions/46155/validate-email-address-in-javascript
          email: /^([\w.$-]+\@[\w.]+(?=[^\w.])|[\w.$-]+\@(?=[^\w.-])|[\w.@-]+(?=[^\w.$@-])).$|\.(?=[^\w-@]).|[^\w.$@-]|^[^\w]|\.(?=@).|@(?=\.)./i,
          
          // works
          numeric: /^(\d*(?=[^\d]))./,

          telephone: /^([0-9\-()+.\s]*(?=[^0-9\-()+.\s]))./
        }
    ;

    return {
      require: 'ngModel',

      scope: {
        validateInput: '@'
      },

      link: function (scope, element, attrs, modelCtrl) {
        var pattern = validations[scope.validateInput] || scope.validateInput
        ;

        modelCtrl.$parsers.push(function (inputValue) {
          var transformedInput = inputValue.replace(pattern, '$1')
          ;
          
          if (transformedInput != inputValue) {
            modelCtrl.$setViewValue(transformedInput);
            modelCtrl.$render();
          }

          return transformedInput;
        });
      }
    };
  });