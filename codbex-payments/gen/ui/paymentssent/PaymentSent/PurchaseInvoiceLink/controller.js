angular.module('page', ["ideUI", "ideView", "entityApi"])
	.config(["messageHubProvider", function (messageHubProvider) {
		messageHubProvider.eventIdPrefix = 'codbex-payments.paymentssent.PurchaseInvoiceLink';
	}])
	.config(["entityApiProvider", function (entityApiProvider) {
		entityApiProvider.baseUrl = "/services/js/codbex-payments/gen/api/paymentssent/PurchaseInvoiceLink.js";
	}])
	.controller('PageController', ['$scope', '$http', 'messageHub', 'entityApi', function ($scope, $http, messageHub, entityApi) {

		function resetPagination() {
			$scope.dataPage = 1;
			$scope.dataCount = 0;
			$scope.dataLimit = 10;
		}
		resetPagination();

		//-----------------Events-------------------//
		messageHub.onDidReceiveMessage("codbex-payments.paymentssent.PaymentSent.entitySelected", function (msg) {
			resetPagination();
			$scope.selectedMainEntityId = msg.data.selectedMainEntityId;
			$scope.loadPage($scope.dataPage);
		}, true);

		messageHub.onDidReceiveMessage("codbex-payments.paymentssent.PaymentSent.clearDetails", function (msg) {
			$scope.$apply(function () {
				resetPagination();
				$scope.selectedMainEntityId = null;
				$scope.data = null;
			});
		}, true);

		messageHub.onDidReceiveMessage("clearDetails", function (msg) {
			$scope.$apply(function () {
				$scope.entity = {};
				$scope.action = 'select';
			});
		});

		messageHub.onDidReceiveMessage("entityCreated", function (msg) {
			$scope.loadPage($scope.dataPage);
		});

		messageHub.onDidReceiveMessage("entityUpdated", function (msg) {
			$scope.loadPage($scope.dataPage);
		});
		//-----------------Events-------------------//

		$scope.loadPage = function (pageNumber) {
			let Payment = $scope.selectedMainEntityId;
			$scope.dataPage = pageNumber;
			entityApi.count(Payment).then(function (response) {
				if (response.status != 200) {
					messageHub.showAlertError("PurchaseInvoiceLink", `Unable to count PurchaseInvoiceLink: '${response.message}'`);
					return;
				}
				$scope.dataCount = response.data;
				let query = `Payment=${Payment}`;
				let offset = (pageNumber - 1) * $scope.dataLimit;
				let limit = $scope.dataLimit;
				entityApi.filter(query, offset, limit).then(function (response) {
					if (response.status != 200) {
						messageHub.showAlertError("PurchaseInvoiceLink", `Unable to list PurchaseInvoiceLink: '${response.message}'`);
						return;
					}
					$scope.data = response.data;
				});
			});
		};

		$scope.selectEntity = function (entity) {
			$scope.selectedEntity = entity;
		};

		$scope.openDetails = function (entity) {
			$scope.selectedEntity = entity;
			messageHub.showDialogWindow("PurchaseInvoiceLink-details", {
				action: "select",
				entity: entity,
				optionsPurchaseInvoice: $scope.optionsPurchaseInvoice,
			});
		};

		$scope.createEntity = function () {
			$scope.selectedEntity = null;
			messageHub.showDialogWindow("PurchaseInvoiceLink-details", {
				action: "create",
				entity: {},
				selectedMainEntityKey: "Payment",
				selectedMainEntityId: $scope.selectedMainEntityId,
				optionsPurchaseInvoice: $scope.optionsPurchaseInvoice,
			}, null, false);
		};

		$scope.updateEntity = function (entity) {
			messageHub.showDialogWindow("PurchaseInvoiceLink-details", {
				action: "update",
				entity: entity,
				selectedMainEntityKey: "Payment",
				selectedMainEntityId: $scope.selectedMainEntityId,
				optionsPurchaseInvoice: $scope.optionsPurchaseInvoice,
			}, null, false);
		};

		$scope.deleteEntity = function (entity) {
			let id = entity.Id;
			messageHub.showDialogAsync(
				'Delete PurchaseInvoiceLink?',
				`Are you sure you want to delete PurchaseInvoiceLink? This action cannot be undone.`,
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
							messageHub.showAlertError("PurchaseInvoiceLink", `Unable to delete PurchaseInvoiceLink: '${response.message}'`);
							return;
						}
						$scope.loadPage($scope.dataPage);
						messageHub.postMessage("clearDetails");
					});
				}
			});
		};

		//----------------Dropdowns-----------------//
		$scope.optionsPurchaseInvoice = [];

		$http.get("/services/js/codbex-payments/gen/api/purchaseinvoice/PurchaseInvoice.js").then(function (response) {
			$scope.optionsPurchaseInvoice = response.data.map(e => {
				return {
					value: e.Id,
					text: e.Name
				}
			});
		});
		$scope.optionsPurchaseInvoiceValue = function (optionKey) {
			for (let i = 0; i < $scope.optionsPurchaseInvoice.length; i++) {
				if ($scope.optionsPurchaseInvoice[i].value === optionKey) {
					return $scope.optionsPurchaseInvoice[i].text;
				}
			}
			return null;
		};
		//----------------Dropdowns-----------------//

	}]);
