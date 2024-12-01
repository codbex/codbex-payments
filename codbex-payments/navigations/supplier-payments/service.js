const navigationData = {
    id: 'supplier-payments-navigation',
    label: "Supplier Payments",
    group: "purchasing",
    order: 1000,
    link: "/services/web/codbex-payments/gen/codbex-payments/ui/SupplierPayment/index.html?embedded"
};

function getNavigation() {
    return navigationData;
}

if (typeof exports !== 'undefined') {
    exports.getNavigation = getNavigation;
}

export { getNavigation }
