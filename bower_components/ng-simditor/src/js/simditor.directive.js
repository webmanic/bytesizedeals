module.exports = angular
  .module('simditor.directive', [])
  .directive('simditor', simditor);

simditor.$inject = ['simditorOptions'];

function simditor(simditorOptions) {
  return {
    restrict: 'AE',
    require: 'ngModel',
    link: function(scope, element, attr, ngModel) {
      if (!ngModel) return;

      var $textarea = angular.element('<textarea placeholder="' + attr.placeholder + '"></textarea>');
      element.append($textarea);

      var config = angular.extend({
        textarea: $textarea
      }, simditorOptions);

      var editor = new Simditor(config);

      ngModel.$render = function() {
        editor.setValue(ngModel.$viewValue || '');
      };

      editor.on('valuechanged', function(e) {
        ngModel.$setViewValue(editor.getValue());
      });

    }
  };
};
