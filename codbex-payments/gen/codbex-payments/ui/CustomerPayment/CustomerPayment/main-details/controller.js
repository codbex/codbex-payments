angular.module('page', ['blimpKit', 'platformView', 'EntityService'])
	.config(["EntityServiceProvider", (EntityServiceProvider) => {
		EntityServiceProvider.baseUrl = '/services/ts/codbex-payments/gen/codbex-payments/api/CustomerPayment/CustomerPaymentService.ts';
	}])
	.controller('PageController', ($scope, $http, Extensions, EntityService) => {
		const Dialogs = new DialogHub();
		$scope.entity = {};
		$scope.forms = {
			details: {},
		};
		$scope.formHeaders = {
			select: 'CustomerPayment Details',
			create: 'Create CustomerPayment',
			update: 'Update CustomerPayment'
		};
		$scope.action = 'select';

		//-----------------Custom Actions-------------------//
		Extensions.getWindows(['codbex-payments-custom-action']).then((response) => {
			$scope.entityActions = response.data.filter(e => e.perspective === 'CustomerPayment' && e.view === 'CustomerPayment' && e.type === 'entity');
		});

		$scope.triggerEntityAction = (action) => {
			Dialogs.showWindow({
				hasHeader: true,
        		title: action.label,
				path: action.path,
				params: {
					id: $scope.entity.Id
				},
				closeButton: true
			});
		};
		//-----------------Custom Actions-------------------//

		//-----------------Events-------------------//
		Dialogs.addMessageListener({ topic: 'codbex-payments.CustomerPayment.CustomerPayment.clearDetails', handler: () => {
			$scope.$evalAsync(() => {
				$scope.entity = {};
				$scope.optionsCustomer = [];
				$scope.optionsCurrency = [];
				$scope.optionsCompany = [];
				$scope.optionsPaymentMethod = [];
				$scope.action = 'select';
			});
		}});
		Dialogs.addMessageListener({ topic: 'codbex-payments.CustomerPayment.CustomerPayment.entitySelected', handler: (data) => {
			$scope.$evalAsync(() => {
				if (data.entity.Date) {
					data.entity.Date = new Date(data.entity.Date);
				}
				if (data.entity.Valor) {
					data.entity.Valor = new Date(data.entity.Valor);
				}
				$scope.entity = data.entity;
				$scope.optionsCustomer = data.optionsCustomer;
				$scope.optionsCurrency = data.optionsCurrency;
				$scope.optionsCompany = data.optionsCompany;
				$scope.optionsPaymentMethod = data.optionsPaymentMethod;
				$scope.action = 'select';
			});
		}});
		Dialogs.addMessageListener({ topic: 'codbex-payments.CustomerPayment.CustomerPayment.createEntity', handler: (data) => {
			$scope.$evalAsync(() => {
				$scope.entity = {};
				$scope.optionsCustomer = data.optionsCustomer;
				$scope.optionsCurrency = data.optionsCurrency;
				$scope.optionsCompany = data.optionsCompany;
				$scope.optionsPaymentMethod = data.optionsPaymentMethod;
				$scope.action = 'create';
			});
		}});
		Dialogs.addMessageListener({ topic: 'codbex-payments.CustomerPayment.CustomerPayment.updateEntity', handler: (data) => {
			$scope.$evalAsync(() => {
				if (data.entity.Date) {
					data.entity.Date = new Date(data.entity.Date);
				}
				if (data.entity.Valor) {
					data.entity.Valor = new Date(data.entity.Valor);
				}
				$scope.entity = data.entity;
				$scope.optionsCustomer = data.optionsCustomer;
				$scope.optionsCurrency = data.optionsCurrency;
				$scope.optionsCompany = data.optionsCompany;
				$scope.optionsPaymentMethod = data.optionsPaymentMethod;
				$scope.action = 'update';
			});
		}});

		$scope.serviceCustomer = '/services/ts/codbex-partners/gen/codbex-partners/api/Customers/CustomerService.ts';
		$scope.serviceCurrency = '/services/ts/codbex-currencies/gen/codbex-currencies/api/Settings/CurrencyService.ts';
		$scope.serviceCompany = '/services/ts/codbex-companies/gen/codbex-companies/api/Companies/CompanyService.ts';
		$scope.servicePaymentMethod = '/services/ts/codbex-methods/gen/codbex-methods/api/Settings/PaymentMethodService.ts';

		//-----------------Events-------------------//

		$scope.create = () => {
			EntityService.create($scope.entity).then((response) => {
				Dialogs.postMessage({ topic: 'codbex-payments.CustomerPayment.CustomerPayment.entityCreated', data: response.data });
				Dialogs.postMessage({ topic: 'codbex-payments.CustomerPayment.CustomerPayment.clearDetails' , data: response.data });
				Dialogs.showAlert({
					title: 'CustomerPayment',
					message: 'CustomerPayment successfully created',
					type: AlertTypes.Success
				});
			}, (error) => {
				const message = error.data ? error.data.message : '';
				Dialogs.showAlert({
					title: 'CustomerPayment',
					message: `Unable to create CustomerPayment: '${message}'`,
					type: AlertTypes.Error
				});
				console.error('EntityService:', error);
			});
		};

		$scope.update = () => {
			EntityService.update($scope.entity.Id, $scope.entity).then((response) => {
				Dialogs.postMessage({ topic: 'codbex-payments.CustomerPayment.CustomerPayment.entityUpdated', data: response.data });
				Dialogs.postMessage({ topic: 'codbex-payments.CustomerPayment.CustomerPayment.clearDetails', data: response.data });
				Dialogs.showAlert({
					title: 'CustomerPayment',
					message: 'CustomerPayment successfully updated',
					type: AlertTypes.Success
				});
			}, (error) => {
				const message = error.data ? error.data.message : '';
				Dialogs.showAlert({
					title: 'CustomerPayment',
					message: `Unable to create CustomerPayment: '${message}'`,
					type: AlertTypes.Error
				});
				console.error('EntityService:', error);
			});
		};

		$scope.cancel = () => {
			Dialogs.triggerEvent('codbex-payments.CustomerPayment.CustomerPayment.clearDetails');
		};
		
		//-----------------Dialogs-------------------//
		$scope.alert = (message) => {
			if (message) Dialogs.showAlert({
				title: 'Description',
				message: message,
				type: AlertTypes.Information,
				preformatted: true,
			});
		};
		
		$scope.createCustomer = () => {
			Dialogs.showWindow({
				id: 'Customer-details',
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
		$scope.createPaymentMethod = () => {
			Dialogs.showWindow({
				id: 'PaymentMethod-details',
				params: {
					action: 'create',
					entity: {},
				},
				closeButton: false
			});
		};

		//-----------------Dialogs-------------------//



		//----------------Dropdowns-----------------//

		$scope.refreshCustomer = () => {
			$scope.optionsCustomer = [];
			$http.get('/services/ts/codbex-partners/gen/codbex-partners/api/Customers/CustomerService.ts').then((response) => {
				$scope.optionsCustomer = response.data.map(e => ({
					value: e.Id,
					text: e.Name
				}));
			}, (error) => {
				console.error(error);
				const message = error.data ? error.data.message : '';
				Dialogs.showAlert({
					title: 'Customer',
					message: `Unable to load data: '${message}'`,
					type: AlertTypes.Error
				});
			});
		};
		$scope.refreshCurrency = () => {
			$scope.optionsCurrency = [];
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
		};
		$scope.refreshCompany = () => {
			$scope.optionsCompany = [];
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
		};
		$scope.refreshPaymentMethod = () => {
			$scope.optionsPaymentMethod = [];
			$http.get('/services/ts/codbex-methods/gen/codbex-methods/api/Settings/PaymentMethodService.ts').then((response) => {
				$scope.optionsPaymentMethod = response.data.map(e => ({
					value: e.Id,
					text: e.Name
				}));
			}, (error) => {
				console.error(error);
				const message = error.data ? error.data.message : '';
				Dialogs.showAlert({
					title: 'PaymentMethod',
					message: `Unable to load data: '${message}'`,
					type: AlertTypes.Error
				});
			});
		};

		//----------------Dropdowns-----------------//	
	});