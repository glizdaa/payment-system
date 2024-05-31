// app.js
angular.module('paymentApp', ['pascalprecht.translate'])
.config(function($translateProvider, $translateSanitizationProvider) {
    // Using DOMPurify from global scope
    $translateProvider.useStaticFilesLoader({
        prefix: '../lang/',
        suffix: '.json'
    });

    $translateProvider.preferredLanguage('pl');

    // Configure sanitization with DOMPurify
    $translateSanitizationProvider.addStrategy('sanitize', function(value) {
        return DOMPurify.sanitize(value); // Sanitize value using DOMPurify
    });
    $translateSanitizationProvider.useStrategy('sanitize');
});