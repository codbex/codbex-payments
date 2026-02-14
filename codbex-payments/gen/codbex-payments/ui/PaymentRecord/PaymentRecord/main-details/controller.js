angular.module('page', ['blimpKit', 'platformView', 'platformLocale', 'EntityService'])
	.config(["EntityServiceProvider", (EntityServiceProvider) => {
		EntityServiceProvider.baseUrl = '/services/ts/codbex-payments/gen/codbex-payments/api/PaymentRecord/PaymentRecordController.ts';
	}])
	.controller('PageController', ($scope, $http, Extensions, LocaleService, EntityService) => {
		const Dialogs = new DialogHub();
		const Notifications = new NotificationHub();
		let description = 'Description';
		let propertySuccessfullyCreated = 'PaymentRecord successfully created';
		let propertySuccessfullyUpdated = 'PaymentRecord successfully updated';
		$scope.entity = {};
		$scope.forms = {
			details: {},
		};
		$scope.formHeaders = {
			select: 'PaymentRecord Details',
			create: 'Create PaymentRecord',
			update: 'Update PaymentRecord'
		};
		$scope.action = 'select';

		LocaleService.onInit(() => {
			description = LocaleService.t('codbex-payments:codbex-payments-model.defaults.description');
			$scope.formHeaders.select = LocaleService.t('codbex-payments:codbex-payments-model.defaults.formHeadSelect', { name: '$t(codbex-payments:codbex-payments-model.t.PAYMENTRECORD)' });
			$scope.formHeaders.create = LocaleService.t('codbex-payments:codbex-payments-model.defaults.formHeadCreate', { name: '$t(codbex-payments:codbex-payments-model.t.PAYMENTRECORD)' });
			$scope.formHeaders.update = LocaleService.t('codbex-payments:codbex-payments-model.defaults.formHeadUpdate', { name: '$t(codbex-payments:codbex-payments-model.t.PAYMENTRECORD)' });
			propertySuccessfullyCreated = LocaleService.t('codbex-payments:codbex-payments-model.messages.propertySuccessfullyCreated', { name: '$t(codbex-payments:codbex-payments-model.t.PAYMENTRECORD)' });
			propertySuccessfullyUpdated = LocaleService.t('codbex-payments:codbex-payments-model.messages.propertySuccessfullyUpdated', { name: '$t(codbex-payments:codbex-payments-model.t.PAYMENTRECORD)' });
		});

		//-----------------Custom Actions-------------------//
		Extensions.getWindows(['codbex-payments-custom-action']).then((response) => {
			$scope.entityActions = response.data.filter(e => e.perspective === 'PaymentRecord' && e.view === 'PaymentRecord' && e.type === 'entity');
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
		Dialogs.addMessageListener({ topic: 'codbex-payments.PaymentRecord.PaymentRecord.clearDetails', handler: () => {
			$scope.$evalAsync(() => {
				$scope.entity = {};
				$scope.optionsCurrency = [];
				$scope.optionsCompany = [];
				$scope.optionsPaymentRecordDirection = [];
				$scope.optionsPaymentStatus = [];
				$scope.optionsPaymentType = [];
				$scope.action = 'select';
			});
		}});
		Dialogs.addMessageListener({ topic: 'codbex-payments.PaymentRecord.PaymentRecord.entitySelected', handler: (data) => {
			$scope.$evalAsync(() => {
				if (data.entity.Date) {
					data.entity.Date = new Date(data.entity.Date);
				}
				if (data.entity.Valor) {
					data.entity.Valor = new Date(data.entity.Valor);
				}
				$scope.entity = data.entity;
				$scope.optionsCurrency = data.optionsCurrency;
				$scope.optionsCompany = data.optionsCompany;
				$scope.optionsPaymentRecordDirection = data.optionsPaymentRecordDirection;
				$scope.optionsPaymentStatus = data.optionsPaymentStatus;
				$scope.optionsPaymentType = data.optionsPaymentType;
				$scope.action = 'select';
			});
		}});
		Dialogs.addMessageListener({ topic: 'codbex-payments.PaymentRecord.PaymentRecord.createEntity', handler: (data) => {
			$scope.$evalAsync(() => {
				$scope.entity = {};
				$scope.optionsCurrency = data.optionsCurrency;
				$scope.optionsCompany = data.optionsCompany;
				$scope.optionsPaymentRecordDirection = data.optionsPaymentRecordDirection;
				$scope.optionsPaymentStatus = data.optionsPaymentStatus;
				$scope.optionsPaymentType = data.optionsPaymentType;
				$scope.action = 'create';
			});
		}});
		Dialogs.addMessageListener({ topic: 'codbex-payments.PaymentRecord.PaymentRecord.updateEntity', handler: (data) => {
			$scope.$evalAsync(() => {
				if (data.entity.Date) {
					data.entity.Date = new Date(data.entity.Date);
				}
				if (data.entity.Valor) {
					data.entity.Valor = new Date(data.entity.Valor);
				}
				$scope.entity = data.entity;
				$scope.optionsCurrency = data.optionsCurrency;
				$scope.optionsCompany = data.optionsCompany;
				$scope.optionsPaymentRecordDirection = data.optionsPaymentRecordDirection;
				$scope.optionsPaymentStatus = data.optionsPaymentStatus;
				$scope.optionsPaymentType = data.optionsPaymentType;
				$scope.action = 'update';
			});
		}});

		$scope.serviceCurrency = '/services/ts/codbex-currencies/gen/codbex-currencies/api/Settings/CurrencyController.ts';
		$scope.serviceCompany = '/services/ts/codbex-companies/gen/codbex-companies/api/Companies/CompanyController.ts';
		$scope.servicePaymentRecordDirection = '/services/ts/codbex-payments/gen/codbex-payments/api/Settings/PaymentRecordDirectionController.ts';
		$scope.servicePaymentStatus = '/services/ts/codbex-payments/gen/codbex-payments/api/Settings/PaymentStatusController.ts';
		$scope.servicePaymentType = '/services/ts/codbex-payments/gen/codbex-payments/api/Settings/PaymentTypeController.ts';

		//-----------------Events-------------------//

		$scope.create = () => {
			EntityService.create($scope.entity).then((response) => {
				Dialogs.postMessage({ topic: 'codbex-payments.PaymentRecord.PaymentRecord.entityCreated', data: response.data });
				Dialogs.postMessage({ topic: 'codbex-payments.PaymentRecord.PaymentRecord.clearDetails' , data: response.data });
				Notifications.show({
					title: LocaleService.t('codbex-payments:codbex-payments-model.t.PAYMENTRECORD'),
					description: propertySuccessfullyCreated,
					type: 'positive'
				});
			}, (error) => {
				const message = error.data ? error.data.message : '';
				Dialogs.showAlert({
					title: LocaleService.t('codbex-payments:codbex-payments-model.t.PAYMENTRECORD'),
					message: LocaleService.t('codbex-payments:codbex-payments-model.messages.error.unableToCreate', { name: '$t(codbex-payments:codbex-payments-model.t.PAYMENTRECORD)', message: message }),
					type: AlertTypes.Error
				});
				console.error('EntityService:', error);
			});
		};

		$scope.update = () => {
			EntityService.update($scope.entity.Id, $scope.entity).then((response) => {
				Dialogs.postMessage({ topic: 'codbex-payments.PaymentRecord.PaymentRecord.entityUpdated', data: response.data });
				Dialogs.postMessage({ topic: 'codbex-payments.PaymentRecord.PaymentRecord.clearDetails', data: response.data });
				Notifications.show({
					title: LocaleService.t('codbex-payments:codbex-payments-model.t.PAYMENTRECORD'),
					description: propertySuccessfullyUpdated,
					type: 'positive'
				});
			}, (error) => {
				const message = error.data ? error.data.message : '';
				Dialogs.showAlert({
					title: LocaleService.t('codbex-payments:codbex-payments-model.t.PAYMENTRECORD'),
					message: LocaleService.t('codbex-payments:codbex-payments-model.messages.error.unableToCreate', { name: '$t(codbex-payments:codbex-payments-model.t.PAYMENTRECORD)', message: message }),
					type: AlertTypes.Error
				});
				console.error('EntityService:', error);
			});
		};

		$scope.cancel = () => {
			Dialogs.triggerEvent('codbex-payments.PaymentRecord.PaymentRecord.clearDetails');
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
		$scope.createPaymentRecordDirection = () => {
			Dialogs.showWindow({
				id: 'PaymentRecordDirection-details',
				params: {
					action: 'create',
					entity: {},
				},
				closeButton: false
			});
		};
		$scope.createPaymentStatus = () => {
			Dialogs.showWindow({
				id: 'PaymentStatus-details',
				params: {
					action: 'create',
					entity: {},
				},
				closeButton: false
			});
		};
		$scope.createPaymentType = () => {
			Dialogs.showWindow({
				id: 'PaymentType-details',
				params: {
					action: 'create',
					entity: {},
				},
				closeButton: false
			});
		};

		//-----------------Dialogs-------------------//



		//----------------Dropdowns-----------------//

		$scope.refreshCurrency = () => {
			$scope.optionsCurrency = [];
			$http.get('/services/ts/codbex-currencies/gen/codbex-currencies/api/Settings/CurrencyController.ts').then((response) => {
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
		};
		$scope.refreshCompany = () => {
			$scope.optionsCompany = [];
			$http.get('/services/ts/codbex-companies/gen/codbex-companies/api/Companies/CompanyController.ts').then((response) => {
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
		};
		$scope.refreshPaymentRecordDirection = () => {
			$scope.optionsPaymentRecordDirection = [];
			$http.get('/services/ts/codbex-payments/gen/codbex-payments/api/Settings/PaymentRecordDirectionController.ts').then((response) => {
				$scope.optionsPaymentRecordDirection = response.data.map(e => ({
					value: e.Id,
					text: e.Name
				}));
			}, (error) => {
				console.error(error);
				const message = error.data ? error.data.message : '';
				Dialogs.showAlert({
					title: 'PaymentRecordDirection',
					message: LocaleService.t('codbex-payments:codbex-payments-model.messages.error.unableToLoad', { message: message }),
					type: AlertTypes.Error
				});
			});
		};
		$scope.refreshPaymentStatus = () => {
			$scope.optionsPaymentStatus = [];
			$http.get('/services/ts/codbex-payments/gen/codbex-payments/api/Settings/PaymentStatusController.ts').then((response) => {
				$scope.optionsPaymentStatus = response.data.map(e => ({
					value: e.Id,
					text: e.Name
				}));
			}, (error) => {
				console.error(error);
				const message = error.data ? error.data.message : '';
				Dialogs.showAlert({
					title: 'PaymentStatus',
					message: LocaleService.t('codbex-payments:codbex-payments-model.messages.error.unableToLoad', { message: message }),
					type: AlertTypes.Error
				});
			});
		};
		$scope.refreshPaymentType = () => {
			$scope.optionsPaymentType = [];
			$http.get('/services/ts/codbex-payments/gen/codbex-payments/api/Settings/PaymentTypeController.ts').then((response) => {
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
		};

		//----------------Dropdowns-----------------//	
	});