const navigationData = {
    id: 'employee-payments-navigation',
    label: "Employee Payments",
    view: "employee-payments",
    group: "salaries",
    orderNumber: 1000,
    lazyLoad: true,
    link: "/services/web/codbex-payments/gen/codbex-payments/ui/EmployeePayment/index.html?embedded"
};

function getNavigation() {
    return navigationData;
}

if (typeof exports !== 'undefined') {
    exports.getNavigation = getNavigation;
}

export { getNavigation }
