angular.module('page', ['blimpKit', 'platformView', 'platformLocale']).controller('PageController', ($scope, ViewParameters) => {
	$scope.entity = {};

	let params = ViewParameters.get();
	if (Object.keys(params).length) {
		$scope.action = 'select';

		if (params.entity.Date) {
			params.entity.Date = new Date(params.entity.Date);
		}
		if (params.entity.Valor) {
			params.entity.Valor = new Date(params.entity.Valor);
		}
		$scope.entity = params.entity;
		$scope.optionsCurrency = params.optionsCurrency;
		$scope.optionsCompany = params.optionsCompany;
		$scope.optionsPaymentRecordDirection = params.optionsPaymentRecordDirection;
		$scope.optionsPaymentStatus = params.optionsPaymentStatus;
		$scope.optionsPaymentType = params.optionsPaymentType;
	}
});