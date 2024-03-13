import { query } from "sdk/db";
import { producer } from "sdk/messaging";
import { extensions } from "sdk/extensions";
import { dao as daoApi } from "sdk/db";

export interface EmployeePaymentEntity {
    readonly Id: number;
    Date?: string;
    Valor?: string;
    Amount?: string;
    Currency?: number;
    Reason?: string;
    Description?: string;
    Company?: number;
    UUID: string;
    Reference?: string;
}

export interface EmployeePaymentCreateEntity {
    readonly Date?: string;
    readonly Valor?: string;
    readonly Amount?: string;
    readonly Currency?: number;
    readonly Reason?: string;
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
            Date?: string | string[];
            Valor?: string | string[];
            Amount?: string | string[];
            Currency?: number | number[];
            Reason?: string | string[];
            Description?: string | string[];
            Company?: number | number[];
            UUID?: string | string[];
            Reference?: string | string[];
        };
        notEquals?: {
            Id?: number | number[];
            Date?: string | string[];
            Valor?: string | string[];
            Amount?: string | string[];
            Currency?: number | number[];
            Reason?: string | string[];
            Description?: string | string[];
            Company?: number | number[];
            UUID?: string | string[];
            Reference?: string | string[];
        };
        contains?: {
            Id?: number;
            Date?: string;
            Valor?: string;
            Amount?: string;
            Currency?: number;
            Reason?: string;
            Description?: string;
            Company?: number;
            UUID?: string;
            Reference?: string;
        };
        greaterThan?: {
            Id?: number;
            Date?: string;
            Valor?: string;
            Amount?: string;
            Currency?: number;
            Reason?: string;
            Description?: string;
            Company?: number;
            UUID?: string;
            Reference?: string;
        };
        greaterThanOrEqual?: {
            Id?: number;
            Date?: string;
            Valor?: string;
            Amount?: string;
            Currency?: number;
            Reason?: string;
            Description?: string;
            Company?: number;
            UUID?: string;
            Reference?: string;
        };
        lessThan?: {
            Id?: number;
            Date?: string;
            Valor?: string;
            Amount?: string;
            Currency?: number;
            Reason?: string;
            Description?: string;
            Company?: number;
            UUID?: string;
            Reference?: string;
        };
        lessThanOrEqual?: {
            Id?: number;
            Date?: string;
            Valor?: string;
            Amount?: string;
            Currency?: number;
            Reason?: string;
            Description?: string;
            Company?: number;
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
                type: "VARCHAR",
            },
            {
                name: "Valor",
                column: "EMPLOYEEPAYMENT_VALOR",
                type: "VARCHAR",
            },
            {
                name: "Amount",
                column: "EMPLOYEEPAYMENT_AMOUNT",
                type: "VARCHAR",
            },
            {
                name: "Currency",
                column: "EMPLOYEEPAYMENT_CURRENCY",
                type: "INTEGER",
            },
            {
                name: "Reason",
                column: "EMPLOYEEPAYMENT_REASON",
                type: "VARCHAR",
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

    constructor(dataSource?: string) {
        this.dao = daoApi.create(EmployeePaymentRepository.DEFINITION, null, dataSource);
    }

    public findAll(options?: EmployeePaymentEntityOptions): EmployeePaymentEntity[] {
        return this.dao.list(options);
    }

    public findById(id: number): EmployeePaymentEntity | undefined {
        const entity = this.dao.find(id);
        return entity ?? undefined;
    }

    public create(entity: EmployeePaymentCreateEntity): number {
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
        this.dao.update(entity);
        this.triggerEvent({
            operation: "update",
            table: "CODBEX_EMPLOYEEPAYMENT",
            entity: entity,
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

    private async triggerEvent(data: EmployeePaymentEntityEvent) {
        const triggerExtensions = await extensions.loadExtensionModules("codbex-payments-EmployeePayments-EmployeePayment", ["trigger"]);
        triggerExtensions.forEach(triggerExtension => {
            try {
                triggerExtension.trigger(data);
            } catch (error) {
                console.error(error);
            }            
        });
        producer.topic("codbex-payments-EmployeePayments-EmployeePayment").send(JSON.stringify(data));
    }
}
