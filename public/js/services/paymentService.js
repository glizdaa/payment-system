angular.module('paymentApp')
.service('PaymentService', function($http) {
    this.makePayment = function(amount) {
        // W rzeczywistej aplikacji tutaj wysyłasz dane do serwera
        return $http.post('/api/payments', { amount: amount });
    };
});