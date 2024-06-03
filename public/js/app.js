angular.module('paymentApp', ['pascalprecht.translate'])
.config(function($translateProvider, $translateSanitizationProvider) {
    $translateProvider.useStaticFilesLoader({
        prefix: '../lang/',
        suffix: '.json'
    });

    $translateProvider.preferredLanguage('pl');

    // Konfiguracja sanitizacji (w przyszlosci)
    $translateSanitizationProvider.addStrategy('sanitize', function(value) {
        return value;
    });
    $translateSanitizationProvider.useStrategy('sanitize');
});