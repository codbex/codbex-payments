angular.module('page', ["ideUI", "ideView", "entityApi"])
	.config(["messageHubProvider", function (messageHubProvider) {
		messageHubProvider.eventIdPrefix = 'codbex-payments.PaymentRecord.PaymentRecord';
	}])
	.config(["entityApiProvider", function (entityApiProvider) {
		entityApiProvider.baseUrl = "/services/ts/codbex-payments/gen/codbex-payments/api/PaymentRecord/PaymentRecordService.ts";
	}])
	.controller('PageController', ['$scope',  '$http', 'messageHub', 'ViewParameters', 'entityApi', function ($scope,  $http, messageHub, ViewParameters, entityApi) {

		$scope.entity = {};
		$scope.forms = {
			details: {},
		};
		$scope.formHeaders = {
			select: "PaymentRecord Details",
			create: "Create PaymentRecord",
			update: "Update PaymentRecord"
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
			$scope.optionsPaymentRecordDirection = params.optionsPaymentRecordDirection;
			$scope.optionsPaymentStatus = params.optionsPaymentStatus;
			$scope.optionsPaymentType = params.optionsPaymentType;
		}

		$scope.create = function () {
			let entity = $scope.entity;
			entity[$scope.selectedMainEntityKey] = $scope.selectedMainEntityId;
			entityApi.create(entity).then(function (response) {
				if (response.status != 201) {
					$scope.errorMessage = `Unable to create PaymentRecord: '${response.message}'`;
					return;
				}
				messageHub.postMessage("entityCreated", response.data);
				$scope.cancel();
				messageHub.showAlertSuccess("PaymentRecord", "PaymentRecord successfully created");
			});
		};

		$scope.update = function () {
			let id = $scope.entity.Id;
			let entity = $scope.entity;
			entity[$scope.selectedMainEntityKey] = $scope.selectedMainEntityId;
			entityApi.update(id, entity).then(function (response) {
				if (response.status != 200) {
					$scope.errorMessage = `Unable to update PaymentRecord: '${response.message}'`;
					return;
				}
				messageHub.postMessage("entityUpdated", response.data);
				$scope.cancel();
				messageHub.showAlertSuccess("PaymentRecord", "PaymentRecord successfully updated");
			});
		};

		$scope.serviceCurrency = "/services/ts/codbex-currencies/gen/codbex-currencies/api/Currencies/CurrencyService.ts";
		
		$scope.optionsCurrency = [];
		
		$http.get("/services/ts/codbex-currencies/gen/codbex-currencies/api/Currencies/CurrencyService.ts").then(function (response) {
			$scope.optionsCurrency = response.data.map(e => {
				return {
					value: e.Id,
					text: e.Code
				}
			});
		});
		$scope.serviceCompany = "/services/ts/codbex-companies/gen/codbex-companies/api/Companies/CompanyService.ts";
		
		$scope.optionsCompany = [];
		
		$http.get("/services/ts/codbex-companies/gen/codbex-companies/api/Companies/CompanyService.ts").then(function (response) {
			$scope.optionsCompany = response.data.map(e => {
				return {
					value: e.Id,
					text: e.Name
				}
			});
		});
		$scope.servicePaymentRecordDirection = "/services/ts/codbex-payments/gen/codbex-payments/api/Settings/PaymentRecordDirectionService.ts";
		
		$scope.optionsPaymentRecordDirection = [];
		
		$http.get("/services/ts/codbex-payments/gen/codbex-payments/api/Settings/PaymentRecordDirectionService.ts").then(function (response) {
			$scope.optionsPaymentRecordDirection = response.data.map(e => {
				return {
					value: e.Id,
					text: e.Name
				}
			});
		});
		$scope.servicePaymentStatus = "/services/ts/codbex-payments/gen/codbex-payments/api/Settings/PaymentStatusService.ts";
		
		$scope.optionsPaymentStatus = [];
		
		$http.get("/services/ts/codbex-payments/gen/codbex-payments/api/Settings/PaymentStatusService.ts").then(function (response) {
			$scope.optionsPaymentStatus = response.data.map(e => {
				return {
					value: e.Id,
					text: e.Name
				}
			});
		});
		$scope.servicePaymentType = "/services/ts/codbex-payments/gen/codbex-payments/api/Settings/PaymentTypeService.ts";
		
		$scope.optionsPaymentType = [];
		
		$http.get("/services/ts/codbex-payments/gen/codbex-payments/api/Settings/PaymentTypeService.ts").then(function (response) {
			$scope.optionsPaymentType = response.data.map(e => {
				return {
					value: e.Id,
					text: e.Name
				}
			});
		});

		$scope.cancel = function () {
			$scope.entity = {};
			$scope.action = 'select';
			messageHub.closeDialogWindow("PaymentRecord-details");
		};

		$scope.clearErrorMessage = function () {
			$scope.errorMessage = null;
		};

	}]);