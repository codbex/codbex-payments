import { query } from "sdk/db";
import { producer } from "sdk/messaging";
import { extensions } from "sdk/extensions";
import { dao as daoApi } from "sdk/db";
import { EntityUtils } from "../utils/EntityUtils";
// custom imports
import { NumberGeneratorService } from "/codbex-number-generator/service/generator";

export interface EmployeePaymentEntity {
    readonly Id: number;
    Date: Date;
    Valor: Date;
    CompanyIBAN?: string;
    CounterpartyIBAN?: string;
    CounterpartyName?: string;
    Amount: number;
    Currency: number;
    Reason: string;
    Description?: string;
    Company?: number;
    Name?: string;
    UUID: string;
    Reference?: string;
}

export interface EmployeePaymentCreateEntity {
    readonly Date: Date;
    readonly Valor: Date;
    readonly CompanyIBAN?: string;
    readonly CounterpartyIBAN?: string;
    readonly CounterpartyName?: string;
    readonly Amount: number;
    readonly Currency: number;
    readonly Reason: string;
    readonly Description?: string;
    readonly Company?: number;
    readonly Reference?: string;
}

export interface EmployeePaymentUpdateEntity extends EmployeePaymentCreateEntity {
    readonly Id: number;
}

export interface EmployeePaymentEntityOptions {
    $filter?: {
        equals?: {
            Id?: number | number[];
            Date?: Date | Date[];
            Valor?: Date | Date[];
            CompanyIBAN?: string | string[];
            CounterpartyIBAN?: string | string[];
            CounterpartyName?: string | string[];
            Amount?: number | number[];
            Currency?: number | number[];
            Reason?: string | string[];
            Description?: string | string[];
            Company?: number | number[];
            Name?: string | string[];
            UUID?: string | string[];
            Reference?: string | string[];
        };
        notEquals?: {
            Id?: number | number[];
            Date?: Date | Date[];
            Valor?: Date | Date[];
            CompanyIBAN?: string | string[];
            CounterpartyIBAN?: string | string[];
            CounterpartyName?: string | string[];
            Amount?: number | number[];
            Currency?: number | number[];
            Reason?: string | string[];
            Description?: string | string[];
            Company?: number | number[];
            Name?: string | string[];
            UUID?: string | string[];
            Reference?: string | string[];
        };
        contains?: {
            Id?: number;
            Date?: Date;
            Valor?: Date;
            CompanyIBAN?: string;
            CounterpartyIBAN?: string;
            CounterpartyName?: string;
            Amount?: number;
            Currency?: number;
            Reason?: string;
            Description?: string;
            Company?: number;
            Name?: string;
            UUID?: string;
            Reference?: string;
        };
        greaterThan?: {
            Id?: number;
            Date?: Date;
            Valor?: Date;
            CompanyIBAN?: string;
            CounterpartyIBAN?: string;
            CounterpartyName?: string;
            Amount?: number;
            Currency?: number;
            Reason?: string;
            Description?: string;
            Company?: number;
            Name?: string;
            UUID?: string;
            Reference?: string;
        };
        greaterThanOrEqual?: {
            Id?: number;
            Date?: Date;
            Valor?: Date;
            CompanyIBAN?: string;
            CounterpartyIBAN?: string;
            CounterpartyName?: string;
            Amount?: number;
            Currency?: number;
            Reason?: string;
            Description?: string;
            Company?: number;
            Name?: string;
            UUID?: string;
            Reference?: string;
        };
        lessThan?: {
            Id?: number;
            Date?: Date;
            Valor?: Date;
            CompanyIBAN?: string;
            CounterpartyIBAN?: string;
            CounterpartyName?: string;
            Amount?: number;
            Currency?: number;
            Reason?: string;
            Description?: string;
            Company?: number;
            Name?: string;
            UUID?: string;
            Reference?: string;
        };
        lessThanOrEqual?: {
            Id?: number;
            Date?: Date;
            Valor?: Date;
            CompanyIBAN?: string;
            CounterpartyIBAN?: string;
            CounterpartyName?: string;
            Amount?: number;
            Currency?: number;
            Reason?: string;
            Description?: string;
            Company?: number;
            Name?: string;
            UUID?: string;
            Reference?: string;
        };
    },
    $select?: (keyof EmployeePaymentEntity)[],
    $sort?: string | (keyof EmployeePaymentEntity)[],
    $order?: 'asc' | 'desc',
    $offset?: number,
    $limit?: number,
}

interface EmployeePaymentEntityEvent {
    readonly operation: 'create' | 'update' | 'delete';
    readonly table: string;
    readonly entity: Partial<EmployeePaymentEntity>;
    readonly key: {
        name: string;
        column: string;
        value: number;
    }
}

interface EmployeePaymentUpdateEntityEvent extends EmployeePaymentEntityEvent {
    readonly previousEntity: EmployeePaymentEntity;
}

export class EmployeePaymentRepository {

