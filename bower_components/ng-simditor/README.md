# ng-simditor
Angular directive for simditor.

[Demo](http://ng-simditor.mipinr.com)

## Install

```
bower install simditor --save
bower install ng-simditor --save
```

## Usage

```html
<link rel="stylesheet" href="bower_components/simditor/styles/simditor.css" />

<script src="bower_components/simple-module/lib/module.js"></script>
<script src="bower_components/simple-hotkeys/lib/hotkeys.js"></script>
<script src="bower_components/simditor/lib/simditor.js"></script>
<script src="bower_components/ng-simditor/dist/js/ng-simditor.js"></script>
```

```js
angular
.module('app', ['ngSimditor'])
.config(function($provide) {

  // simditor options customize
  $provide.decorator('simditorOptions', ['$delegate', function(simditorOptions) {
    simditorOptions.toolbar = [
      'title',
      'bold',
      'italic',
      'underline',
      'strikethrough',
      'color',
      'ol',
      'ul',
      'blockquote',
      'code',
      'table',
      'link',
      'image',
      'hr',
      'indent',
      'outdent',
      'alignment',
    ];

    simditorOptions.toolbarFloat = false;
    return simditorOptions;
  }]);

});
```

```html
<simditor ng-model="content" placeholder="hahahahah"></simditor>
```

## Opttions

check more [Options](http://simditor.tower.im/docs/doc-config.html#anchor-toolbarFloat) for ng-simditor.
