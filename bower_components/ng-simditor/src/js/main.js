module.exports = angular
  .module('ngSimditor', [
    require('./simditor.directive').name,
    require('./simditorOptions.service').name
  ]);
