angular.module('paymentApp')
.service('PaymentService', function($http) {
    this.makePayment = function(amount) {
        return $http.post('/api/payments', { amount: amount });
    };
});