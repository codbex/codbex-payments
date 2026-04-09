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
		if (params.entity.DeletedAt) {
			params.entity.DeletedAt = new Date(params.entity.DeletedAt);
		}
		if (params.entity.CreatedAt) {
			params.entity.CreatedAt = new Date(params.entity.CreatedAt);
		}
		if (params.entity.UpdatedAt) {
			params.entity.UpdatedAt = new Date(params.entity.UpdatedAt);
		}
		$scope.entity = params.entity;
		$scope.optionsCurrency = params.optionsCurrency;
		$scope.optionsPaymentDirection = params.optionsPaymentDirection;
		$scope.optionsPaymentType = params.optionsPaymentType;
		$scope.optionsCompany = params.optionsCompany;
	}
});