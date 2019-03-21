(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var simditorDirective = require('./simditor.directive');

module.exports = angular.module('ngSimditor', [simditorDirective.name]);

},{"./simditor.directive":2}],2:[function(require,module,exports){
'use strict';

module.exports = angular.module('simditor.directive', []).directive('simditor', simditor);

simditor.$inject = ['$sce'];

function simditor($sce) {
  return {
    restrict: 'AE',
    require: 'ngModel',
    link: function link(scope, element, attr, ngModel) {
      if (!ngModel) return;

      var $textarea = angular.element('<textarea placeholder="' + attr.placeholder + '"></textarea>');
      element.append($textarea);

      var editor = new Simditor({
        textarea: $textarea,
        toolbar: ['title', 'bold', 'italic', 'underline', 'strikethrough', 'color', 'ol', 'ul', 'blockquote', 'code', 'table', 'link', 'image', 'hr', 'indent', 'outdent', 'alignment']
      });

      ngModel.$render = function () {
        editor.setValue(ngModel.$viewValue || '');
      };

      element.on('keyup', function () {
        scope.$evalAsync(read);
        read();
      });

      // Write data to the model
      function read() {
        ngModel.$setViewValue(editor.getValue());
      }
    }
  };
};

},{}]},{},[1]);
