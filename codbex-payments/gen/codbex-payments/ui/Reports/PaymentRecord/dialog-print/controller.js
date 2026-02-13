angular.module('page', ['blimpKit', 'platformView', 'platformLocale', 'EntityService'])
    .config(['EntityServiceProvider', (EntityServiceProvider) => {
        EntityServiceProvider.baseUrl = '/services/ts/codbex-payments/gen/codbex-payments/api/PaymentRecord/PaymentRecordController.ts';
    }])
    .controller('PageController', ($scope, EntityService, LocaleService, ViewParameters) => {
        const Dialogs = new DialogHub();
		let params = ViewParameters.get();
		if (Object.keys(params).length) {         
            const filterEntity = params.filterEntity ?? {};

			const filter = {
				$filter: {
					conditions: [],
					sorts: [],
					limit: 20,
					offset: 0
				}
			};
			if (entity.Id !== undefined) {
				const condition = { propertyName: 'Id', operator: 'EQ', value: entity.Id };
				filter.$filter.conditions.push(condition);
			}
			if (entity.DateFrom) {
				const condition = { propertyName: 'Date', operator: 'GE', value: entity.DateFrom };
				filter.$filter.conditions.push(condition);
			}
			if (entity.DateTo) {
				const condition = { propertyName: 'Date', operator: 'LE', value: entity.DateTo };
				filter.$filter.conditions.push(condition);
			}
			if (entity.ValorFrom) {
				const condition = { propertyName: 'Valor', operator: 'GE', value: entity.ValorFrom };
				filter.$filter.conditions.push(condition);
			}
			if (entity.ValorTo) {
				const condition = { propertyName: 'Valor', operator: 'LE', value: entity.ValorTo };
				filter.$filter.conditions.push(condition);
			}
			if (entity.CompanyIBAN) {
				const condition = { propertyName: 'CompanyIBAN', operator: 'LIKE', value: `%${entity.CompanyIBAN}%` };
				filter.$filter.conditions.push(condition);
			}
			if (entity.CounterpartyIBAN) {
				const condition = { propertyName: 'CounterpartyIBAN', operator: 'LIKE', value: `%${entity.CounterpartyIBAN}%` };
				filter.$filter.conditions.push(condition);
			}
			if (entity.CounterpartyName) {
				const condition = { propertyName: 'CounterpartyName', operator: 'LIKE', value: `%${entity.CounterpartyName}%` };
				filter.$filter.conditions.push(condition);
			}
			if (entity.Amount !== undefined) {
				const condition = { propertyName: 'Amount', operator: 'EQ', value: entity.Amount };
				filter.$filter.conditions.push(condition);
			}
			if (entity.Currency !== undefined) {
				const condition = { propertyName: 'Currency', operator: 'EQ', value: entity.Currency };
				filter.$filter.conditions.push(condition);
			}
			if (entity.Reason) {
				const condition = { propertyName: 'Reason', operator: 'LIKE', value: `%${entity.Reason}%` };
				filter.$filter.conditions.push(condition);
			}
			if (entity.Description) {
				const condition = { propertyName: 'Description', operator: 'LIKE', value: `%${entity.Description}%` };
				filter.$filter.conditions.push(condition);
			}
			if (entity.Company !== undefined) {
				const condition = { propertyName: 'Company', operator: 'EQ', value: entity.Company };
				filter.$filter.conditions.push(condition);
			}
			if (entity.PaymentRecordDirection !== undefined) {
				const condition = { propertyName: 'PaymentRecordDirection', operator: 'EQ', value: entity.PaymentRecordDirection };
				filter.$filter.conditions.push(condition);
			}
			if (entity.PaymentStatus !== undefined) {
				const condition = { propertyName: 'PaymentStatus', operator: 'EQ', value: entity.PaymentStatus };
				filter.$filter.conditions.push(condition);
			}
			if (entity.PaymentType !== undefined) {
				const condition = { propertyName: 'PaymentType', operator: 'EQ', value: entity.PaymentType };
				filter.$filter.conditions.push(condition);
			}
			if (entity.UUID) {
				const condition = { propertyName: 'UUID', operator: 'LIKE', value: `%${entity.UUID}%` };
				filter.$filter.conditions.push(condition);
			}
			if (entity.Reference) {
				const condition = { propertyName: 'Reference', operator: 'LIKE', value: `%${entity.Reference}%` };
				filter.$filter.conditions.push(condition);
			}
			if (entity.Deleted !== undefined && entity.isDeletedIndeterminate === false) {
				const condition = { propertyName: 'Deleted', operator: 'EQ', value: entity.Deleted };
				filter.$filter.conditions.push(condition);
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
					title: LocaleService.t('codbex-payments:codbex-payments-model.t.PAYMENTRECORD'),
					message: LocaleService.t('codbex-payments:codbex-payments-model.messages.error.unableToLF', { name: '$t(codbex-payments:codbex-payments-model.t.PAYMENTRECORD)', message: message }),
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