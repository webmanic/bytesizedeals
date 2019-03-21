(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

module.exports = angular.module('ngSimditor', [require('./simditor.directive').name, require('./simditorOptions.service').name]);

},{"./simditor.directive":2,"./simditorOptions.service":3}],2:[function(require,module,exports){
'use strict';

module.exports = angular.module('simditor.directive', []).directive('simditor', simditor);

simditor.$inject = ['simditorOptions'];

function simditor(simditorOptions) {
  return {
    restrict: 'AE',
    require: 'ngModel',
    link: function link(scope, element, attr, ngModel) {
      if (!ngModel) return;

      var $textarea = angular.element('<textarea placeholder="' + attr.placeholder + '"></textarea>');
      element.append($textarea);

      var config = angular.extend({
        textarea: $textarea
      }, simditorOptions);

      var editor = new Simditor(config);

      ngModel.$render = function () {
        editor.setValue(ngModel.$viewValue || '');
      };

      editor.on('valuechanged', function (e) {
        ngModel.$setViewValue(editor.getValue());
      });
    }
  };
};

},{}],3:[function(require,module,exports){
'use strict';

module.exports = angular.module('simditorOptions.service', []).value('simditorOptions', {});

},{}]},{},[1]);
