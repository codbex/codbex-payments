const navigationData = {
    id: 'customer-payments-navigation',
    label: "Customer Payments",
    view: "customer-payments",
    group: "sales",
    orderNumber: 1000,
    lazyLoad: true,
    link: "/services/web/codbex-payments/gen/codbex-payments/ui/CustomerPayment/index.html?embedded"
};

function getNavigation() {
    return navigationData;
}

if (typeof exports !== 'undefined') {
    exports.getNavigation = getNavigation;
}

export { getNavigation }
