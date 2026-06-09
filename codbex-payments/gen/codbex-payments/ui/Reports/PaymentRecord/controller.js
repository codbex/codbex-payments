angular.module('page', ['blimpKit', 'platformView', 'platformLocale', 'EntityService'])
	.config(['EntityServiceProvider', (EntityServiceProvider) => {
		EntityServiceProvider.baseUrl = '/services/java/codbex-payments/gen/codbex_payments/api/paymentrecord/PaymentRecordController';
	}])
	.controller('PageController', ($scope, $http, EntityService, LocaleService, Extensions) => {
		const Dialogs = new DialogHub();
		$scope.dataPage = 1;
		$scope.dataCount = 0;
		$scope.dataLimit = 20;

		//-----------------Custom Actions-------------------//
		Extensions.getWindows(['codbex-payments-custom-action']).then((response) => {
			$scope.pageActions = response.data.filter(e => e.perspective === 'PaymentRecord' && e.view === 'PaymentRecord' && (e.type === 'page' || e.type === undefined));
			$scope.entityActions = response.data.filter(e => e.perspective === 'PaymentRecord' && e.view === 'PaymentRecord' && e.type === 'entity');
		});

		$scope.triggerPageAction = (action) => {
			Dialogs.showWindow({
				hasHeader: true,
        		title: LocaleService.t(action.translation.key, action.translation.options, action.label),
				path: action.path,
				params: {
					filterEntity: $scope.filterEntity,
					optionsCompany: $scope.optionsCompany,
					optionsCurrency: $scope.optionsCurrency,
					optionsPaymentDirection: $scope.optionsPaymentDirection,
					optionsPaymentType: $scope.optionsPaymentType,
				},
				maxWidth: action.maxWidth,
				maxHeight: action.maxHeight,
				closeButton: true,
			});
		};

		$scope.triggerEntityAction = (action) => {
			Dialogs.showWindow({
				hasHeader: true,
        		title: LocaleService.t(action.translation.key, action.translation.options, action.label),
				path: action.path,
				params: {
					id: $scope.entity.Id
				},
				closeButton: true,
			});
		};
		//-----------------Custom Actions-------------------//

		function resetPagination() {
			$scope.dataPage = 1;
			$scope.dataCount = 0;
			$scope.dataLimit = 20;
		}
		resetPagination();

		//-----------------Events-------------------//
		Dialogs.addMessageListener({ topic: 'codbex-payments.PaymentRecord.PaymentRecord.entitySearch', handler: (data) => {
			resetPagination();
			$scope.filter = data.filter;
			$scope.filterEntity = data.entity;
			$scope.loadPage($scope.dataPage, $scope.filter);
		}});
		//-----------------Events-------------------//

		$scope.loadPage = (pageNumber, filter) => {
			if (!filter && $scope.filter) {
				filter = $scope.filter;
			}
			$scope.dataPage = pageNumber;
			EntityService.count(filter).then((resp) => {
				if (resp.data) {
					$scope.dataCount = resp.data.count;
				}
				let offset = (pageNumber - 1) * $scope.dataLimit;
				let limit = $scope.dataLimit;
				let request;
				if (filter) {
					if (!filter.$filter) {
						filter.$filter = {};
					}
					filter.$filter.offset = offset;
					filter.$filter.limit = limit;
					request = EntityService.search(filter);
				} else {
					request = EntityService.list(offset, limit);
				}
				request.then((response) => {
					response.data.forEach(e => {
						if (e.Date) {
							e.Date = new Date(e.Date);
						}
						if (e.Valor) {
							e.Valor = new Date(e.Valor);
						}
						if (e.DeletedAt) {
							e.DeletedAt = new Date(e.DeletedAt);
						}
						if (e.CreatedAt) {
							e.CreatedAt = new Date(e.CreatedAt);
						}
						if (e.UpdatedAt) {
							e.UpdatedAt = new Date(e.UpdatedAt);
						}
					});

					$scope.data = response.data;
				}, (error) => {
					const message = error.data ? error.data.message : '';
					Dialogs.showAlert({
						title: LocaleService.t('codbex-payments:codbex-payments-model.t.PAYMENTRECORD'),
						message: LocaleService.t('codbex-payments:codbex-payments-model.messages.error.unableToLF', { name: '$t(codbex-payments:codbex-payments-model.t.PAYMENTRECORD)', message: message }),
						type: AlertTypes.Error
					});
					console.error('EntityService:', error);
				});
			}, (error) => {
				const message = error.data ? error.data.message : '';
				Dialogs.showAlert({
					title: LocaleService.t('codbex-payments:codbex-payments-model.t.PAYMENTRECORD'),
					message: LocaleService.t('codbex-payments:codbex-payments-model.messages.error.unableToCount', { name: '$t(codbex-payments:codbex-payments-model.t.PAYMENTRECORD)', message: message }),
					type: AlertTypes.Error
				});
				console.error('EntityService:', error);
			});
		};
		$scope.loadPage($scope.dataPage, $scope.filter);

		$scope.selectEntity = (entity) => {
			$scope.selectedEntity = entity;
		};

		$scope.openDetails = (entity) => {
			$scope.selectedEntity = entity;
			Dialogs.showWindow({
				id: 'PaymentRecord-Report-details',
				params: {
					action: "select",
					entity: entity,
					optionsCompany: $scope.optionsCompany,
					optionsCurrency: $scope.optionsCurrency,
					optionsPaymentDirection: $scope.optionsPaymentDirection,
					optionsPaymentType: $scope.optionsPaymentType,
				},
			});
		};

		$scope.openFilter = () => {
			Dialogs.showWindow({
				id: 'PaymentRecord-Report-filter',
				params: {
					entity: $scope.filterEntity,
					optionsCompany: $scope.optionsCompany,
					optionsCurrency: $scope.optionsCurrency,
					optionsPaymentDirection: $scope.optionsPaymentDirection,
					optionsPaymentType: $scope.optionsPaymentType,
				},
			});
		};

		//----------------Dropdowns-----------------//
		$scope.optionsCompany = [];
		$scope.optionsCurrency = [];
		$scope.optionsPaymentDirection = [];
		$scope.optionsPaymentType = [];

		$http.get('/services/java/codbex-companies/gen/codbex_companies/api/companies/CompanyController').then((response) => {
			$scope.optionsCompany = response.data.map(e => ({
				value: e.Id,
				text: e.Name
			}));
		}, (error) => {
			console.error(error);
			const message = error.data ? error.data.message : '';
			Dialogs.showAlert({
				title: 'Company',
				message: LocaleService.t('codbex-payments:codbex-payments-model.messages.error.unableToLoad', { message: message }),
				type: AlertTypes.Error
			});
		});

		$http.get('/services/java/codbex-currencies/gen/codbex_currencies/api/settings/CurrencyController').then((response) => {
			$scope.optionsCurrency = response.data.map(e => ({
				value: e.Id,
				text: e.Code
			}));
		}, (error) => {
			console.error(error);
			const message = error.data ? error.data.message : '';
			Dialogs.showAlert({
				title: 'Currency',
				message: LocaleService.t('codbex-payments:codbex-payments-model.messages.error.unableToLoad', { message: message }),
				type: AlertTypes.Error
			});
		});

		$http.get('/services/java/codbex-payments/gen/codbex_payments/api/settings/PaymentDirectionController').then((response) => {
			$scope.optionsPaymentDirection = response.data.map(e => ({
				value: e.Id,
				text: e.Name
			}));
		}, (error) => {
			console.error(error);
			const message = error.data ? error.data.message : '';
			Dialogs.showAlert({
				title: 'PaymentDirection',
				message: LocaleService.t('codbex-payments:codbex-payments-model.messages.error.unableToLoad', { message: message }),
				type: AlertTypes.Error
			});
		});

		$http.get('/services/java/codbex-payments/gen/codbex_payments/api/settings/PaymentTypeController').then((response) => {
			$scope.optionsPaymentType = response.data.map(e => ({
				value: e.Id,
				text: e.Name
			}));
		}, (error) => {
			console.error(error);
			const message = error.data ? error.data.message : '';
			Dialogs.showAlert({
				title: 'PaymentType',
				message: LocaleService.t('codbex-payments:codbex-payments-model.messages.error.unableToLoad', { message: message }),
				type: AlertTypes.Error
			});
		});
		$scope.optionsCompanyValue = (optionKey) => {
			for (let i = 0; i < $scope.optionsCompany.length; i++) {
				if ($scope.optionsCompany[i].value === optionKey) {
					return $scope.optionsCompany[i].text;
				}
			}
			return null;
		};
		$scope.optionsCurrencyValue = (optionKey) => {
			for (let i = 0; i < $scope.optionsCurrency.length; i++) {
				if ($scope.optionsCurrency[i].value === optionKey) {
					return $scope.optionsCurrency[i].text;
				}
			}
			return null;
		};
		$scope.optionsPaymentDirectionValue = (optionKey) => {
			for (let i = 0; i < $scope.optionsPaymentDirection.length; i++) {
				if ($scope.optionsPaymentDirection[i].value === optionKey) {
					return $scope.optionsPaymentDirection[i].text;
				}
			}
			return null;
		};
		$scope.optionsPaymentTypeValue = (optionKey) => {
			for (let i = 0; i < $scope.optionsPaymentType.length; i++) {
				if ($scope.optionsPaymentType[i].value === optionKey) {
					return $scope.optionsPaymentType[i].text;
				}
			}
			return null;
		};
		//----------------Dropdowns-----------------//
	});