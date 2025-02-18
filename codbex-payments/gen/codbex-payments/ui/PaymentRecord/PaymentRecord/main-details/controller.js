angular.module('page', ["ideUI", "ideView", "entityApi"])
	.config(["messageHubProvider", function (messageHubProvider) {
		messageHubProvider.eventIdPrefix = 'codbex-payments.PaymentRecord.PaymentRecord';
	}])
	.config(["entityApiProvider", function (entityApiProvider) {
		entityApiProvider.baseUrl = "/services/ts/codbex-payments/gen/codbex-payments/api/PaymentRecord/PaymentRecordService.ts";
	}])
	.controller('PageController', ['$scope',  '$http', 'Extensions', 'messageHub', 'entityApi', function ($scope,  $http, Extensions, messageHub, entityApi) {

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

		//-----------------Custom Actions-------------------//
		Extensions.get('dialogWindow', 'codbex-payments-custom-action').then(function (response) {
			$scope.entityActions = response.filter(e => e.perspective === "PaymentRecord" && e.view === "PaymentRecord" && e.type === "entity");
		});

		$scope.triggerEntityAction = function (action) {
			messageHub.showDialogWindow(
				action.id,
				{
					id: $scope.entity.Id
				},
				null,
				true,
				action
			);
		};
		//-----------------Custom Actions-------------------//

		//-----------------Events-------------------//
		messageHub.onDidReceiveMessage("clearDetails", function (msg) {
			$scope.$apply(function () {
				$scope.entity = {};
				$scope.optionsCurrency = [];
				$scope.optionsCompany = [];
				$scope.optionsPaymentRecordDirection = [];
				$scope.optionsPaymentStatus = [];
				$scope.optionsPaymentType = [];
				$scope.action = 'select';
			});
		});

		messageHub.onDidReceiveMessage("entitySelected", function (msg) {
			$scope.$apply(function () {
				if (msg.data.entity.Date) {
					msg.data.entity.Date = new Date(msg.data.entity.Date);
				}
				if (msg.data.entity.Valor) {
					msg.data.entity.Valor = new Date(msg.data.entity.Valor);
				}
				$scope.entity = msg.data.entity;
				$scope.optionsCurrency = msg.data.optionsCurrency;
				$scope.optionsCompany = msg.data.optionsCompany;
				$scope.optionsPaymentRecordDirection = msg.data.optionsPaymentRecordDirection;
				$scope.optionsPaymentStatus = msg.data.optionsPaymentStatus;
				$scope.optionsPaymentType = msg.data.optionsPaymentType;
				$scope.action = 'select';
			});
		});

		messageHub.onDidReceiveMessage("createEntity", function (msg) {
			$scope.$apply(function () {
				$scope.entity = {};
				$scope.optionsCurrency = msg.data.optionsCurrency;
				$scope.optionsCompany = msg.data.optionsCompany;
				$scope.optionsPaymentRecordDirection = msg.data.optionsPaymentRecordDirection;
				$scope.optionsPaymentStatus = msg.data.optionsPaymentStatus;
				$scope.optionsPaymentType = msg.data.optionsPaymentType;
				$scope.action = 'create';
			});
		});

		messageHub.onDidReceiveMessage("updateEntity", function (msg) {
			$scope.$apply(function () {
				if (msg.data.entity.Date) {
					msg.data.entity.Date = new Date(msg.data.entity.Date);
				}
				if (msg.data.entity.Valor) {
					msg.data.entity.Valor = new Date(msg.data.entity.Valor);
				}
				$scope.entity = msg.data.entity;
				$scope.optionsCurrency = msg.data.optionsCurrency;
				$scope.optionsCompany = msg.data.optionsCompany;
				$scope.optionsPaymentRecordDirection = msg.data.optionsPaymentRecordDirection;
				$scope.optionsPaymentStatus = msg.data.optionsPaymentStatus;
				$scope.optionsPaymentType = msg.data.optionsPaymentType;
				$scope.action = 'update';
			});
		});

		$scope.serviceCurrency = "/services/ts/codbex-currencies/gen/codbex-currencies/api/Currencies/CurrencyService.ts";
		$scope.serviceCompany = "/services/ts/codbex-companies/gen/codbex-companies/api/Companies/CompanyService.ts";
		$scope.servicePaymentRecordDirection = "/services/ts/codbex-payments/gen/codbex-payments/api/Settings/PaymentRecordDirectionService.ts";
		$scope.servicePaymentStatus = "/services/ts/codbex-payments/gen/codbex-payments/api/Settings/PaymentStatusService.ts";
		$scope.servicePaymentType = "/services/ts/codbex-payments/gen/codbex-payments/api/Settings/PaymentTypeService.ts";

		//-----------------Events-------------------//

		$scope.create = function () {
			entityApi.create($scope.entity).then(function (response) {
				if (response.status != 201) {
					messageHub.showAlertError("PaymentRecord", `Unable to create PaymentRecord: '${response.message}'`);
					return;
				}
				messageHub.postMessage("entityCreated", response.data);
				messageHub.postMessage("clearDetails", response.data);
				messageHub.showAlertSuccess("PaymentRecord", "PaymentRecord successfully created");
			});
		};

		$scope.update = function () {
			entityApi.update($scope.entity.Id, $scope.entity).then(function (response) {
				if (response.status != 200) {
					messageHub.showAlertError("PaymentRecord", `Unable to update PaymentRecord: '${response.message}'`);
					return;
				}
				messageHub.postMessage("entityUpdated", response.data);
				messageHub.postMessage("clearDetails", response.data);
				messageHub.showAlertSuccess("PaymentRecord", "PaymentRecord successfully updated");
			});
		};

		$scope.cancel = function () {
			messageHub.postMessage("clearDetails");
		};
		
		//-----------------Dialogs-------------------//
		
		$scope.createCurrency = function () {
			messageHub.showDialogWindow("Currency-details", {
				action: "create",
				entity: {},
			}, null, false);
		};
		$scope.createCompany = function () {
			messageHub.showDialogWindow("Company-details", {
				action: "create",
				entity: {},
			}, null, false);
		};
		$scope.createPaymentRecordDirection = function () {
			messageHub.showDialogWindow("PaymentRecordDirection-details", {
				action: "create",
				entity: {},
			}, null, false);
		};
		$scope.createPaymentStatus = function () {
			messageHub.showDialogWindow("PaymentStatus-details", {
				action: "create",
				entity: {},
			}, null, false);
		};
		$scope.createPaymentType = function () {
			messageHub.showDialogWindow("PaymentType-details", {
				action: "create",
				entity: {},
			}, null, false);
		};

		//-----------------Dialogs-------------------//



		//----------------Dropdowns-----------------//

		$scope.refreshCurrency = function () {
			$scope.optionsCurrency = [];
			$http.get("/services/ts/codbex-currencies/gen/codbex-currencies/api/Currencies/CurrencyService.ts").then(function (response) {
				$scope.optionsCurrency = response.data.map(e => {
					return {
						value: e.Id,
						text: e.Code
					}
				});
			});
		};
		$scope.refreshCompany = function () {
			$scope.optionsCompany = [];
			$http.get("/services/ts/codbex-companies/gen/codbex-companies/api/Companies/CompanyService.ts").then(function (response) {
				$scope.optionsCompany = response.data.map(e => {
					return {
						value: e.Id,
						text: e.Name
					}
				});
			});
		};
		$scope.refreshPaymentRecordDirection = function () {
			$scope.optionsPaymentRecordDirection = [];
			$http.get("/services/ts/codbex-payments/gen/codbex-payments/api/Settings/PaymentRecordDirectionService.ts").then(function (response) {
				$scope.optionsPaymentRecordDirection = response.data.map(e => {
					return {
						value: e.Id,
						text: e.Name
					}
				});
			});
		};
		$scope.refreshPaymentStatus = function () {
			$scope.optionsPaymentStatus = [];
			$http.get("/services/ts/codbex-payments/gen/codbex-payments/api/Settings/PaymentStatusService.ts").then(function (response) {
				$scope.optionsPaymentStatus = response.data.map(e => {
					return {
						value: e.Id,
						text: e.Name
					}
				});
			});
		};
		$scope.refreshPaymentType = function () {
			$scope.optionsPaymentType = [];
			$http.get("/services/ts/codbex-payments/gen/codbex-payments/api/Settings/PaymentTypeService.ts").then(function (response) {
				$scope.optionsPaymentType = response.data.map(e => {
					return {
						value: e.Id,
						text: e.Name
					}
				});
			});
		};

		//----------------Dropdowns-----------------//	
		

	}]);