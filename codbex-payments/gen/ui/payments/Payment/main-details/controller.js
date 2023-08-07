angular.module('page', ["ideUI", "ideView", "entityApi"])
	.config(["messageHubProvider", function (messageHubProvider) {
		messageHubProvider.eventIdPrefix = 'codbex-payments.payments.Payment';
	}])
	.config(["entityApiProvider", function (entityApiProvider) {
		entityApiProvider.baseUrl = "/services/js/codbex-payments/gen/api/payments/Payment.js";
	}])
	.controller('PageController', ['$scope', 'messageHub', 'entityApi', function ($scope, messageHub, entityApi) {

		$scope.entity = {};
		$scope.formHeaders = {
			select: "Payment Details",
			create: "Create Payment",
			update: "Update Payment"
		};
		$scope.formErrors = {};
		$scope.action = 'select';

		//-----------------Events-------------------//
		messageHub.onDidReceiveMessage("clearDetails", function (msg) {
			$scope.$apply(function () {
				$scope.entity = {};
				$scope.formErrors = {};
				$scope.optionsOperator = [];
				$scope.optionsReceiver = [];
				$scope.optionsSender = [];
				$scope.optionsType = [];
				$scope.optionsCurrency = [];
				$scope.action = 'select';
			});
		});

		messageHub.onDidReceiveMessage("entitySelected", function (msg) {
			$scope.$apply(function () {
				if (msg.data.entity.Date) {
					msg.data.entity.Date = new Date(msg.data.entity.Date);
				}
				if (msg.data.entity.ValueDate) {
					msg.data.entity.ValueDate = new Date(msg.data.entity.ValueDate);
				}
				$scope.entity = msg.data.entity;
				$scope.optionsOperator = msg.data.optionsOperator;
				$scope.optionsReceiver = msg.data.optionsReceiver;
				$scope.optionsSender = msg.data.optionsSender;
				$scope.optionsType = msg.data.optionsType;
				$scope.optionsCurrency = msg.data.optionsCurrency;
				$scope.action = 'select';
			});
		});

		messageHub.onDidReceiveMessage("createEntity", function (msg) {
			$scope.$apply(function () {
				$scope.entity = {};
				$scope.optionsOperator = msg.data.optionsOperator;
				$scope.optionsReceiver = msg.data.optionsReceiver;
				$scope.optionsSender = msg.data.optionsSender;
				$scope.optionsType = msg.data.optionsType;
				$scope.optionsCurrency = msg.data.optionsCurrency;
				$scope.action = 'create';
				// Set Errors for required fields only
				$scope.formErrors = {
				};
			});
		});

		messageHub.onDidReceiveMessage("updateEntity", function (msg) {
			$scope.$apply(function () {
				if (msg.data.entity.Date) {
					msg.data.entity.Date = new Date(msg.data.entity.Date);
				}
				if (msg.data.entity.ValueDate) {
					msg.data.entity.ValueDate = new Date(msg.data.entity.ValueDate);
				}
				$scope.entity = msg.data.entity;
				$scope.optionsOperator = msg.data.optionsOperator;
				$scope.optionsReceiver = msg.data.optionsReceiver;
				$scope.optionsSender = msg.data.optionsSender;
				$scope.optionsType = msg.data.optionsType;
				$scope.optionsCurrency = msg.data.optionsCurrency;
				$scope.action = 'update';
			});
		});
		//-----------------Events-------------------//

		$scope.isValid = function (isValid, property) {
			$scope.formErrors[property] = !isValid ? true : undefined;
			for (let next in $scope.formErrors) {
				if ($scope.formErrors[next] === true) {
					$scope.isFormValid = false;
					return;
				}
			}
			$scope.isFormValid = true;
		};

		$scope.create = function () {
			entityApi.create($scope.entity).then(function (response) {
				if (response.status != 201) {
					messageHub.showAlertError("Payment", `Unable to create Payment: '${response.message}'`);
					return;
				}
				messageHub.postMessage("entityCreated", response.data);
				messageHub.postMessage("clearDetails", response.data);
				messageHub.showAlertSuccess("Payment", "Payment successfully created");
			});
		};

		$scope.update = function () {
			entityApi.update($scope.entity.Id, $scope.entity).then(function (response) {
				if (response.status != 200) {
					messageHub.showAlertError("Payment", `Unable to update Payment: '${response.message}'`);
					return;
				}
				messageHub.postMessage("entityUpdated", response.data);
				messageHub.postMessage("clearDetails", response.data);
				messageHub.showAlertSuccess("Payment", "Payment successfully updated");
			});
		};

		$scope.cancel = function () {
			messageHub.postMessage("clearDetails");
		};

	}]);