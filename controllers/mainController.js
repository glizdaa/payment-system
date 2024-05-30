angular.module('paymentApp')
.controller('MainController', function($translate, PaymentService, $scope) {
    var vm = this;

    vm.isLightTheme = true; // Domyślnie jasny motyw
    vm.theme = 'light-mode'; // Ustawienie klasy dla jasnego motywu

    function loadCurrentBills() {
        vm.currentBills = [
            { title: $translate.instant('electricBill'), amount: 120 },
            { title: $translate.instant('internetBill'), amount: 60 }
        ];
    }

    function initialize() {
        // Sprawdzenie aktualnego języka
        var currentLanguage = $translate.use() || $translate.preferredLanguage();
        $translate.use(currentLanguage).then(function() {
            // Ładowanie rachunków zgodnie z aktualnym językiem
            loadCurrentBills();
        });
    }

    // Inicjalizacja rachunków przy starcie
    initialize();

    vm.paymentHistory = [
        { date: '2024-01-01', amount: 120 },
        { date: '2023-12-01', amount: 60 }
    ];

    vm.payment = {
        amount: 0
    };

    vm.makePayment = function() {
        PaymentService.makePayment(vm.payment.amount).then(function(response) {
            alert($translate.instant('paymentSuccess'));
            // Aktualizacja stanu rachunków i historii płatności
        });
    };

    vm.changeLanguage = function(langKey) {
        $translate.use(langKey).then(function() {
            return $translate.refresh();
        }).then(function() {
            // Aktualizacja tłumaczeń dla dynamicznych treści po zmianie języka
            loadCurrentBills();
        });
    };

    // Funkcja przełączająca motyw
    vm.toggleTheme = function() {
        if (vm.isLightTheme) {
            document.body.classList.add('dark-mode');
        } else {
            document.body.classList.remove('dark-mode');
        }
    };
      
    // Nasłuchiwacz zmian stanu checkboxa
    $scope.$watch('mainCtrl.isLightTheme', function(newVal) {
        vm.toggleTheme();
    });
    
    // Zarządzanie widocznością sekcji
    vm.visibleSection = 'current'; // Domyślnie widoczna sekcja

    vm.showSection = function(section) {
        vm.visibleSection = section;
    };
});