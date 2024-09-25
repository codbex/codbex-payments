const navigationData = {
    id: 'supplier-payments-navigation',
    label: "Supplier Payments",
    view: "supplier-payments",
    group: "purchasing",
    orderNumber: 1000,
    lazyLoad: true,
    link: "/services/web/codbex-payments/gen/codbex-payments/ui/SupplierPayment/index.html?embedded"
};

function getNavigation() {
    return navigationData;
}

if (typeof exports !== 'undefined') {
    exports.getNavigation = getNavigation;
}

export { getNavigation }
