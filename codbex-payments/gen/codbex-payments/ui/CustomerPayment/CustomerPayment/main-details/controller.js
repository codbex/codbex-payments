angular.module('page', ["ideUI", "ideView", "entityApi"])
	.config(["messageHubProvider", function (messageHubProvider) {
		messageHubProvider.eventIdPrefix = 'codbex-payments.CustomerPayment.CustomerPayment';
	}])
	.config(["entityApiProvider", function (entityApiProvider) {
		entityApiProvider.baseUrl = "/services/ts/codbex-payments/gen/codbex-payments/api/CustomerPayment/CustomerPaymentService.ts";
	}])
	.controller('PageController', ['$scope',  '$http', 'Extensions', 'messageHub', 'entityApi', function ($scope,  $http, Extensions, messageHub, entityApi) {

		$scope.entity = {};
		$scope.forms = {
			details: {},
		};
		$scope.formHeaders = {
			select: "CustomerPayment Details",
			create: "Create CustomerPayment",
			update: "Update CustomerPayment"
		};
		$scope.action = 'select';

		//-----------------Custom Actions-------------------//
		Extensions.get('dialogWindow', 'codbex-payments-custom-action').then(function (response) {
			$scope.entityActions = response.filter(e => e.perspective === "CustomerPayment" && e.view === "CustomerPayment" && e.type === "entity");
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
				$scope.optionsCustomer = [];
				$scope.optionsCurrency = [];
				$scope.optionsCompany = [];
				$scope.optionsPaymentMethod = [];
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
				$scope.optionsCustomer = msg.data.optionsCustomer;
				$scope.optionsCurrency = msg.data.optionsCurrency;
				$scope.optionsCompany = msg.data.optionsCompany;
				$scope.optionsPaymentMethod = msg.data.optionsPaymentMethod;
				$scope.action = 'select';
			});
		});

		messageHub.onDidReceiveMessage("createEntity", function (msg) {
			$scope.$apply(function () {
				$scope.entity = {};
				$scope.optionsCustomer = msg.data.optionsCustomer;
				$scope.optionsCurrency = msg.data.optionsCurrency;
				$scope.optionsCompany = msg.data.optionsCompany;
				$scope.optionsPaymentMethod = msg.data.optionsPaymentMethod;
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
				$scope.optionsCustomer = msg.data.optionsCustomer;
				$scope.optionsCurrency = msg.data.optionsCurrency;
				$scope.optionsCompany = msg.data.optionsCompany;
				$scope.optionsPaymentMethod = msg.data.optionsPaymentMethod;
				$scope.action = 'update';
			});
		});

		$scope.serviceCustomer = "/services/ts/codbex-partners/gen/codbex-partners/api/Customers/CustomerService.ts";
		$scope.serviceCurrency = "/services/ts/codbex-currencies/gen/codbex-currencies/api/Currencies/CurrencyService.ts";
		$scope.serviceCompany = "/services/ts/codbex-companies/gen/codbex-companies/api/Companies/CompanyService.ts";
		$scope.servicePaymentMethod = "/services/ts/codbex-methods/gen/codbex-methods/api/Methods/PaymentMethodService.ts";

		//-----------------Events-------------------//

		$scope.create = function () {
			entityApi.create($scope.entity).then(function (response) {
				if (response.status != 201) {
					messageHub.showAlertError("CustomerPayment", `Unable to create CustomerPayment: '${response.message}'`);
					return;
				}
				messageHub.postMessage("entityCreated", response.data);
				messageHub.postMessage("clearDetails", response.data);
				messageHub.showAlertSuccess("CustomerPayment", "CustomerPayment successfully created");
			});
		};

		$scope.update = function () {
			entityApi.update($scope.entity.Id, $scope.entity).then(function (response) {
				if (response.status != 200) {
					messageHub.showAlertError("CustomerPayment", `Unable to update CustomerPayment: '${response.message}'`);
					return;
				}
				messageHub.postMessage("entityUpdated", response.data);
				messageHub.postMessage("clearDetails", response.data);
				messageHub.showAlertSuccess("CustomerPayment", "CustomerPayment successfully updated");
			});
		};

		$scope.cancel = function () {
			messageHub.postMessage("clearDetails");
		};
		
		//-----------------Dialogs-------------------//
		
		$scope.createCustomer = function () {
			messageHub.showDialogWindow("Customer-details", {
				action: "create",
				entity: {},
			}, null, false);
		};
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
		$scope.createPaymentMethod = function () {
			messageHub.showDialogWindow("PaymentMethod-details", {
				action: "create",
				entity: {},
			}, null, false);
		};

		//-----------------Dialogs-------------------//



		//----------------Dropdowns-----------------//

		$scope.refreshCustomer = function () {
			$scope.optionsCustomer = [];
			$http.get("/services/ts/codbex-partners/gen/codbex-partners/api/Customers/CustomerService.ts").then(function (response) {
				$scope.optionsCustomer = response.data.map(e => {
					return {
						value: e.Id,
						text: e.Name
					}
				});
			});
		};
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
		$scope.refreshPaymentMethod = function () {
			$scope.optionsPaymentMethod = [];
			$http.get("/services/ts/codbex-methods/gen/codbex-methods/api/Methods/PaymentMethodService.ts").then(function (response) {
				$scope.optionsPaymentMethod = response.data.map(e => {
					return {
						value: e.Id,
						text: e.Name
					}
				});
			});
		};

		//----------------Dropdowns-----------------//	
		

	}]);