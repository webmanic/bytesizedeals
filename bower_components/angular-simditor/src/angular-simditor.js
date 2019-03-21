(function() {
    "use strict";
    (function() {
        var ngSimditor = angular.module('angular-simditor', []);
        ngSimditor.constant('simditorConfig', {
        	placeholder: 'Description*...',
        	toolbar: ['title', 'bold', 'italic', 'underline', 'strikethrough', '|', 'ol', 'ul', 'blockquote', 'hr', '|', 'indent', 'outdent', 'alignment', '|'],
            pasteImage: true,
            cleanPaste: true,
        	defaultImage: '',
        	upload: {
                url: '/upload'
            },
            allowedTags: ['br', 'b', 'strong', 'i', 'u', 'font', 'p', 'ul', 'ol', 'li', 'blockquote', 'pre', 'h1', 'h2', 'h3', 'h4', 'h5', 'hr', 'div']
		});
        ngSimditor.directive('ngSimditor', ['$timeout', 'simditorConfig', function($timeout, simditorConfig) {
            // Runs during compile
            return {
                // name: '',
                // priority: 1,
                // terminal: true,
                scope: {
                    id: '@',
                    content: '=',
                    validate: '=',
                    blur: '=',
                    focus: '=',
                    length: '=',
                    max: '=',
                    limit: '=',
                    count: '=',
                    placeholder: '@',
                    toolbar: '=',
                    allowedTags: '='
                }, // {} = isolate, true = child, false/undefined = no change
                // controller: function($scope, $element, $attrs, $transclude) {},
                // require: 'ngModel', // Array = multiple requires, ? = optional, ^ = check parent elements
                restrict: 'E', // E = Element, A = Attribute, C = Class, M = Comment
                template: '<textarea data-autosave="editor-content" autofocus></textarea>',
                // templateUrl: '',
                replace: true,
                // transclude: true,
                // compile: function(tElement, tAttrs, function transclude(function(scope, cloneLinkingFn){ return function linking(scope, elm, attrs){}})),
                link: function($scope, iElm, iAttrs, controller) {

                    var max = $scope.max;

                    if($scope.placeholder){
                        simditorConfig.placeholder = $scope.placeholder;
                    }

                    if($scope.toolbar && $scope.toolbar.length > 0){
                        simditorConfig.toolbar = $scope.toolbar;
                    }

                    if($scope.allowedTags && $scope.allowedTags.length > 0){
                        simditorConfig.allowedTags = $scope.allowedTags;
                    }

                    var editor = new Simditor(
                        angular.extend({textarea: iElm}, simditorConfig)
                    );

                    $('body').on('keydown paste', '[contenteditable]', function(event) {

                        var pastedValue = 0;

                        if(event.type == "paste"){
                            pastedValue = event.originalEvent.clipboardData.getData('Text').length;
                        }
    
                        // if(event.which == 13 && event.type == "keydown"){
                        //     event.preventDefault();
                        //     return false;
                        // }

                        if (event.which != 8 && (editor.getValuePlain().length + pastedValue) >= max) {
                            event.preventDefault();
                            return false;
                        }
                    });

                    var nowContent = '';

                    $scope.$watch('content', function(value, old){
                        if(typeof value !== 'undefined' && value != nowContent){
                            editor.setValue(value);
                            $scope.validate($scope.id, $scope.length, editor.getValuePlain());
                            setLimitCount();
                        }
                    });

                    editor.on('focus', function(e){
                        $scope.focus($scope.id);
                        $scope.$apply();
                    });

                    editor.on('valuechanged', function(e){
                        setLimitCount();
                    });

                    editor.on('selectionchanged', function(e){
                        setLimitCount();
                    });

                    editor.on('decorate', function(e){
                        setLimitCount();
                    });

                    editor.on('blur', function(e){
                        $scope.validate($scope.id, $scope.length, editor.getValuePlain());
                        $scope.blur($scope.id);
                        if($scope.content != editor.getValue()){
                            $timeout(function(){
                                $scope.content = nowContent = editor.getValue();
                            });
                        }
                        setLimitCount();
                        $scope.$apply();
                    });

                    function setLimitCount(){
                        if($scope.limit){
                            updateLimitCharacter();
                        }
                        if($scope.count){
                            updateWordCount();
                        }
                    }

                    function updateLimitCharacter(){
                        var count = max - editor.getValuePlain().length;
                        if(!$(".simditor .simditor-wrapper .simditor-toolbar ul li#characterLimit").length){
                            $(".simditor .simditor-wrapper .simditor-toolbar > ul").append("<li id='characterLimit' class='character'>Characters Left: <span id='count'>" + count + "</span></li>");
                        }
                        if($(".simditor .simditor-wrapper .simditor-toolbar ul li#characterLimit").length){
                            $(".simditor .simditor-wrapper .simditor-toolbar ul li#characterLimit #count").text(count);
                        }
                    }

                    function updateWordCount(){
                        var count = editor.getWordCount();
                        if(!$(".simditor .simditor-wrapper .simditor-toolbar ul li#wordCount").length){
                            $(".simditor .simditor-wrapper .simditor-toolbar > ul").append("<li id='wordCount' class='character'>Word Count: <span id='count'>" + count + "</span></li>");
                        }
                        if($(".simditor .simditor-wrapper .simditor-toolbar ul li#wordCount").length){
                            $(".simditor .simditor-wrapper .simditor-toolbar ul li#wordCount #count").text(count);
                        }
                    }

                    $scope.$watch('limit', function(oldVal, newVal){
                        if(newVal != undefined && newVal){
                            updateLimitCharacter();
                        }
                    });

                    $scope.$watch('count', function(oldVal, newVal){
                        if(newVal != undefined && newVal){
                            updateWordCount();
                        }
                    });
                }
            };
        }]);
    })();
}).call(this);
