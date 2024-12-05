const navigationData = {
    id: 'employee-payments-navigation',
    label: "Employee Payments",
    group: "salaries",
    order: 300,
    link: "/services/web/codbex-payments/gen/codbex-payments/ui/EmployeePayment/index.html?embedded"
};

function getNavigation() {
    return navigationData;
}

if (typeof exports !== 'undefined') {
    exports.getNavigation = getNavigation;
}

export { getNavigation }
