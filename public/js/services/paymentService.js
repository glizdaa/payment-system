angular.module('paymentApp').factory('PaymentService', function($http) {
    return {
      getBills: function() {
        return $http.get('/api/bills');
      },
      getPayments: function() {
        return $http.get('/api/payments');
      },
      makePayment: function(amount, bill_id) {
        return $http.post('/api/payments', { amount: amount, bill_id: bill_id });
      }
    };
  });
  