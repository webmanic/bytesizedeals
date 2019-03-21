app.run(function($transitions){
    $transitions.onSuccess({}, function() {
        $("html, body").animate({ scrollTop: 0 }, 200);
    })
});

app.config(['$compileProvider',
function ($compileProvider) {
    $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|local|data):/);
}]);