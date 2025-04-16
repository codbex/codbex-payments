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
		$scope.optionsPaymentRecordDirection = params.optionsPaymentRecordDirection;
		$scope.optionsPaymentStatus = params.optionsPaymentStatus;
		$scope.optionsPaymentType = params.optionsPaymentType;
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
		if (entity.Id) {
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
		if (entity.CompanyIBAN) {
			filter.$filter.contains.CompanyIBAN = entity.CompanyIBAN;
		}
		if (entity.CounterpartyIBAN) {
			filter.$filter.contains.CounterpartyIBAN = entity.CounterpartyIBAN;
		}
		if (entity.CounterpartyName) {
			filter.$filter.contains.CounterpartyName = entity.CounterpartyName;
		}
		if (entity.Amount) {
			filter.$filter.equals.Amount = entity.Amount;
		}
		if (entity.Currency) {
			filter.$filter.equals.Currency = entity.Currency;
		}
		if (entity.Reason) {
			filter.$filter.contains.Reason = entity.Reason;
		}
		if (entity.Description) {
			filter.$filter.contains.Description = entity.Description;
		}
		if (entity.Company) {
			filter.$filter.equals.Company = entity.Company;
		}
		if (entity.PaymentRecordDirection) {
			filter.$filter.equals.PaymentRecordDirection = entity.PaymentRecordDirection;
		}
		if (entity.PaymentStatus) {
			filter.$filter.equals.PaymentStatus = entity.PaymentStatus;
		}
		if (entity.PaymentType) {
			filter.$filter.equals.PaymentType = entity.PaymentType;
		}
		if (entity.UUID) {
			filter.$filter.contains.UUID = entity.UUID;
		}
		if (entity.Reference) {
			filter.$filter.contains.Reference = entity.Reference;
		}
		if (entity.Deleted) {
			filter.$filter.equals.Deleted = entity.Deleted;
		}
		Dialogs.postMessage({ topic: 'codbex-payments.PaymentRecord.PaymentRecord.entitySearch', data: {
			entity: entity,
			filter: filter
		} });
		$scope.cancel();
	};

	$scope.resetFilter = () => {
		$scope.entity = {};
		$scope.filter();
	};

	$scope.cancel = () => {
		Dialogs.closeWindow({ id: 'PaymentRecord-Report-filter' });
	};

	$scope.clearErrorMessage = () => {
		$scope.errorMessage = null;
	};
});