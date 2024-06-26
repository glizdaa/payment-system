angular.module('paymentApp')
.controller('MainController', function($translate, PaymentService, PaymentModel, $scope) {
    var vm = this;

    vm.isLightTheme = true; // Default light theme
    vm.theme = 'light-mode'; // Setting class for light theme
    vm.currentBills = vm.currentBills || [];

    function loadCurrentBills() {
        PaymentService.getBills().then(function(response) {
            if (Array.isArray(response.data)) {
                vm.currentBills = response.data
                    .filter(function(bill) {
                        return bill.amount > 0; // Filter out bills with amount 0
                    })
                    .map(function(bill) {
                        return {
                            ...bill,
                            title: $translate.instant(bill.title), // Translate bill title
                            due_date: new Date(bill.due_date), // Convert due_date to Date object
                            amount: parseFloat(bill.amount) // Ensure amount is treated as a number
                        };
                    });
                vm.totalBillPages = Math.ceil(vm.currentBills.length / vm.billsPerPage);
                
                // Calculate the total amount of current bills
                vm.totalBillAmount = vm.currentBills.reduce(function(total, bill) {
                    return total + bill.amount;
                }, 0);
                
                console.log('Total Bill Amount:', vm.totalBillAmount); // Debugging line to check the value
                console.log('Current Bills:', vm.currentBills); // Debugging line to check the value of current bills
            } else {
                console.error('Unexpected data format for bills:', response.data);
            }
        }).catch(function(error) {
            console.error('Error loading current bills:', error);
        });
    }    

    vm.reloadPage = reloadPage;
    loadCurrentBills();

    vm.paymentHistory = [];
    vm.currentPage = 1;
    vm.itemsPerPage = 5;

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
                }).reverse(); // Reverse order of array elements
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

    vm.selectBillForPayment = function(bill) {
        if (bill.amount <= 0) {
            alert($translate.instant('Cannot pay a bill with zero or negative amount.'));
            return;
        }
        vm.payment.bill_id = bill.id;
        vm.payment.amount = parseFloat(bill.amount); // Ensure amount is a number
        vm.showSection('pay');
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

    vm.visibleSection = 'current'; // Default visible section

    vm.showSection = function(section) {
        vm.visibleSection = section;
    };

    // Pagination for current bills
    vm.billsPerPage = 4;
    vm.currentBillPage = 1;

    vm.setBillPage = function(page) {
        if (page > 0 && page <= vm.totalBillPages) {
            vm.currentBillPage = page;
        }
    };

    vm.sortBills = function(bills) {
        if (!bills) return [];
        return bills.sort(function(a, b) {
            var dateA = new Date(a.due_date);
            var dateB = new Date(b.due_date);
            if (dateA < dateB) {
                return -1;
            }
            if (dateA > dateB) {
                return 1;
            }
            return a.id - b.id;
        });
    };

    vm.paginatedCurrentBills = function() {
        var sortedBills = vm.sortBills(vm.currentBills);
        var start = (vm.currentBillPage - 1) * vm.billsPerPage;
        var end = start + vm.billsPerPage;
        return sortedBills.slice(start, end);
    };

    vm.isDueDatePast = function(due_date) {
        var now = new Date();
        var dueDate = new Date(due_date);
        return dueDate < now;
    };

    function reloadPage() {
        window.location.reload();
    }
});