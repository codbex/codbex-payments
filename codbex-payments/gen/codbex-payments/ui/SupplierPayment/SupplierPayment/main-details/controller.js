angular.module('page', ['blimpKit', 'platformView', 'platformLocale', 'EntityService'])
	.config(["EntityServiceProvider", (EntityServiceProvider) => {
		EntityServiceProvider.baseUrl = '/services/ts/codbex-payments/gen/codbex-payments/api/SupplierPayment/SupplierPaymentController.ts';
	}])
	.controller('PageController', ($scope, $http, Extensions, LocaleService, EntityService) => {
		const Dialogs = new DialogHub();
		const Notifications = new NotificationHub();
		let description = 'Description';
		let propertySuccessfullyCreated = 'SupplierPayment successfully created';
		let propertySuccessfullyUpdated = 'SupplierPayment successfully updated';
		$scope.entity = {};
		$scope.forms = {
			details: {},
		};
		$scope.formHeaders = {
			select: 'SupplierPayment Details',
			create: 'Create SupplierPayment',
			update: 'Update SupplierPayment'
		};
		$scope.action = 'select';

		LocaleService.onInit(() => {
			description = LocaleService.t('codbex-payments:codbex-payments-model.defaults.description');
			$scope.formHeaders.select = LocaleService.t('codbex-payments:codbex-payments-model.defaults.formHeadSelect', { name: '$t(codbex-payments:codbex-payments-model.t.SUPPLIERPAYMENT)' });
			$scope.formHeaders.create = LocaleService.t('codbex-payments:codbex-payments-model.defaults.formHeadCreate', { name: '$t(codbex-payments:codbex-payments-model.t.SUPPLIERPAYMENT)' });
			$scope.formHeaders.update = LocaleService.t('codbex-payments:codbex-payments-model.defaults.formHeadUpdate', { name: '$t(codbex-payments:codbex-payments-model.t.SUPPLIERPAYMENT)' });
			propertySuccessfullyCreated = LocaleService.t('codbex-payments:codbex-payments-model.messages.propertySuccessfullyCreated', { name: '$t(codbex-payments:codbex-payments-model.t.SUPPLIERPAYMENT)' });
			propertySuccessfullyUpdated = LocaleService.t('codbex-payments:codbex-payments-model.messages.propertySuccessfullyUpdated', { name: '$t(codbex-payments:codbex-payments-model.t.SUPPLIERPAYMENT)' });
		});

		//-----------------Custom Actions-------------------//
		Extensions.getWindows(['codbex-payments-custom-action']).then((response) => {
			$scope.entityActions = response.data.filter(e => e.perspective === 'SupplierPayment' && e.view === 'SupplierPayment' && e.type === 'entity');
		});

		$scope.triggerEntityAction = (action) => {
			Dialogs.showWindow({
				hasHeader: true,
        		title: LocaleService.t(action.translation.key, action.translation.options, action.label),
				path: action.path,
				params: {
					id: $scope.entity.Id
				},
				closeButton: true
			});
		};
		//-----------------Custom Actions-------------------//

		//-----------------Events-------------------//
		Dialogs.addMessageListener({ topic: 'codbex-payments.SupplierPayment.SupplierPayment.clearDetails', handler: () => {
			$scope.$evalAsync(() => {
				$scope.entity = {};
				$scope.optionsSupplier = [];
				$scope.optionsCurrency = [];
				$scope.optionsCompany = [];
				$scope.action = 'select';
			});
		}});
		Dialogs.addMessageListener({ topic: 'codbex-payments.SupplierPayment.SupplierPayment.entitySelected', handler: (data) => {
			$scope.$evalAsync(() => {
				if (data.entity.Date) {
					data.entity.Date = new Date(data.entity.Date);
				}
				if (data.entity.Valor) {
					data.entity.Valor = new Date(data.entity.Valor);
				}
				if (data.entity.CreatedAt) {
					data.entity.CreatedAt = new Date(data.entity.CreatedAt);
				}
				if (data.entity.UpdatedAt) {
					data.entity.UpdatedAt = new Date(data.entity.UpdatedAt);
				}
				$scope.entity = data.entity;
				$scope.optionsSupplier = data.optionsSupplier;
				$scope.optionsCurrency = data.optionsCurrency;
				$scope.optionsCompany = data.optionsCompany;
				$scope.action = 'select';
			});
		}});
		Dialogs.addMessageListener({ topic: 'codbex-payments.SupplierPayment.SupplierPayment.createEntity', handler: (data) => {
			$scope.$evalAsync(() => {
				$scope.entity = {};
				$scope.optionsSupplier = data.optionsSupplier;
				$scope.optionsCurrency = data.optionsCurrency;
				$scope.optionsCompany = data.optionsCompany;
				$scope.action = 'create';
			});
		}});
		Dialogs.addMessageListener({ topic: 'codbex-payments.SupplierPayment.SupplierPayment.updateEntity', handler: (data) => {
			$scope.$evalAsync(() => {
				if (data.entity.Date) {
					data.entity.Date = new Date(data.entity.Date);
				}
				if (data.entity.Valor) {
					data.entity.Valor = new Date(data.entity.Valor);
				}
				if (data.entity.CreatedAt) {
					data.entity.CreatedAt = new Date(data.entity.CreatedAt);
				}
				if (data.entity.UpdatedAt) {
					data.entity.UpdatedAt = new Date(data.entity.UpdatedAt);
				}
				$scope.entity = data.entity;
				$scope.optionsSupplier = data.optionsSupplier;
				$scope.optionsCurrency = data.optionsCurrency;
				$scope.optionsCompany = data.optionsCompany;
				$scope.action = 'update';
			});
		}});

		$scope.serviceSupplier = '/services/ts/codbex-partners/gen/codbex-partners/api/Suppliers/SupplierController.ts';
		$scope.serviceCurrency = '/services/ts/codbex-currencies/gen/codbex-currencies/api/Settings/CurrencyController.ts';
		$scope.serviceCompany = '/services/ts/codbex-companies/gen/codbex-companies/api/Companies/CompanyController.ts';

		//-----------------Events-------------------//

		$scope.create = () => {
			EntityService.create($scope.entity).then((response) => {
				Dialogs.postMessage({ topic: 'codbex-payments.SupplierPayment.SupplierPayment.entityCreated', data: response.data });
				Dialogs.postMessage({ topic: 'codbex-payments.SupplierPayment.SupplierPayment.clearDetails' , data: response.data });
				Notifications.show({
					title: LocaleService.t('codbex-payments:codbex-payments-model.t.SUPPLIERPAYMENT'),
					description: propertySuccessfullyCreated,
					type: 'positive'
				});
			}, (error) => {
				const message = error.data ? error.data.message : '';
				Dialogs.showAlert({
					title: LocaleService.t('codbex-payments:codbex-payments-model.t.SUPPLIERPAYMENT'),
					message: LocaleService.t('codbex-payments:codbex-payments-model.messages.error.unableToCreate', { name: '$t(codbex-payments:codbex-payments-model.t.SUPPLIERPAYMENT)', message: message }),
					type: AlertTypes.Error
				});
				console.error('EntityService:', error);
			});
		};

		$scope.update = () => {
			EntityService.update($scope.entity.Id, $scope.entity).then((response) => {
				Dialogs.postMessage({ topic: 'codbex-payments.SupplierPayment.SupplierPayment.entityUpdated', data: response.data });
				Dialogs.postMessage({ topic: 'codbex-payments.SupplierPayment.SupplierPayment.clearDetails', data: response.data });
				Notifications.show({
					title: LocaleService.t('codbex-payments:codbex-payments-model.t.SUPPLIERPAYMENT'),
					description: propertySuccessfullyUpdated,
					type: 'positive'
				});
			}, (error) => {
				const message = error.data ? error.data.message : '';
				Dialogs.showAlert({
					title: LocaleService.t('codbex-payments:codbex-payments-model.t.SUPPLIERPAYMENT'),
					message: LocaleService.t('codbex-payments:codbex-payments-model.messages.error.unableToCreate', { name: '$t(codbex-payments:codbex-payments-model.t.SUPPLIERPAYMENT)', message: message }),
					type: AlertTypes.Error
				});
				console.error('EntityService:', error);
			});
		};

		$scope.cancel = () => {
			Dialogs.triggerEvent('codbex-payments.SupplierPayment.SupplierPayment.clearDetails');
		};
		
		//-----------------Dialogs-------------------//
		$scope.alert = (message) => {
			if (message) Dialogs.showAlert({
				title: description,
				message: message,
				type: AlertTypes.Information,
				preformatted: true,
			});
		};
		
		$scope.createSupplier = () => {
			Dialogs.showWindow({
				id: 'Supplier-details',
				params: {
					action: 'create',
					entity: {},
				},
				closeButton: false
			});
		};
		$scope.createCurrency = () => {
			Dialogs.showWindow({
				id: 'Currency-details',
				params: {
					action: 'create',
					entity: {},
				},
				closeButton: false
			});
		};
		$scope.createCompany = () => {
			Dialogs.showWindow({
				id: 'Company-details',
				params: {
					action: 'create',
					entity: {},
				},
				closeButton: false
			});
		};

		//-----------------Dialogs-------------------//



		//----------------Dropdowns-----------------//

		const lastSearchValuesSupplier = new Set();
		const allValuesSupplier = [];
		let loadMoreOptionsSupplierCounter = 0;
		$scope.optionsSupplierLoading = false;
		$scope.optionsSupplierHasMore = true;

		$scope.loadMoreOptionsSupplier = () => {
			const limit = 20;
			$scope.optionsSupplierLoading = true;
			$http.get(`/services/ts/codbex-partners/gen/codbex-partners/api/Suppliers/SupplierController.ts?$limit=${limit}&$offset=${++loadMoreOptionsSupplierCounter * limit}`)
			.then((response) => {
				const optionValues = allValuesSupplier.map(e => e.value);
				const resultValues = response.data.map(e => ({
					value: e.Id,
					text: e.Name
				}));
				const newValues = [];
				resultValues.forEach(e => {
					if (!optionValues.includes(e.value)) {
						allValuesSupplier.push(e);
						newValues.push(e);
					}
				});
				newValues.forEach(e => {
					if (!$scope.optionsSupplier.find(o => o.value === e.value)) {
						$scope.optionsSupplier.push(e);
					}
				})
				$scope.optionsSupplierHasMore = resultValues.length > 0;
				$scope.optionsSupplierLoading = false;
			}, (error) => {
				$scope.optionsSupplierLoading = false;
				console.error(error);
				const message = error.data ? error.data.message : '';
				Dialogs.showAlert({
					title: 'Supplier',
					message: LocaleService.t('codbex-payments:codbex-payments-model.messages.error.unableToLoad', { message: message }),
					type: AlertTypes.Error
				});
			});
		};

		$scope.onOptionsSupplierChange = (event) => {
			if (allValuesSupplier.length === 0) {
				allValuesSupplier.push(...$scope.optionsSupplier);
			}
			if (event.originalEvent.target.value === '') {
				allValuesSupplier.sort((a, b) => a.text.localeCompare(b.text));
				$scope.optionsSupplier = allValuesSupplier;
				$scope.optionsSupplierHasMore = true;
			} else if (isText(event.which)) {
				$scope.optionsSupplierHasMore = false;
				let cacheHit = false;
				Array.from(lastSearchValuesSupplier).forEach(e => {
					if (event.originalEvent.target.value.startsWith(e)) {
						cacheHit = true;
					}
				})
				if (!cacheHit) {
					$http.post('/services/ts/codbex-partners/gen/codbex-partners/api/Suppliers/SupplierController.ts/search', {
						conditions: [
							{ propertyName: 'Name', operator: 'LIKE', value: `${event.originalEvent.target.value}%` }
						]
					}).then((response) => {
						const optionValues = allValuesSupplier.map(e => e.value);
						const searchResult = response.data.map(e => ({
							value: e.Id,
							text: e.Name
						}));
						searchResult.forEach(e => {
							if (!optionValues.includes(e.value)) {
								allValuesSupplier.push(e);
							}
						});
						$scope.optionsSupplier = allValuesSupplier.filter(e => e.text.toLowerCase().startsWith(event.originalEvent.target.value.toLowerCase()));
					}, (error) => {
						console.error(error);
						const message = error.data ? error.data.message : '';
						Dialogs.showAlert({
							title: 'Supplier',
							message: LocaleService.t('codbex-payments:codbex-payments-model.messages.error.unableToLoad', { message: message }),
							type: AlertTypes.Error
						});
					});
					lastSearchValuesSupplier.add(event.originalEvent.target.value);
				}
			}
		};

		$scope.refreshSupplier = () => {
			$scope.optionsSupplier = [];
			$http.get('/services/ts/codbex-partners/gen/codbex-partners/api/Suppliers/SupplierController.ts').then((response) => {
				$scope.optionsSupplier = response.data.map(e => ({
					value: e.Id,
					text: e.Name
				}));
				allValuesSupplier.length === 0;
			}, (error) => {
				console.error(error);
				const message = error.data ? error.data.message : '';
				Dialogs.showAlert({
					title: 'Supplier',
					message: LocaleService.t('codbex-payments:codbex-payments-model.messages.error.unableToLoad', { message: message }),
					type: AlertTypes.Error
				});
			});
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
					text: e.Code
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
							{ propertyName: 'Code', operator: 'LIKE', value: `${event.originalEvent.target.value}%` }
						]
					}).then((response) => {
						const optionValues = allValuesCurrency.map(e => e.value);
						const searchResult = response.data.map(e => ({
							value: e.Id,
							text: e.Code
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

		$scope.refreshCurrency = () => {
			$scope.optionsCurrency = [];
			$http.get('/services/ts/codbex-currencies/gen/codbex-currencies/api/Settings/CurrencyController.ts').then((response) => {
				$scope.optionsCurrency = response.data.map(e => ({
					value: e.Id,
					text: e.Code
				}));
				allValuesCurrency.length === 0;
			}, (error) => {
				console.error(error);
				const message = error.data ? error.data.message : '';
				Dialogs.showAlert({
					title: 'Currency',
					message: LocaleService.t('codbex-payments:codbex-payments-model.messages.error.unableToLoad', { message: message }),
					type: AlertTypes.Error
				});
			});
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

		$scope.refreshCompany = () => {
			$scope.optionsCompany = [];
			$http.get('/services/ts/codbex-companies/gen/codbex-companies/api/Companies/CompanyController.ts').then((response) => {
				$scope.optionsCompany = response.data.map(e => ({
					value: e.Id,
					text: e.Name
				}));
				allValuesCompany.length === 0;
			}, (error) => {
				console.error(error);
				const message = error.data ? error.data.message : '';
				Dialogs.showAlert({
					title: 'Company',
					message: LocaleService.t('codbex-payments:codbex-payments-model.messages.error.unableToLoad', { message: message }),
					type: AlertTypes.Error
				});
			});
		};

		function isText(keycode) {
			if ((keycode >= 48 && keycode <= 90) || (keycode >= 96 && keycode <= 111) || (keycode >= 186 && keycode <= 222) || [8, 46, 173].includes(keycode)) return true;
			return false;
		}

		//----------------Dropdowns-----------------//	
	});