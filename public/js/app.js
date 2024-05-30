angular.module('paymentApp', ['pascalprecht.translate'])
.config(function($translateProvider, $translateSanitizationProvider) {
    $translateProvider.useStaticFilesLoader({
        prefix: '../lang/',
        suffix: '.json'
    });

    $translateProvider.preferredLanguage('pl');

    // Konfiguracja sanitizacji
    $translateSanitizationProvider.addStrategy('sanitize', function(value) {
        return value; // Dodaj odpowiednią logikę sanitizacji
    });
    $translateSanitizationProvider.useStrategy('sanitize');
});