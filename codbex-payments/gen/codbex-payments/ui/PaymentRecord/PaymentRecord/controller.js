angular.module('page', ["ideUI", "ideView", "entityApi"])
	.config(["messageHubProvider", function (messageHubProvider) {
		messageHubProvider.eventIdPrefix = 'codbex-payments.PaymentRecord.PaymentRecord';
	}])
	.config(["entityApiProvider", function (entityApiProvider) {
		entityApiProvider.baseUrl = "/services/ts/codbex-payments/gen/codbex-payments/api/PaymentRecord/PaymentRecordService.ts";
	}])
	.controller('PageController', ['$scope', '$http', 'messageHub', 'entityApi', 'Extensions', function ($scope, $http, messageHub, entityApi, Extensions) {

		$scope.dataPage = 1;
		$scope.dataCount = 0;
		$scope.dataLimit = 20;

		//-----------------Custom Actions-------------------//
		Extensions.get('dialogWindow', 'codbex-payments-custom-action').then(function (response) {
			$scope.pageActions = response.filter(e => e.perspective === "PaymentRecord" && e.view === "PaymentRecord" && (e.type === "page" || e.type === undefined));
			$scope.entityActions = response.filter(e => e.perspective === "PaymentRecord" && e.view === "PaymentRecord" && e.type === "entity");
		});

		$scope.triggerPageAction = function (action) {
			messageHub.showDialogWindow(
				action.id,
				{},
				null,
				true,
				action
			);
		};

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

		function resetPagination() {
			$scope.dataPage = 1;
			$scope.dataCount = 0;
			$scope.dataLimit = 20;
		}
		resetPagination();

		//-----------------Events-------------------//
		messageHub.onDidReceiveMessage("entityCreated", function (msg) {
			$scope.loadPage($scope.dataPage, $scope.filter);
		});

		messageHub.onDidReceiveMessage("entityUpdated", function (msg) {
			$scope.loadPage($scope.dataPage, $scope.filter);
		});

		messageHub.onDidReceiveMessage("entitySearch", function (msg) {
			resetPagination();
			$scope.filter = msg.data.filter;
			$scope.filterEntity = msg.data.entity;
			$scope.loadPage($scope.dataPage, $scope.filter);
		});
		//-----------------Events-------------------//

		$scope.loadPage = function (pageNumber, filter) {
			if (!filter && $scope.filter) {
				filter = $scope.filter;
			}
			$scope.dataPage = pageNumber;
			entityApi.count(filter).then(function (response) {
				if (response.status != 200) {
					messageHub.showAlertError("PaymentRecord", `Unable to count PaymentRecord: '${response.message}'`);
					return;
				}
				if (response.data) {
					$scope.dataCount = response.data;
				}
				let offset = (pageNumber - 1) * $scope.dataLimit;
				let limit = $scope.dataLimit;
				let request;
				if (filter) {
					filter.$offset = offset;
					filter.$limit = limit;
					request = entityApi.search(filter);
				} else {
					request = entityApi.list(offset, limit);
				}
				request.then(function (response) {
					if (response.status != 200) {
						messageHub.showAlertError("PaymentRecord", `Unable to list/filter PaymentRecord: '${response.message}'`);
						return;
					}

					response.data.forEach(e => {
						if (e.Date) {
							e.Date = new Date(e.Date);
						}
						if (e.Valor) {
							e.Valor = new Date(e.Valor);
						}
					});

					$scope.data = response.data;
				});
			});
		};
		$scope.loadPage($scope.dataPage, $scope.filter);

		$scope.selectEntity = function (entity) {
			$scope.selectedEntity = entity;
		};

		$scope.openDetails = function (entity) {
			$scope.selectedEntity = entity;
			messageHub.showDialogWindow("PaymentRecord-details", {
				action: "select",
				entity: entity,
				optionsCurrency: $scope.optionsCurrency,
				optionsCompany: $scope.optionsCompany,
				optionsPaymentRecordDirection: $scope.optionsPaymentRecordDirection,
				optionsPaymentStatus: $scope.optionsPaymentStatus,
				optionsPaymentType: $scope.optionsPaymentType,
			});
		};

		$scope.openFilter = function (entity) {
			messageHub.showDialogWindow("PaymentRecord-filter", {
				entity: $scope.filterEntity,
				optionsCurrency: $scope.optionsCurrency,
				optionsCompany: $scope.optionsCompany,
				optionsPaymentRecordDirection: $scope.optionsPaymentRecordDirection,
				optionsPaymentStatus: $scope.optionsPaymentStatus,
				optionsPaymentType: $scope.optionsPaymentType,
			});
		};

		$scope.createEntity = function () {
			$scope.selectedEntity = null;
			messageHub.showDialogWindow("PaymentRecord-details", {
				action: "create",
				entity: {},
				optionsCurrency: $scope.optionsCurrency,
				optionsCompany: $scope.optionsCompany,
				optionsPaymentRecordDirection: $scope.optionsPaymentRecordDirection,
				optionsPaymentStatus: $scope.optionsPaymentStatus,
				optionsPaymentType: $scope.optionsPaymentType,
			}, null, false);
		};

		$scope.updateEntity = function (entity) {
			messageHub.showDialogWindow("PaymentRecord-details", {
				action: "update",
				entity: entity,
				optionsCurrency: $scope.optionsCurrency,
				optionsCompany: $scope.optionsCompany,
				optionsPaymentRecordDirection: $scope.optionsPaymentRecordDirection,
				optionsPaymentStatus: $scope.optionsPaymentStatus,
				optionsPaymentType: $scope.optionsPaymentType,
			}, null, false);
		};

		$scope.deleteEntity = function (entity) {
			let id = entity.Id;
			messageHub.showDialogAsync(
				'Delete PaymentRecord?',
				`Are you sure you want to delete PaymentRecord? This action cannot be undone.`,
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
							messageHub.showAlertError("PaymentRecord", `Unable to delete PaymentRecord: '${response.message}'`);
							return;
						}
						$scope.loadPage($scope.dataPage, $scope.filter);
						messageHub.postMessage("clearDetails");
					});
				}
			});
		};

		//----------------Dropdowns-----------------//
		$scope.optionsCurrency = [];
		$scope.optionsCompany = [];
		$scope.optionsPaymentRecordDirection = [];
		$scope.optionsPaymentStatus = [];
		$scope.optionsPaymentType = [];


		$http.get("/services/ts/codbex-currencies/gen/codbex-currencies/api/Currencies/CurrencyService.ts").then(function (response) {
			$scope.optionsCurrency = response.data.map(e => {
				return {
					value: e.Id,
					text: e.Code
				}
			});
		});

		$http.get("/services/ts/codbex-companies/gen/codbex-companies/api/Companies/CompanyService.ts").then(function (response) {
			$scope.optionsCompany = response.data.map(e => {
				return {
					value: e.Id,
					text: e.Name
				}
			});
		});

		$http.get("/services/ts/codbex-payments/gen/codbex-payments/api/Settings/PaymentRecordDirectionService.ts").then(function (response) {
			$scope.optionsPaymentRecordDirection = response.data.map(e => {
				return {
					value: e.Id,
					text: e.Name
				}
			});
		});

		$http.get("/services/ts/codbex-payments/gen/codbex-payments/api/Settings/PaymentStatusService.ts").then(function (response) {
			$scope.optionsPaymentStatus = response.data.map(e => {
				return {
					value: e.Id,
					text: e.Name
				}
			});
		});

		$http.get("/services/ts/codbex-payments/gen/codbex-payments/api/Settings/PaymentTypeService.ts").then(function (response) {
			$scope.optionsPaymentType = response.data.map(e => {
				return {
					value: e.Id,
					text: e.Name
				}
			});
		});

		$scope.optionsCurrencyValue = function (optionKey) {
			for (let i = 0; i < $scope.optionsCurrency.length; i++) {
				if ($scope.optionsCurrency[i].value === optionKey) {
					return $scope.optionsCurrency[i].text;
				}
			}
			return null;
		};
		$scope.optionsCompanyValue = function (optionKey) {
			for (let i = 0; i < $scope.optionsCompany.length; i++) {
				if ($scope.optionsCompany[i].value === optionKey) {
					return $scope.optionsCompany[i].text;
				}
			}
			return null;
		};
		$scope.optionsPaymentRecordDirectionValue = function (optionKey) {
			for (let i = 0; i < $scope.optionsPaymentRecordDirection.length; i++) {
				if ($scope.optionsPaymentRecordDirection[i].value === optionKey) {
					return $scope.optionsPaymentRecordDirection[i].text;
				}
			}
			return null;
		};
		$scope.optionsPaymentStatusValue = function (optionKey) {
			for (let i = 0; i < $scope.optionsPaymentStatus.length; i++) {
				if ($scope.optionsPaymentStatus[i].value === optionKey) {
					return $scope.optionsPaymentStatus[i].text;
				}
			}
			return null;
		};
		$scope.optionsPaymentTypeValue = function (optionKey) {
			for (let i = 0; i < $scope.optionsPaymentType.length; i++) {
				if ($scope.optionsPaymentType[i].value === optionKey) {
					return $scope.optionsPaymentType[i].text;
				}
			}
			return null;
		};
		//----------------Dropdowns-----------------//

	}]);