    private static readonly DEFINITION = {
        table: "CODBEX_EMPLOYEEPAYMENT",
        properties: [
            {
                name: "Id",
                column: "EMPLOYEEPAYMENT_ID",
                type: "INTEGER",
                id: true,
                autoIncrement: true,
            },
            {
                name: "Date",
                column: "EMPLOYEEPAYMENT_DATE",
                type: "DATE",
                required: true
            },
            {
                name: "Valor",
                column: "EMPLOYEEPAYMENT_VALOR",
                type: "DATE",
                required: true
            },
            {
                name: "CompanyIBAN",
                column: "EMPLOYEEPAYMENT_COMPANYIBAN",
                type: "VARCHAR",
            },
            {
                name: "CounterpartyIBAN",
                column: "EMPLOYEEPAYMENT_COUNTERPARTYIBAN",
                type: "VARCHAR",
            },
            {
                name: "CounterpartyName",
                column: "EMPLOYEEPAYMENT_COUNTERPARTYNAME",
                type: "VARCHAR",
            },
            {
                name: "Amount",
                column: "EMPLOYEEPAYMENT_AMOUNT",
                type: "DECIMAL",
                required: true
            },
            {
                name: "Currency",
                column: "EMPLOYEEPAYMENT_CURRENCY",
                type: "INTEGER",
                required: true
            },
            {
                name: "Reason",
                column: "EMPLOYEEPAYMENT_REASON",
                type: "VARCHAR",
                required: true
            },
            {
                name: "Description",
                column: "EMPLOYEEPAYMENT_DESCRIPTION",
                type: "VARCHAR",
            },
            {
                name: "Company",
                column: "EMPLOYEEPAYMENT_COMPANY",
                type: "INTEGER",
            },
            {
                name: "Name",
                column: "EMPLOYEEPAYMENT_NAME",
                type: "VARCHAR",
            },
            {
                name: "UUID",
                column: "EMPLOYEEPAYMENT_UUID",
                type: "VARCHAR",
                required: true
            },
            {
                name: "Reference",
                column: "EMPLOYEEPAYMENT_REFERENCE",
                type: "VARCHAR",
            }
        ]
    };

    private readonly dao;

    constructor(dataSource = "DefaultDB") {
        this.dao = daoApi.create(EmployeePaymentRepository.DEFINITION, null, dataSource);
    }

    public findAll(options?: EmployeePaymentEntityOptions): EmployeePaymentEntity[] {
        return this.dao.list(options).map((e: EmployeePaymentEntity) => {
            EntityUtils.setDate(e, "Date");
            EntityUtils.setDate(e, "Valor");
            return e;
        });
    }

    public findById(id: number): EmployeePaymentEntity | undefined {
        const entity = this.dao.find(id);
        EntityUtils.setDate(entity, "Date");
        EntityUtils.setDate(entity, "Valor");
        return entity ?? undefined;
    }

    public create(entity: EmployeePaymentCreateEntity): number {
        EntityUtils.setLocalDate(entity, "Date");
        EntityUtils.setLocalDate(entity, "Valor");
        // @ts-ignore
        (entity as EmployeePaymentEntity).Name = new NumberGeneratorService().generate(22);
        // @ts-ignore
        (entity as EmployeePaymentEntity).UUID = require("sdk/utils/uuid").random();
        const id = this.dao.insert(entity);
        this.triggerEvent({
            operation: "create",
            table: "CODBEX_EMPLOYEEPAYMENT",
            entity: entity,
            key: {
                name: "Id",
                column: "EMPLOYEEPAYMENT_ID",
                value: id
            }
        });
        return id;
    }

    public update(entity: EmployeePaymentUpdateEntity): void {
        // EntityUtils.setLocalDate(entity, "Date");
        // EntityUtils.setLocalDate(entity, "Valor");
        const previousEntity = this.findById(entity.Id);
        this.dao.update(entity);
        this.triggerEvent({
            operation: "update",
            table: "CODBEX_EMPLOYEEPAYMENT",
            entity: entity,
            previousEntity: previousEntity,
            key: {
                name: "Id",
                column: "EMPLOYEEPAYMENT_ID",
                value: entity.Id
            }
        });
    }

    public upsert(entity: EmployeePaymentCreateEntity | EmployeePaymentUpdateEntity): number {
        const id = (entity as EmployeePaymentUpdateEntity).Id;
        if (!id) {
            return this.create(entity);
        }

        const existingEntity = this.findById(id);
        if (existingEntity) {
            this.update(entity as EmployeePaymentUpdateEntity);
            return id;
        } else {
            return this.create(entity);
        }
    }

    public deleteById(id: number): void {
        const entity = this.dao.find(id);
        this.dao.remove(id);
        this.triggerEvent({
            operation: "delete",
            table: "CODBEX_EMPLOYEEPAYMENT",
            entity: entity,
            key: {
                name: "Id",
                column: "EMPLOYEEPAYMENT_ID",
                value: id
            }
        });
    }

    public count(options?: EmployeePaymentEntityOptions): number {
        return this.dao.count(options);
    }

    public customDataCount(): number {
        const resultSet = query.execute('SELECT COUNT(*) AS COUNT FROM "CODBEX_EMPLOYEEPAYMENT"');
        if (resultSet !== null && resultSet[0] !== null) {
            if (resultSet[0].COUNT !== undefined && resultSet[0].COUNT !== null) {
                return resultSet[0].COUNT;
            } else if (resultSet[0].count !== undefined && resultSet[0].count !== null) {
                return resultSet[0].count;
            }
        }
        return 0;
    }

    private async triggerEvent(data: EmployeePaymentEntityEvent | EmployeePaymentUpdateEntityEvent) {
        const triggerExtensions = await extensions.loadExtensionModules("codbex-payments-EmployeePayment-EmployeePayment", ["trigger"]);
        triggerExtensions.forEach(triggerExtension => {
            try {
                triggerExtension.trigger(data);
            } catch (error) {
                console.error(error);
            }            
        });
        producer.topic("codbex-payments-EmployeePayment-EmployeePayment").send(JSON.stringify(data));
    }
}
