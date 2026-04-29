angular.module('page', ['blimpKit', 'platformView', 'platformLocale']).controller('PageController', ($scope, $http, ViewParameters) => {
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
		if (params?.entity?.CreatedAtFrom) {
			params.entity.CreatedAtFrom = new Date(params.entity.CreatedAtFrom);
		}
		if (params?.entity?.CreatedAtTo) {
			params.entity.CreatedAtTo = new Date(params.entity.CreatedAtTo);
		}
		if (params?.entity?.UpdatedAtFrom) {
			params.entity.UpdatedAtFrom = new Date(params.entity.UpdatedAtFrom);
		}
		if (params?.entity?.UpdatedAtTo) {
			params.entity.UpdatedAtTo = new Date(params.entity.UpdatedAtTo);
		}
		$scope.entity = params.entity ?? {};
		$scope.selectedMainEntityKey = params.selectedMainEntityKey;
		$scope.selectedMainEntityId = params.selectedMainEntityId;
		const optionsCurrencyMap = new Map();
		params.optionsCurrency.forEach(e => optionsCurrencyMap.set(e.value, e));
		$scope.optionsCurrency = Array.from(optionsCurrencyMap.values());
		const optionsCompanyMap = new Map();
		params.optionsCompany.forEach(e => optionsCompanyMap.set(e.value, e));
		$scope.optionsCompany = Array.from(optionsCompanyMap.values());
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
		if (entity.Amount !== undefined) {
			const condition = { propertyName: 'Amount', operator: 'EQ', value: entity.Amount };
			filter.$filter.conditions.push(condition);
		}
		if (entity.Currency !== undefined) {
			const condition = { propertyName: 'Currency', operator: 'EQ', value: entity.Currency };
			filter.$filter.conditions.push(condition);
		}
		if (entity.Company !== undefined) {
			const condition = { propertyName: 'Company', operator: 'EQ', value: entity.Company };
			filter.$filter.conditions.push(condition);
		}
		if (entity.Reason) {
			const condition = { propertyName: 'Reason', operator: 'LIKE', value: `%${entity.Reason}%` };
			filter.$filter.conditions.push(condition);
		}
		if (entity.UUID) {
			const condition = { propertyName: 'UUID', operator: 'LIKE', value: `%${entity.UUID}%` };
			filter.$filter.conditions.push(condition);
		}
		if (entity.CreatedAtFrom) {
			const condition = { propertyName: 'CreatedAt', operator: 'GE', value: entity.CreatedAtFrom };
			filter.$filter.conditions.push(condition);
		}
		if (entity.CreatedAtTo) {
			const condition = { propertyName: 'CreatedAt', operator: 'LE', value: entity.CreatedAtTo };
			filter.$filter.conditions.push(condition);
		}
		if (entity.CreatedBy) {
			const condition = { propertyName: 'CreatedBy', operator: 'LIKE', value: `%${entity.CreatedBy}%` };
			filter.$filter.conditions.push(condition);
		}
		if (entity.UpdatedAtFrom) {
			const condition = { propertyName: 'UpdatedAt', operator: 'GE', value: entity.UpdatedAtFrom };
			filter.$filter.conditions.push(condition);
		}
		if (entity.UpdatedAtTo) {
			const condition = { propertyName: 'UpdatedAt', operator: 'LE', value: entity.UpdatedAtTo };
			filter.$filter.conditions.push(condition);
		}
		if (entity.UpdatedBy) {
			const condition = { propertyName: 'UpdatedBy', operator: 'LIKE', value: `%${entity.UpdatedBy}%` };
			filter.$filter.conditions.push(condition);
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
		lastSearchValuesCurrency.clear();
		allValuesCurrency.length = 0;
		lastSearchValuesCompany.clear();
		allValuesCompany.length = 0;
	};

	$scope.cancel = () => {
		Dialogs.closeWindow({ id: 'PaymentAdjustment-filter' });
	};

	$scope.clearErrorMessage = () => {
		$scope.errorMessage = null;
	};

	const lastSearchValuesCurrency = new Set();
	const allValuesCurrency = [];
	let loadMoreOptionsCurrencyCounter = 0;
	$scope.optionsCurrencyLoading = false;
	$scope.optionsCurrencyHasMore = true;

	$scope.loadMoreOptionsCurrency = () => {
		const limit = 20;
		$scope.optionsCurrencyLoading = true;
		$http.get(`/services/ts/codbex-currencies/gen/codbex-currencies/api/Settings/CurrencyController.ts?$limit=${limit}&$offset=${++loadMoreOptionsCurrencyCounter * limit}`)
		.then((response) => {
			const optionValues = allValuesCurrency.map(e => e.value);
			const resultValues = response.data.map(e => ({
				value: e.Id,
				text: e.Name
			}));
			const newValues = [];
			resultValues.forEach(e => {
				if (!optionValues.includes(e.value)) {
					allValuesCurrency.push(e);
					newValues.push(e);
				}
			});
			newValues.forEach(e => {
				if (!$scope.optionsCurrency.find(o => o.value === e.value)) {
					$scope.optionsCurrency.push(e);
				}
			})
			$scope.optionsCurrencyHasMore = resultValues.length > 0;
			$scope.optionsCurrencyLoading = false;
		}, (error) => {
			$scope.optionsCurrencyLoading = false;
			console.error(error);
			const message = error.data ? error.data.message : '';
			Dialogs.showAlert({
				title: 'Currency',
				message: LocaleService.t('codbex-payments:codbex-payments-model.messages.error.unableToLoad', { message: message }),
				type: AlertTypes.Error
			});
		});
	};

	$scope.onOptionsCurrencyChange = (event) => {
		if (allValuesCurrency.length === 0) {
			allValuesCurrency.push(...$scope.optionsCurrency);
		}
		if (event.originalEvent.target.value === '') {
			allValuesCurrency.sort((a, b) => a.text.localeCompare(b.text));
			$scope.optionsCurrency = allValuesCurrency;
			$scope.optionsCurrencyHasMore = true;
		} else if (isText(event.which)) {
			$scope.optionsCurrencyHasMore = false;
			let cacheHit = false;
			Array.from(lastSearchValuesCurrency).forEach(e => {
				if (event.originalEvent.target.value.startsWith(e)) {
					cacheHit = true;
				}
			})
			if (!cacheHit) {
				$http.post('/services/ts/codbex-currencies/gen/codbex-currencies/api/Settings/CurrencyController.ts/search', {
					conditions: [
						{ propertyName: 'Name', operator: 'LIKE', value: `${event.originalEvent.target.value}%` }
					]
				}).then((response) => {
					const optionValues = allValuesCurrency.map(e => e.value);
					const searchResult = response.data.map(e => ({
						value: e.Id,
						text: e.Name
					}));
					searchResult.forEach(e => {
						if (!optionValues.includes(e.value)) {
							allValuesCurrency.push(e);
						}
					});
					$scope.optionsCurrency = allValuesCurrency.filter(e => e.text.toLowerCase().startsWith(event.originalEvent.target.value.toLowerCase()));
				}, (error) => {
					console.error(error);
					const message = error.data ? error.data.message : '';
					Dialogs.showAlert({
						title: 'Currency',
						message: LocaleService.t('codbex-payments:codbex-payments-model.messages.error.unableToLoad', { message: message }),
						type: AlertTypes.Error
					});
				});
				lastSearchValuesCurrency.add(event.originalEvent.target.value);
			}
		}
	};

	const lastSearchValuesCompany = new Set();
	const allValuesCompany = [];
	let loadMoreOptionsCompanyCounter = 0;
	$scope.optionsCompanyLoading = false;
	$scope.optionsCompanyHasMore = true;

	$scope.loadMoreOptionsCompany = () => {
		const limit = 20;
		$scope.optionsCompanyLoading = true;
		$http.get(`/services/ts/codbex-companies/gen/codbex-companies/api/Companies/CompanyController.ts?$limit=${limit}&$offset=${++loadMoreOptionsCompanyCounter * limit}`)
		.then((response) => {
			const optionValues = allValuesCompany.map(e => e.value);
			const resultValues = response.data.map(e => ({
				value: e.Id,
				text: e.Name
			}));
			const newValues = [];
			resultValues.forEach(e => {
				if (!optionValues.includes(e.value)) {
					allValuesCompany.push(e);
					newValues.push(e);
				}
			});
			newValues.forEach(e => {
				if (!$scope.optionsCompany.find(o => o.value === e.value)) {
					$scope.optionsCompany.push(e);
				}
			})
			$scope.optionsCompanyHasMore = resultValues.length > 0;
			$scope.optionsCompanyLoading = false;
		}, (error) => {
			$scope.optionsCompanyLoading = false;
			console.error(error);
			const message = error.data ? error.data.message : '';
			Dialogs.showAlert({
				title: 'Company',
				message: LocaleService.t('codbex-payments:codbex-payments-model.messages.error.unableToLoad', { message: message }),
				type: AlertTypes.Error
			});
		});
	};

	$scope.onOptionsCompanyChange = (event) => {
		if (allValuesCompany.length === 0) {
			allValuesCompany.push(...$scope.optionsCompany);
		}
		if (event.originalEvent.target.value === '') {
			allValuesCompany.sort((a, b) => a.text.localeCompare(b.text));
			$scope.optionsCompany = allValuesCompany;
			$scope.optionsCompanyHasMore = true;
		} else if (isText(event.which)) {
			$scope.optionsCompanyHasMore = false;
			let cacheHit = false;
			Array.from(lastSearchValuesCompany).forEach(e => {
				if (event.originalEvent.target.value.startsWith(e)) {
					cacheHit = true;
				}
			})
			if (!cacheHit) {
				$http.post('/services/ts/codbex-companies/gen/codbex-companies/api/Companies/CompanyController.ts/search', {
					conditions: [
						{ propertyName: 'Name', operator: 'LIKE', value: `${event.originalEvent.target.value}%` }
					]
				}).then((response) => {
					const optionValues = allValuesCompany.map(e => e.value);
					const searchResult = response.data.map(e => ({
						value: e.Id,
						text: e.Name
					}));
					searchResult.forEach(e => {
						if (!optionValues.includes(e.value)) {
							allValuesCompany.push(e);
						}
					});
					$scope.optionsCompany = allValuesCompany.filter(e => e.text.toLowerCase().startsWith(event.originalEvent.target.value.toLowerCase()));
				}, (error) => {
					console.error(error);
					const message = error.data ? error.data.message : '';
					Dialogs.showAlert({
						title: 'Company',
						message: LocaleService.t('codbex-payments:codbex-payments-model.messages.error.unableToLoad', { message: message }),
						type: AlertTypes.Error
					});
				});
				lastSearchValuesCompany.add(event.originalEvent.target.value);
			}
		}
	};

	function isText(keycode) {
		if ((keycode >= 48 && keycode <= 90) || (keycode >= 96 && keycode <= 111) || (keycode >= 186 && keycode <= 222) || [8, 46, 173].includes(keycode)) return true;
		return false;
	}

});