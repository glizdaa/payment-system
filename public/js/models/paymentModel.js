angular.module('paymentApp').factory('PaymentModel', function() {
    function validatePaymentAmount(amount) {
        return amount > 0;
    }

    function validateBillSelection(billId) {
        return billId !== null && billId !== undefined;
    }

    return {
        validatePaymentAmount: validatePaymentAmount,
        validateBillSelection: validateBillSelection
    };
});