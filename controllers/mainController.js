angular.module('paymentApp', ['pascalprecht.translate'])
.config(function($translateProvider) {
    $translateProvider.translations('en', {
        currentBills: 'Current Bills',
        paymentHistory: 'Payment History',
        makePayment: 'Make a Payment',
        currentBillsTitle: 'Your Current Bills',
        paymentHistoryTitle: 'Your Payment History',
        makePaymentTitle: 'Make a Payment',
        paymentAmount: 'Payment Amount',
        pay: 'Pay',
        currency: 'USD',
        footerText: 'All rights reserved.'
    });
    $translateProvider.translations('pl', {
        currentBills: 'Bieżące Rachunki',
        paymentHistory: 'Historia Płatności',
        makePayment: 'Dokonaj Płatności',
        currentBillsTitle: 'Twoje Bieżące Rachunki',
        paymentHistoryTitle: 'Twoja Historia Płatności',
        makePaymentTitle: 'Dokonaj Płatności',
        paymentAmount: 'Kwota Płatności',
        pay: 'Zapłać',
        currency: 'PLN',
        footerText: 'Wszelkie prawa zastrzeżone.'
    });
    $translateProvider.preferredLanguage('pl');
})
.controller('MainController', function($translate, PaymentService) {
    var vm = this;

    vm.currentBills = [
        { title: 'Rachunek za prąd', amount: 120 },
        { title: 'Rachunek za internet', amount: 60 }
    ];

    vm.paymentHistory = [
        { date: '2024-01-01', amount: 120 },
        { date: '2023-12-01', amount: 60 }
    ];

    vm.payment = {
        amount: 0
    };

    vm.makePayment = function() {
        PaymentService.makePayment(vm.payment.amount).then(function(response) {
            alert('Płatność zakończona sukcesem!');
            // Aktualizacja stanu rachunków i historii płatności
        });
    };

    vm.changeLanguage = function(langKey) {
        $translate.use(langKey);
    };
});