angular.module('page', ['blimpKit', 'platformView', 'EntityService'])
	.config(['EntityServiceProvider', (EntityServiceProvider) => {
		EntityServiceProvider.baseUrl = '/services/ts/codbex-payments/gen/codbex-payments/api/EmployeePayment/EmployeePaymentService.ts';
	}])
	.controller('PageController', ($scope, $http, ViewParameters, EntityService) => {
		const Dialogs = new DialogHub();
		$scope.entity = {};
		$scope.forms = {
			details: {},
		};
		$scope.formHeaders = {
			select: 'EmployeePayment Details',
			create: 'Create EmployeePayment',
			update: 'Update EmployeePayment'
		};
		$scope.action = 'select';

		let params = ViewParameters.get();
		if (Object.keys(params).length) {
			$scope.action = params.action;
			if (params.entity.Date) {
				params.entity.Date = new Date(params.entity.Date);
			}
			if (params.entity.Valor) {
				params.entity.Valor = new Date(params.entity.Valor);
			}
			$scope.entity = params.entity;
			$scope.selectedMainEntityKey = params.selectedMainEntityKey;
			$scope.selectedMainEntityId = params.selectedMainEntityId;
			$scope.optionsCurrency = params.optionsCurrency;
			$scope.optionsCompany = params.optionsCompany;
		}

		$scope.create = () => {
			let entity = $scope.entity;
			entity[$scope.selectedMainEntityKey] = $scope.selectedMainEntityId;
			EntityService.create(entity).then((response) => {
				Dialogs.postMessage({ topic: 'codbex-payments.EmployeePayment.EmployeePayment.entityCreated', data: response.data });
				Dialogs.showAlert({
					title: 'EmployeePayment',
					message: 'EmployeePayment successfully created',
					type: AlertTypes.Success
				});
				$scope.cancel();
			}, (error) => {
				const message = error.data ? error.data.message : '';
				$scope.$evalAsync(() => {
					$scope.errorMessage = `Unable to create EmployeePayment: '${message}'`;
				});
				console.error('EntityService:', error);
			});
		};

		$scope.update = () => {
			let id = $scope.entity.Id;
			let entity = $scope.entity;
			entity[$scope.selectedMainEntityKey] = $scope.selectedMainEntityId;
			EntityService.update(id, entity).then((response) => {
				Dialogs.postMessage({ topic: 'codbex-payments.EmployeePayment.EmployeePayment.entityUpdated', data: response.data });
				$scope.cancel();
				Dialogs.showAlert({
					title: 'EmployeePayment',
					message: 'EmployeePayment successfully updated',
					type: AlertTypes.Success
				});
			}, (error) => {
				const message = error.data ? error.data.message : '';
				$scope.$evalAsync(() => {
					$scope.errorMessage = `Unable to update EmployeePayment: '${message}'`;
				});
				console.error('EntityService:', error);
			});
		};

		$scope.serviceCurrency = '/services/ts/codbex-currencies/gen/codbex-currencies/api/Settings/CurrencyService.ts';
		
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
		$scope.serviceCompany = '/services/ts/codbex-companies/gen/codbex-companies/api/Companies/CompanyService.ts';
		
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

		$scope.alert = (message) => {
			if (message) Dialogs.showAlert({
				title: 'Description',
				message: message,
				type: AlertTypes.Information,
				preformatted: true,
			});
		};

		$scope.cancel = () => {
			$scope.entity = {};
			$scope.action = 'select';
			Dialogs.closeWindow({ id: 'EmployeePayment-details' });
		};

		$scope.clearErrorMessage = () => {
			$scope.errorMessage = null;
		};
	});