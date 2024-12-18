const navigationData = {
    id: 'payment-adjustments-navigation',
    label: "Payment Adjustments",
    group: "sales",
    order: 300,
    link: "/services/web/codbex-payments/gen/codbex-payments/ui/PaymentAdjustments/index.html?embedded"
};

function getNavigation() {
    return navigationData;
}

if (typeof exports !== 'undefined') {
    exports.getNavigation = getNavigation;
}

export { getNavigation }
