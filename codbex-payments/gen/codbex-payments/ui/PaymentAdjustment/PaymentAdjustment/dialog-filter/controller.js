angular.module('page', ['blimpKit', 'platformView']).controller('PageController', ($scope, ViewParameters) => {
	const Dialogs = new DialogHub();
	$scope.entity = {};
	$scope.forms = {
		details: {},
	};

	let params = ViewParameters.get();
	if (Object.keys(params).length) {
		if (params?.entity?.DateFrom) {
			params.entity.DateFrom = new Date(params.entity.DateFrom);
		}
		if (params?.entity?.DateTo) {
			params.entity.DateTo = new Date(params.entity.DateTo);
		}
		if (params?.entity?.ValorFrom) {
			params.entity.ValorFrom = new Date(params.entity.ValorFrom);
		}
		if (params?.entity?.ValorTo) {
			params.entity.ValorTo = new Date(params.entity.ValorTo);
		}
		$scope.entity = params.entity ?? {};
		$scope.selectedMainEntityKey = params.selectedMainEntityKey;
		$scope.selectedMainEntityId = params.selectedMainEntityId;
		$scope.optionsCurrency = params.optionsCurrency;
		$scope.optionsCompany = params.optionsCompany;
	}

	$scope.filter = () => {
		let entity = $scope.entity;
		const filter = {
			$filter: {
				equals: {
				},
				notEquals: {
				},
				contains: {
				},
				greaterThan: {
				},
				greaterThanOrEqual: {
				},
				lessThan: {
				},
				lessThanOrEqual: {
				}
			},
		};
		if (entity.Id !== undefined) {
			filter.$filter.equals.Id = entity.Id;
		}
		if (entity.DateFrom) {
			filter.$filter.greaterThanOrEqual.Date = entity.DateFrom;
		}
		if (entity.DateTo) {
			filter.$filter.lessThanOrEqual.Date = entity.DateTo;
		}
		if (entity.ValorFrom) {
			filter.$filter.greaterThanOrEqual.Valor = entity.ValorFrom;
		}
		if (entity.ValorTo) {
			filter.$filter.lessThanOrEqual.Valor = entity.ValorTo;
		}
		if (entity.Amount !== undefined) {
			filter.$filter.equals.Amount = entity.Amount;
		}
		if (entity.Currency !== undefined) {
			filter.$filter.equals.Currency = entity.Currency;
		}
		if (entity.Company !== undefined) {
			filter.$filter.equals.Company = entity.Company;
		}
		if (entity.Reason) {
			filter.$filter.contains.Reason = entity.Reason;
		}
		if (entity.UUID) {
			filter.$filter.contains.UUID = entity.UUID;
		}
		Dialogs.postMessage({ topic: 'codbex-payments.PaymentAdjustment.PaymentAdjustment.entitySearch', data: {
			entity: entity,
			filter: filter
		}});
		Dialogs.triggerEvent('codbex-payments.PaymentAdjustment.PaymentAdjustment.clearDetails');
		$scope.cancel();
	};

	$scope.resetFilter = () => {
		$scope.entity = {};
		$scope.filter();
	};

	$scope.cancel = () => {
		Dialogs.closeWindow({ id: 'PaymentAdjustment-filter' });
	};

	$scope.clearErrorMessage = () => {
		$scope.errorMessage = null;
	};
});