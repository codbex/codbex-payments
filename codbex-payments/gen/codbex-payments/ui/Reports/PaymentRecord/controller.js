angular.module('page', ['blimpKit', 'platformView', 'EntityService'])
	.config(['EntityServiceProvider', (EntityServiceProvider) => {
		EntityServiceProvider.baseUrl = '/services/ts/codbex-payments/gen/codbex-payments/api/PaymentRecord/PaymentRecordService.ts';
	}])
	.controller('PageController', ($scope, $http, EntityService, Extensions) => {
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
        		title: action.label,
				path: action.path,
				params: {
					filterEntity: $scope.filterEntity,
					optionsCurrency: $scope.optionsCurrency,
					optionsCompany: $scope.optionsCompany,
					optionsPaymentRecordDirection: $scope.optionsPaymentRecordDirection,
					optionsPaymentStatus: $scope.optionsPaymentStatus,
					optionsPaymentType: $scope.optionsPaymentType,
				},
				closeButton: true,
			});
		};

		$scope.triggerEntityAction = (action) => {
			Dialogs.showWindow({
				hasHeader: true,
        		title: action.label,
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
					filter.$offset = offset;
					filter.$limit = limit;
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
					});

					$scope.data = response.data;
				}, (error) => {
					const message = error.data ? error.data.message : '';
					Dialogs.showAlert({
						title: "PaymentRecord",
						message: `Unable to list/filter PaymentRecord: '${message}'`,
						type: AlertTypes.Error
					});
					console.error('EntityService:', error);
				});
			}, (error) => {
				const message = error.data ? error.data.message : '';
				Dialogs.showAlert({
					title: "PaymentRecord",
					message: `Unable to count PaymentRecord: '${message}'`,
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
					optionsCurrency: $scope.optionsCurrency,
					optionsCompany: $scope.optionsCompany,
					optionsPaymentRecordDirection: $scope.optionsPaymentRecordDirection,
					optionsPaymentStatus: $scope.optionsPaymentStatus,
					optionsPaymentType: $scope.optionsPaymentType,
				},
			});
		};

		$scope.openFilter = () => {
			Dialogs.showWindow({
				id: 'PaymentRecord-Report-filter',
				params: {
					entity: $scope.filterEntity,
					optionsCurrency: $scope.optionsCurrency,
					optionsCompany: $scope.optionsCompany,
					optionsPaymentRecordDirection: $scope.optionsPaymentRecordDirection,
					optionsPaymentStatus: $scope.optionsPaymentStatus,
					optionsPaymentType: $scope.optionsPaymentType,
				},
			});
		};

		//----------------Dropdowns-----------------//
		$scope.optionsCurrency = [];
		$scope.optionsCompany = [];
		$scope.optionsPaymentRecordDirection = [];
		$scope.optionsPaymentStatus = [];
		$scope.optionsPaymentType = [];

		$http.get('/services/ts/codbex-currencies/gen/codbex-currencies/api/Settings/CurrencyService.ts').then((response) => {
			$scope.optionsCurrency = response.data.map(e => ({
				value: e.Id,
				text: e.Code
			}));
		}, (error) => {
			console.error(error);
			const message = error.data ? error.data.message : '';
			Dialogs.showAlert({
				title: 'Currency',
				message: `Unable to load data: '${message}'`,
				type: AlertTypes.Error
			});
		});

		$http.get('/services/ts/codbex-companies/gen/codbex-companies/api/Companies/CompanyService.ts').then((response) => {
			$scope.optionsCompany = response.data.map(e => ({
				value: e.Id,
				text: e.Name
			}));
		}, (error) => {
			console.error(error);
			const message = error.data ? error.data.message : '';
			Dialogs.showAlert({
				title: 'Company',
				message: `Unable to load data: '${message}'`,
				type: AlertTypes.Error
			});
		});

		$http.get('/services/ts/codbex-payments/gen/codbex-payments/api/Settings/PaymentRecordDirectionService.ts').then((response) => {
			$scope.optionsPaymentRecordDirection = response.data.map(e => ({
				value: e.Id,
				text: e.Name
			}));
		}, (error) => {
			console.error(error);
			const message = error.data ? error.data.message : '';
			Dialogs.showAlert({
				title: 'PaymentRecordDirection',
				message: `Unable to load data: '${message}'`,
				type: AlertTypes.Error
			});
		});

		$http.get('/services/ts/codbex-payments/gen/codbex-payments/api/Settings/PaymentStatusService.ts').then((response) => {
			$scope.optionsPaymentStatus = response.data.map(e => ({
				value: e.Id,
				text: e.Name
			}));
		}, (error) => {
			console.error(error);
			const message = error.data ? error.data.message : '';
			Dialogs.showAlert({
				title: 'PaymentStatus',
				message: `Unable to load data: '${message}'`,
				type: AlertTypes.Error
			});
		});

		$http.get('/services/ts/codbex-payments/gen/codbex-payments/api/Settings/PaymentTypeService.ts').then((response) => {
			$scope.optionsPaymentType = response.data.map(e => ({
				value: e.Id,
				text: e.Name
			}));
		}, (error) => {
			console.error(error);
			const message = error.data ? error.data.message : '';
			Dialogs.showAlert({
				title: 'PaymentType',
				message: `Unable to load data: '${message}'`,
				type: AlertTypes.Error
			});
		});
		$scope.optionsCurrencyValue = (optionKey) => {
			for (let i = 0; i < $scope.optionsCurrency.length; i++) {
				if ($scope.optionsCurrency[i].value === optionKey) {
					return $scope.optionsCurrency[i].text;
				}
			}
			return null;
		};
		$scope.optionsCompanyValue = (optionKey) => {
			for (let i = 0; i < $scope.optionsCompany.length; i++) {
				if ($scope.optionsCompany[i].value === optionKey) {
					return $scope.optionsCompany[i].text;
				}
			}
			return null;
		};
		$scope.optionsPaymentRecordDirectionValue = (optionKey) => {
			for (let i = 0; i < $scope.optionsPaymentRecordDirection.length; i++) {
				if ($scope.optionsPaymentRecordDirection[i].value === optionKey) {
					return $scope.optionsPaymentRecordDirection[i].text;
				}
			}
			return null;
		};
		$scope.optionsPaymentStatusValue = (optionKey) => {
			for (let i = 0; i < $scope.optionsPaymentStatus.length; i++) {
				if ($scope.optionsPaymentStatus[i].value === optionKey) {
					return $scope.optionsPaymentStatus[i].text;
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