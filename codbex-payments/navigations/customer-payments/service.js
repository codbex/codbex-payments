const navigationData = {
    id: 'customer-payments-navigation',
    label: "Customer Payments",
    group: "sales",
    order: 1000,
    link: "/services/web/codbex-payments/gen/codbex-payments/ui/CustomerPayment/index.html?embedded"
};

function getNavigation() {
    return navigationData;
}

if (typeof exports !== 'undefined') {
    exports.getNavigation = getNavigation;
}

export { getNavigation }
