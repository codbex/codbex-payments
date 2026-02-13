angular.module('page', ['blimpKit', 'platformView', 'platformLocale', 'EntityService'])
	.config(['EntityServiceProvider', (EntityServiceProvider) => {
		EntityServiceProvider.baseUrl = '/services/ts/codbex-payments/gen/codbex-payments/api/Settings/PaymentRecordDirectionController.ts';
	}])
	.controller('PageController', ($scope, $http, ViewParameters, LocaleService, EntityService) => {
		const Dialogs = new DialogHub();
		const Notifications = new NotificationHub();
		let description = 'Description';
		let propertySuccessfullyCreated = 'PaymentRecordDirection successfully created';
		let propertySuccessfullyUpdated = 'PaymentRecordDirection successfully updated';

		$scope.entity = {};
		$scope.forms = {
			details: {},
		};
		$scope.formHeaders = {
			select: 'PaymentRecordDirection Details',
			create: 'Create PaymentRecordDirection',
			update: 'Update PaymentRecordDirection'
		};
		$scope.action = 'select';

		LocaleService.onInit(() => {
			description = LocaleService.t('codbex-payments:codbex-payments-model.defaults.description');
			$scope.formHeaders.select = LocaleService.t('codbex-payments:codbex-payments-model.defaults.formHeadSelect', { name: '$t(codbex-payments:codbex-payments-model.t.PAYMENTRECORDDIRECTION)' });
			$scope.formHeaders.create = LocaleService.t('codbex-payments:codbex-payments-model.defaults.formHeadCreate', { name: '$t(codbex-payments:codbex-payments-model.t.PAYMENTRECORDDIRECTION)' });
			$scope.formHeaders.update = LocaleService.t('codbex-payments:codbex-payments-model.defaults.formHeadUpdate', { name: '$t(codbex-payments:codbex-payments-model.t.PAYMENTRECORDDIRECTION)' });
			propertySuccessfullyCreated = LocaleService.t('codbex-payments:codbex-payments-model.messages.propertySuccessfullyCreated', { name: '$t(codbex-payments:codbex-payments-model.t.PAYMENTRECORDDIRECTION)' });
			propertySuccessfullyUpdated = LocaleService.t('codbex-payments:codbex-payments-model.messages.propertySuccessfullyUpdated', { name: '$t(codbex-payments:codbex-payments-model.t.PAYMENTRECORDDIRECTION)' });
		});

		let params = ViewParameters.get();
		if (Object.keys(params).length) {
			$scope.action = params.action;
			$scope.entity = params.entity;
			$scope.selectedMainEntityKey = params.selectedMainEntityKey;
			$scope.selectedMainEntityId = params.selectedMainEntityId;
		}

		$scope.create = () => {
			let entity = $scope.entity;
			entity[$scope.selectedMainEntityKey] = $scope.selectedMainEntityId;
			EntityService.create(entity).then((response) => {
				Dialogs.postMessage({ topic: 'codbex-payments.Settings.PaymentRecordDirection.entityCreated', data: response.data });
				Notifications.show({
					title: LocaleService.t('codbex-payments:codbex-payments-model.t.PAYMENTRECORDDIRECTION'),
					description: propertySuccessfullyCreated,
					type: 'positive'
				});
				$scope.cancel();
			}, (error) => {
				const message = error.data ? error.data.message : '';
				$scope.$evalAsync(() => {
					$scope.errorMessage = LocaleService.t('codbex-payments:codbex-payments-model.messages.error.unableToCreate', { name: '$t(codbex-payments:codbex-payments-model.t.PAYMENTRECORDDIRECTION)', message: message });
				});
				console.error('EntityService:', error);
			});
		};

		$scope.update = () => {
			let id = $scope.entity.Id;
			let entity = $scope.entity;
			entity[$scope.selectedMainEntityKey] = $scope.selectedMainEntityId;
			EntityService.update(id, entity).then((response) => {
				Dialogs.postMessage({ topic: 'codbex-payments.Settings.PaymentRecordDirection.entityUpdated', data: response.data });
				Notifications.show({
					title: LocaleService.t('codbex-payments:codbex-payments-model.t.PAYMENTRECORDDIRECTION'),
					description: propertySuccessfullyUpdated,
					type: 'positive'
				});
				$scope.cancel();
			}, (error) => {
				const message = error.data ? error.data.message : '';
				$scope.$evalAsync(() => {
					$scope.errorMessage = LocaleService.t('codbex-payments:codbex-payments-model.messages.error.unableToUpdate', { name: '$t(codbex-payments:codbex-payments-model.t.PAYMENTRECORDDIRECTION)', message: message });
				});
				console.error('EntityService:', error);
			});
		};


		$scope.alert = (message) => {
			if (message) Dialogs.showAlert({
				title: description,
				message: message,
				type: AlertTypes.Information,
				preformatted: true,
			});
		};

		$scope.cancel = () => {
			$scope.entity = {};
			$scope.action = 'select';
			Dialogs.closeWindow({ id: 'PaymentRecordDirection-details' });
		};

		$scope.clearErrorMessage = () => {
			$scope.errorMessage = null;
		};
	});