angular.module('page', ["ideUI", "ideView", "entityApi"])
	.config(["messageHubProvider", function (messageHubProvider) {
		messageHubProvider.eventIdPrefix = 'codbex-payments.payments.Payment';
	}])
	.config(["entityApiProvider", function (entityApiProvider) {
		entityApiProvider.baseUrl = "/services/js/codbex-payments/gen/api/payments/Payment.js";
	}])
	.controller('PageController', ['$scope', '$http', 'messageHub', 'entityApi', function ($scope, $http, messageHub, entityApi) {

		$scope.dataPage = 1;
		$scope.dataCount = 0;
		$scope.dataOffset = 0;
		$scope.dataLimit = 10;
		$scope.action = "select";

		function refreshData() {
			$scope.dataReset = true;
			$scope.dataPage--;
		}

		//-----------------Events-------------------//
		messageHub.onDidReceiveMessage("clearDetails", function (msg) {
			$scope.$apply(function () {
				$scope.selectedEntity = null;
				$scope.action = "select";
			});
		});

		messageHub.onDidReceiveMessage("entityCreated", function (msg) {
			refreshData();
			$scope.loadPage();
		});

		messageHub.onDidReceiveMessage("entityUpdated", function (msg) {
			refreshData();
			$scope.loadPage();
		});
		//-----------------Events-------------------//

		$scope.loadPage = function () {
			$scope.selectedEntity = null;
			entityApi.count().then(function (response) {
				if (response.status != 200) {
					messageHub.showAlertError("Payment", `Unable to count Payment: '${response.message}'`);
					return;
				}
				$scope.dataCount = response.data;
				$scope.dataPages = Math.ceil($scope.dataCount / $scope.dataLimit);
				let offset = ($scope.dataPage - 1) * $scope.dataLimit;
				let limit = $scope.dataLimit;
				if ($scope.dataReset) {
					offset = 0;
					limit = $scope.dataPage * $scope.dataLimit;
				}
				entityApi.list(offset, limit).then(function (response) {
					if (response.status != 200) {
						messageHub.showAlertError("Payment", `Unable to list Payment: '${response.message}'`);
						return;
					}
					if ($scope.data == null || $scope.dataReset) {
						$scope.data = [];
						$scope.dataReset = false;
					}

					response.data.forEach(e => {
						if (e.Date) {
							e.Date = new Date(e.Date);
						}
						if (e.ValueDate) {
							e.ValueDate = new Date(e.ValueDate);
						}
					});

					$scope.data = $scope.data.concat(response.data);
					$scope.dataPage++;
				});
			});
		};
		$scope.loadPage($scope.dataPage);

		$scope.selectEntity = function (entity) {
			$scope.selectedEntity = entity;
			messageHub.postMessage("entitySelected", {
				entity: entity,
				selectedMainEntityId: entity.Id,
				optionsOperator: $scope.optionsOperator,
				optionsReceiver: $scope.optionsReceiver,
				optionsSender: $scope.optionsSender,
				optionsType: $scope.optionsType,
				optionsCurrency: $scope.optionsCurrency,
			});
		};

		$scope.createEntity = function () {
			$scope.selectedEntity = null;
			$scope.action = "create";

			messageHub.postMessage("createEntity", {
				entity: {},
				optionsOperator: $scope.optionsOperator,
				optionsReceiver: $scope.optionsReceiver,
				optionsSender: $scope.optionsSender,
				optionsType: $scope.optionsType,
				optionsCurrency: $scope.optionsCurrency,
			});
		};

		$scope.updateEntity = function () {
			$scope.action = "update";
			messageHub.postMessage("updateEntity", {
				entity: $scope.selectedEntity,
				optionsOperator: $scope.optionsOperator,
				optionsReceiver: $scope.optionsReceiver,
				optionsSender: $scope.optionsSender,
				optionsType: $scope.optionsType,
				optionsCurrency: $scope.optionsCurrency,
			});
		};

		$scope.deleteEntity = function () {
			let id = $scope.selectedEntity.Id;
			messageHub.showDialogAsync(
				'Delete Payment?',
				`Are you sure you want to delete Payment? This action cannot be undone.`,
				[{
					id: "delete-btn-yes",
					type: "emphasized",
					label: "Yes",
				},
				{
					id: "delete-btn-no",
					type: "normal",
					label: "No",
				}],
			).then(function (msg) {
				if (msg.data === "delete-btn-yes") {
					entityApi.delete(id).then(function (response) {
						if (response.status != 204) {
							messageHub.showAlertError("Payment", `Unable to delete Payment: '${response.message}'`);
							return;
						}
						refreshData();
						$scope.loadPage($scope.dataPage);
						messageHub.postMessage("clearDetails");
					});
				}
			});
		};

		//----------------Dropdowns-----------------//
		$scope.optionsOperator = [];
		$scope.optionsReceiver = [];
		$scope.optionsSender = [];
		$scope.optionsType = [];
		$scope.optionsCurrency = [];

		$http.get("/services/js/codbex-payments/gen/api/entities/Employee.js").then(function (response) {
			$scope.optionsOperator = response.data.map(e => {
				return {
					value: e.Id,
					text: e.Name
				}
			});
		});

		$http.get("/services/js/codbex-payments/gen/api/entities/Partner.js").then(function (response) {
			$scope.optionsReceiver = response.data.map(e => {
				return {
					value: e.Id,
					text: e.Name
				}
			});
		});

		$http.get("/services/js/codbex-payments/gen/api/entities/Partner.js").then(function (response) {
			$scope.optionsSender = response.data.map(e => {
				return {
					value: e.Id,
					text: e.Name
				}
			});
		});

		$http.get("/services/js/codbex-payments/gen/api/settings/PaymentType.js").then(function (response) {
			$scope.optionsType = response.data.map(e => {
				return {
					value: e.Id,
					text: e.Name
				}
			});
		});

		$http.get("/services/js/codbex-payments/gen/api/entities/Currency.js").then(function (response) {
			$scope.optionsCurrency = response.data.map(e => {
				return {
					value: e.Code,
					text: e.Code
				}
			});
		});
		$scope.optionsOperatorValue = function (optionKey) {
			for (let i = 0; i < $scope.optionsOperator.length; i++) {
				if ($scope.optionsOperator[i].value === optionKey) {
					return $scope.optionsOperator[i].text;
				}
			}
			return null;
		};
		$scope.optionsReceiverValue = function (optionKey) {
			for (let i = 0; i < $scope.optionsReceiver.length; i++) {
				if ($scope.optionsReceiver[i].value === optionKey) {
					return $scope.optionsReceiver[i].text;
				}
			}
			return null;
		};
		$scope.optionsSenderValue = function (optionKey) {
			for (let i = 0; i < $scope.optionsSender.length; i++) {
				if ($scope.optionsSender[i].value === optionKey) {
					return $scope.optionsSender[i].text;
				}
			}
			return null;
		};
		$scope.optionsTypeValue = function (optionKey) {
			for (let i = 0; i < $scope.optionsType.length; i++) {
				if ($scope.optionsType[i].value === optionKey) {
					return $scope.optionsType[i].text;
				}
			}
			return null;
		};
		$scope.optionsCurrencyValue = function (optionKey) {
			for (let i = 0; i < $scope.optionsCurrency.length; i++) {
				if ($scope.optionsCurrency[i].value === optionKey) {
					return $scope.optionsCurrency[i].text;
				}
			}
			return null;
		};
		//----------------Dropdowns-----------------//

	}]);
