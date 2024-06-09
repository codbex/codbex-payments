const viewData = {
    id: 'codbex-payments-Reports-PaymentRecord-print',
    label: 'Print',
    link: '/services/web/codbex-payments/gen/ui/Reports/PaymentRecord/dialog-print/index.html',
    perspective: 'Reports',
    view: 'PaymentRecord',
    type: 'page',
    order: 10
};

if (typeof exports !== 'undefined') {
    exports.getDialogWindow = function () {
        return viewData;
    }
}