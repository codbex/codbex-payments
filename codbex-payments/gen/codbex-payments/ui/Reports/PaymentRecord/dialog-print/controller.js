angular.module('page', ['blimpKit', 'platformView', 'EntityService'])
    .config(['EntityServiceProvider', (EntityServiceProvider) => {
        EntityServiceProvider.baseUrl = '/services/ts/codbex-payments/gen/codbex-payments/api/PaymentRecord/PaymentRecordService.ts';
    }])
    .controller('PageController', ($scope, EntityService, ViewParameters) => {
        const Dialogs = new DialogHub();
		let params = ViewParameters.get();
		if (Object.keys(params).length) {         
            const filterEntity = params.filterEntity ?? {};

			const filter = {
				$filter: {
					equals: {},
					notEquals: {},
					contains: {},
					greaterThan: {},
					greaterThanOrEqual: {},
					lessThan: {},
					lessThanOrEqual: {}
				},
			};
			if (filterEntity.Id) {
				filter.$filter.equals.Id = filterEntity.Id;
			}
			if (filterEntity.DateFrom) {
				filter.$filter.greaterThanOrEqual.Date = filterEntity.DateFrom;
			}
			if (filterEntity.DateTo) {
				filter.$filter.lessThanOrEqual.Date = filterEntity.DateTo;
			}
			if (filterEntity.ValorFrom) {
				filter.$filter.greaterThanOrEqual.Valor = filterEntity.ValorFrom;
			}
			if (filterEntity.ValorTo) {
				filter.$filter.lessThanOrEqual.Valor = filterEntity.ValorTo;
			}
			if (filterEntity.CompanyIBAN) {
				filter.$filter.contains.CompanyIBAN = filterEntity.CompanyIBAN;
			}
			if (filterEntity.CounterpartyIBAN) {
				filter.$filter.contains.CounterpartyIBAN = filterEntity.CounterpartyIBAN;
			}
			if (filterEntity.CounterpartyName) {
				filter.$filter.contains.CounterpartyName = filterEntity.CounterpartyName;
			}
			if (filterEntity.Amount) {
				filter.$filter.equals.Amount = filterEntity.Amount;
			}
			if (filterEntity.Currency) {
				filter.$filter.equals.Currency = filterEntity.Currency;
			}
			if (filterEntity.Reason) {
				filter.$filter.contains.Reason = filterEntity.Reason;
			}
			if (filterEntity.Description) {
				filter.$filter.contains.Description = filterEntity.Description;
			}
			if (filterEntity.Company) {
				filter.$filter.equals.Company = filterEntity.Company;
			}
			if (filterEntity.PaymentRecordDirection) {
				filter.$filter.equals.PaymentRecordDirection = filterEntity.PaymentRecordDirection;
			}
			if (filterEntity.PaymentStatus) {
				filter.$filter.equals.PaymentStatus = filterEntity.PaymentStatus;
			}
			if (filterEntity.PaymentType) {
				filter.$filter.equals.PaymentType = filterEntity.PaymentType;
			}
			if (filterEntity.UUID) {
				filter.$filter.contains.UUID = filterEntity.UUID;
			}
			if (filterEntity.Reference) {
				filter.$filter.contains.Reference = filterEntity.Reference;
			}
			if (filterEntity.Deleted) {
				filter.$filter.equals.Deleted = filterEntity.Deleted;
			}

            $scope.filter = filter;

			$scope.optionsCurrency = params.optionsCurrency;
			$scope.optionsCompany = params.optionsCompany;
			$scope.optionsPaymentRecordDirection = params.optionsPaymentRecordDirection;
			$scope.optionsPaymentStatus = params.optionsPaymentStatus;
			$scope.optionsPaymentType = params.optionsPaymentType;
		}

        $scope.loadPage = (filter) => {
            if (!filter && $scope.filter) {
                filter = $scope.filter;
            }
            let request;
            if (filter) {
                request = EntityService.search(filter);
            } else {
                request = EntityService.list();
            }
            request.then((response) => {
					response.data.forEach(e => {
						if (e.Date) {
							e.Date = new Date(e.Date);
						}
						if (e.Valor) {
							e.Valor = new Date(e.Valor);
						}
					});

                $scope.data = response.data;
                setTimeout(() => {
                    window.print();
                }, 250);
            }, (error) => {
				const message = error.data ? error.data.message : '';
				Dialogs.showAlert({
					title: 'PaymentRecord',
					message: `Unable to list/filter PaymentRecord: '${message}'`,
					type: AlertTypes.Error
				});
				console.error('EntityService:', error);
			});
        };
        $scope.loadPage($scope.filter);

		$scope.optionsCurrencyValue = (optionKey) => {
			for (let i = 0; i < $scope.optionsCurrency.length; i++) {
				if ($scope.optionsCurrency[i].value === optionKey) {
					return $scope.optionsCurrency[i].text;
				}
			}
			return null;
		};
		$scope.optionsCompanyValue = (optionKey) => {
			for (let i = 0; i < $scope.optionsCompany.length; i++) {
				if ($scope.optionsCompany[i].value === optionKey) {
					return $scope.optionsCompany[i].text;
				}
			}
			return null;
		};
		$scope.optionsPaymentRecordDirectionValue = (optionKey) => {
			for (let i = 0; i < $scope.optionsPaymentRecordDirection.length; i++) {
				if ($scope.optionsPaymentRecordDirection[i].value === optionKey) {
					return $scope.optionsPaymentRecordDirection[i].text;
				}
			}
			return null;
		};
		$scope.optionsPaymentStatusValue = (optionKey) => {
			for (let i = 0; i < $scope.optionsPaymentStatus.length; i++) {
				if ($scope.optionsPaymentStatus[i].value === optionKey) {
					return $scope.optionsPaymentStatus[i].text;
				}
			}
			return null;
		};
		$scope.optionsPaymentTypeValue = (optionKey) => {
			for (let i = 0; i < $scope.optionsPaymentType.length; i++) {
				if ($scope.optionsPaymentType[i].value === optionKey) {
					return $scope.optionsPaymentType[i].text;
				}
			}
			return null;
		};
        window.onafterprint = () => {
            Dialogs.closeWindow({ path: viewData.path });
        }
    });