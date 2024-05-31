angular.module('paymentApp').filter('translateDate', function($filter) {
    return function(date) {
        if (!date) return '';
        
        var dateObj = new Date(date);
        var formattedDate = $filter('date')(dateObj, 'dd/MM/yyyy');
        
        return formattedDate;
    };
});