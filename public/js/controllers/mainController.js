angular.module('paymentApp')
.controller('MainController', function($translate, PaymentService, PaymentModel, $scope) {
    var vm = this;

    vm.isLightTheme = true; // Domyślnie jasny motyw
    vm.theme = 'light-mode'; // Ustawienie klasy dla jasnego motywu

    function loadCurrentBills() {
        PaymentService.getBills().then(function(response) {
            if (Array.isArray(response.data)) {
                vm.currentBills = response.data.map(function(bill) {
                    return {
                        ...bill,
                        title: $translate.instant(bill.title) // Tłumaczenie tytułu rachunku
                    };
                });
            } else {
                console.error('Unexpected data format for bills:', response.data);
            }
        }).catch(function(error) {
            console.error('Error loading current bills:', error);
        });
    }

    loadCurrentBills();

    vm.paymentHistory = [];
    vm.currentPage = 1;
    vm.itemsPerPage = 6;

    vm.setPage = function(page) {
        if (page > 0 && page <= vm.totalPages) {
            vm.currentPage = page;
        }
    };
    
    vm.paginatedPaymentHistory = function() {
        var start = (vm.currentPage - 1) * vm.itemsPerPage;
        var end = start + vm.itemsPerPage;
        return vm.paymentHistory.slice(start, end);
    };    

    function loadPaymentHistory() {
        PaymentService.getPayments().then(function(response) {
            if (Array.isArray(response.data)) {
                vm.paymentHistory = response.data.map(function(payment) {
                    payment.date = new Date(payment.payment_date);
                    return payment;
                }).reverse(); // Odwrócenie kolejności elementów w tablicy
                vm.totalPages = Math.ceil(vm.paymentHistory.length / vm.itemsPerPage);
            } else {
                console.error('Unexpected data format for payments:', response.data);
            }
        }).catch(function(error) {
            console.error('Error loading payment history:', error);
        });
    }    

    loadPaymentHistory();

    vm.payment = {
        amount: 0,
        bill_id: null
    };

    vm.makePayment = function() {
        if (!PaymentModel.validateBillSelection(vm.payment.bill_id)) {
            alert($translate.instant('Please select a bill to pay'));
            return;
        }
        if (!PaymentModel.validatePaymentAmount(vm.payment.amount)) {
            alert($translate.instant('Invalid payment amount. Please enter a valid amount.'));
            return;
        }

        PaymentService.makePayment(vm.payment.amount, vm.payment.bill_id).then(function(response) {
            alert($translate.instant(response.data.message));
            loadCurrentBills();
            loadPaymentHistory();
        }).catch(function(error) {
            if (error.status === 400) {
                alert($translate.instant(error.data.message));
            } else {
                console.error('Error making payment:', error);
            }
        });
    };

    vm.changeLanguage = function(langKey) {
        $translate.use(langKey).then(function() {
            return $translate.refresh();
        }).then(function() {
            loadCurrentBills();
        });
    };

    vm.toggleTheme = function() {
        if (vm.isLightTheme) {
          document.body.classList.add('dark-mode');
        } else {
          document.body.classList.remove('dark-mode');
        }
    };

    $scope.$watch('mainCtrl.isLightTheme', function(newVal) {
        vm.toggleTheme();
    });

    vm.visibleSection = 'current'; // Domyślnie widoczna sekcja

    vm.showSection = function(section) {
        vm.visibleSection = section;
    };
});