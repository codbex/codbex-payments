const viewData = {
    id: 'codbex-payments-Reports-PaymentRecord-print',
    label: 'Print',
    translation: {
        key: '$projectName:${tprefix}.defaults.print',
    },
    path: '/services/web/codbex-payments/gen/codbex-payments/ui/Reports/PaymentRecord/dialog-print/index.html',
    perspective: 'Reports',
    view: 'PaymentRecord',
    type: 'page',
    order: 10
};
if (typeof exports !== 'undefined') {
    exports.getView = () => viewData;
}