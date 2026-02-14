angular.module('page', ['blimpKit', 'platformView', 'platformLocale']).controller('PageController', ($scope, ViewParameters) => {
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
		$scope.optionsCustomer = params.optionsCustomer;
		$scope.optionsCurrency = params.optionsCurrency;
		$scope.optionsCompany = params.optionsCompany;
		$scope.optionsPaymentMethod = params.optionsPaymentMethod;
	}

	$scope.filter = () => {
		let entity = $scope.entity;
		const filter = {
			$filter: {
				conditions: [],
				sorts: [],
				limit: 20,
				offset: 0
			}
		};
		if (entity.Id !== undefined) {
			const condition = { propertyName: 'Id', operator: 'EQ', value: entity.Id };
			filter.$filter.conditions.push(condition);
		}
		if (entity.Customer !== undefined) {
			const condition = { propertyName: 'Customer', operator: 'EQ', value: entity.Customer };
			filter.$filter.conditions.push(condition);
		}
		if (entity.DateFrom) {
			const condition = { propertyName: 'Date', operator: 'GE', value: entity.DateFrom };
			filter.$filter.conditions.push(condition);
		}
		if (entity.DateTo) {
			const condition = { propertyName: 'Date', operator: 'LE', value: entity.DateTo };
			filter.$filter.conditions.push(condition);
		}
		if (entity.ValorFrom) {
			const condition = { propertyName: 'Valor', operator: 'GE', value: entity.ValorFrom };
			filter.$filter.conditions.push(condition);
		}
		if (entity.ValorTo) {
			const condition = { propertyName: 'Valor', operator: 'LE', value: entity.ValorTo };
			filter.$filter.conditions.push(condition);
		}
		if (entity.CompanyIBAN) {
			const condition = { propertyName: 'CompanyIBAN', operator: 'LIKE', value: `%${entity.CompanyIBAN}%` };
			filter.$filter.conditions.push(condition);
		}
		if (entity.CounterpartyIBAN) {
			const condition = { propertyName: 'CounterpartyIBAN', operator: 'LIKE', value: `%${entity.CounterpartyIBAN}%` };
			filter.$filter.conditions.push(condition);
		}
		if (entity.CounterpartyName) {
			const condition = { propertyName: 'CounterpartyName', operator: 'LIKE', value: `%${entity.CounterpartyName}%` };
			filter.$filter.conditions.push(condition);
		}
		if (entity.Amount !== undefined) {
			const condition = { propertyName: 'Amount', operator: 'EQ', value: entity.Amount };
			filter.$filter.conditions.push(condition);
		}
		if (entity.Currency !== undefined) {
			const condition = { propertyName: 'Currency', operator: 'EQ', value: entity.Currency };
			filter.$filter.conditions.push(condition);
		}
		if (entity.Reason) {
			const condition = { propertyName: 'Reason', operator: 'LIKE', value: `%${entity.Reason}%` };
			filter.$filter.conditions.push(condition);
		}
		if (entity.Description) {
			const condition = { propertyName: 'Description', operator: 'LIKE', value: `%${entity.Description}%` };
			filter.$filter.conditions.push(condition);
		}
		if (entity.Company !== undefined) {
			const condition = { propertyName: 'Company', operator: 'EQ', value: entity.Company };
			filter.$filter.conditions.push(condition);
		}
		if (entity.Name) {
			const condition = { propertyName: 'Name', operator: 'LIKE', value: `%${entity.Name}%` };
			filter.$filter.conditions.push(condition);
		}
		if (entity.UUID) {
			const condition = { propertyName: 'UUID', operator: 'LIKE', value: `%${entity.UUID}%` };
			filter.$filter.conditions.push(condition);
		}
		if (entity.Reference) {
			const condition = { propertyName: 'Reference', operator: 'LIKE', value: `%${entity.Reference}%` };
			filter.$filter.conditions.push(condition);
		}
		if (entity.PaymentMethod !== undefined) {
			const condition = { propertyName: 'PaymentMethod', operator: 'EQ', value: entity.PaymentMethod };
			filter.$filter.conditions.push(condition);
		}
		Dialogs.postMessage({ topic: 'codbex-payments.CustomerPayment.CustomerPayment.entitySearch', data: {
			entity: entity,
			filter: filter
		}});
		Dialogs.triggerEvent('codbex-payments.CustomerPayment.CustomerPayment.clearDetails');
		$scope.cancel();
	};

	$scope.resetFilter = () => {
		$scope.entity = {};
		$scope.filter();
	};

	$scope.cancel = () => {
		Dialogs.closeWindow({ id: 'CustomerPayment-filter' });
	};

	$scope.clearErrorMessage = () => {
		$scope.errorMessage = null;
	};
});