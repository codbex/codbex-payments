import { sql, query } from "@aerokit/sdk/db";
import { producer } from "@aerokit/sdk/messaging";
import { extensions } from "@aerokit/sdk/extensions";
import { dao as daoApi } from "@aerokit/sdk/db";
import { EntityUtils } from "../utils/EntityUtils";

export interface PaymentRecordEntity {
    readonly Id: number;
    Date: Date;
    Valor: Date;
    CompanyIBAN?: string;
    CounterpartyIBAN?: string;
    CounterpartyName?: string;
    Amount?: number;
    Currency?: number;
    Reason?: string;
    Description?: string;
    Company?: number;
    PaymentRecordDirection?: number;
    PaymentStatus?: number;
    PaymentType?: number;
    UUID: string;
    Reference?: string;
    Deleted?: boolean;
}

export interface PaymentRecordCreateEntity {
    readonly Date: Date;
    readonly Valor: Date;
    readonly CompanyIBAN?: string;
    readonly CounterpartyIBAN?: string;
    readonly CounterpartyName?: string;
    readonly Amount?: number;
    readonly Currency?: number;
    readonly Reason?: string;
    readonly Description?: string;
    readonly Company?: number;
    readonly PaymentRecordDirection?: number;
    readonly PaymentStatus?: number;
    readonly PaymentType?: number;
    readonly Reference?: string;
    readonly Deleted?: boolean;
}

export interface PaymentRecordUpdateEntity extends PaymentRecordCreateEntity {
    readonly Id: number;
}

export interface PaymentRecordEntityOptions {
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
            PaymentRecordDirection?: number | number[];
            PaymentStatus?: number | number[];
            PaymentType?: number | number[];
            UUID?: string | string[];
            Reference?: string | string[];
            Deleted?: boolean | boolean[];
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
            PaymentRecordDirection?: number | number[];
            PaymentStatus?: number | number[];
            PaymentType?: number | number[];
            UUID?: string | string[];
            Reference?: string | string[];
            Deleted?: boolean | boolean[];
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
            PaymentRecordDirection?: number;
            PaymentStatus?: number;
            PaymentType?: number;
            UUID?: string;
            Reference?: string;
            Deleted?: boolean;
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
            PaymentRecordDirection?: number;
            PaymentStatus?: number;
            PaymentType?: number;
            UUID?: string;
            Reference?: string;
            Deleted?: boolean;
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
            PaymentRecordDirection?: number;
            PaymentStatus?: number;
            PaymentType?: number;
            UUID?: string;
            Reference?: string;
            Deleted?: boolean;
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
            PaymentRecordDirection?: number;
            PaymentStatus?: number;
            PaymentType?: number;
            UUID?: string;
            Reference?: string;
            Deleted?: boolean;
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
            PaymentRecordDirection?: number;
            PaymentStatus?: number;
            PaymentType?: number;
            UUID?: string;
            Reference?: string;
            Deleted?: boolean;
        };
    },
    $select?: (keyof PaymentRecordEntity)[],
    $sort?: string | (keyof PaymentRecordEntity)[],
    $order?: 'ASC' | 'DESC',
    $offset?: number,
    $limit?: number,
    $language?: string
}

export interface PaymentRecordEntityEvent {
    readonly operation: 'create' | 'update' | 'delete';
    readonly table: string;
    readonly entity: Partial<PaymentRecordEntity>;
    readonly key: {
        name: string;
        column: string;
        value: number;
    }
}

export interface PaymentRecordUpdateEntityEvent extends PaymentRecordEntityEvent {
    readonly previousEntity: PaymentRecordEntity;
}

export class PaymentRecordRepository {

    private static readonly DEFINITION = {
        table: "CODBEX_PAYMENTRECORD",
        properties: [
            {
                name: "Id",
                column: "PAYMENTRECORD_ID",
                type: "INTEGER",
                id: true,
                autoIncrement: true,
            },
            {
                name: "Date",
                column: "PAYMENTRECORD_DATE",
                type: "DATE",
                required: true
            },
            {
                name: "Valor",
                column: "PAYMENTRECORD_VALOR",
                type: "DATE",
                required: true
            },
            {
                name: "CompanyIBAN",
                column: "PAYMENTRECORD_COMPANYIBAN",
                type: "VARCHAR",
            },
            {
                name: "CounterpartyIBAN",
                column: "PAYMENTRECORD_COUNTERPARTYIBAN",
                type: "VARCHAR",
            },
            {
                name: "CounterpartyName",
                column: "PAYMENTRECORD_COUNTERPARTYNAME",
                type: "VARCHAR",
            },
            {
                name: "Amount",
                column: "PAYMENTRECORD_AMOUNT",
                type: "DECIMAL",
            },
            {
                name: "Currency",
                column: "PAYMENTRECORD_CURRENCY",
                type: "INTEGER",
            },
            {
                name: "Reason",
                column: "PAYMENTRECORD_REASON",
                type: "VARCHAR",
            },
            {
                name: "Description",
                column: "PAYMENTRECORD_DESCRIPTION",
                type: "VARCHAR",
            },
            {
                name: "Company",
                column: "PAYMENTRECORD_COMPANY",
                type: "INTEGER",
            },
            {
                name: "PaymentRecordDirection",
                column: "PAYMENTRECORD_PAYMENTRECORDDIRECTION",
                type: "INTEGER",
            },
            {
                name: "PaymentStatus",
                column: "PAYMENTRECORD_PAYMENTSTATUS",
                type: "INTEGER",
            },
            {
                name: "PaymentType",
                column: "PAYMENTRECORD_PAYMENTTYPE",
                type: "INTEGER",
            },
            {
                name: "UUID",
                column: "PAYMENTRECORD_UUID",
                type: "VARCHAR",
                required: true
            },
            {
                name: "Reference",
                column: "PAYMENTRECORD_REFERENCE",
                type: "VARCHAR",
            },
            {
                name: "Deleted",
                column: "PAYMENTRECORD_DELETED",
                type: "BOOLEAN",
            }
        ]
    };

    private readonly dao;

    constructor(dataSource = "DefaultDB") {
        this.dao = daoApi.create(PaymentRecordRepository.DEFINITION, undefined, dataSource);
    }

    public findAll(options: PaymentRecordEntityOptions = {}): PaymentRecordEntity[] {
        if (options.$sort === undefined && options.$order === undefined) {
            options.$sort = "Date";
            options.$order = "DESC";
        }
        let list = this.dao.list(options).map((e: PaymentRecordEntity) => {
            EntityUtils.setDate(e, "Date");
            EntityUtils.setDate(e, "Valor");
            EntityUtils.setBoolean(e, "Deleted");
            return e;
        });
        return list;
    }

    public findById(id: number, options: PaymentRecordEntityOptions = {}): PaymentRecordEntity | undefined {
        const entity = this.dao.find(id);
        EntityUtils.setDate(entity, "Date");
        EntityUtils.setDate(entity, "Valor");
        EntityUtils.setBoolean(entity, "Deleted");
        return entity ?? undefined;
    }

    public create(entity: PaymentRecordCreateEntity): number {
        EntityUtils.setLocalDate(entity, "Date");
        EntityUtils.setLocalDate(entity, "Valor");
        EntityUtils.setBoolean(entity, "Deleted");
        // @ts-ignore
        (entity as PaymentRecordEntity).UUID = require("sdk/utils/uuid").random();
        const id = this.dao.insert(entity);
        this.triggerEvent({
            operation: "create",
            table: "CODBEX_PAYMENTRECORD",
            entity: entity,
            key: {
                name: "Id",
                column: "PAYMENTRECORD_ID",
                value: id
            }
        });
        return id;
    }

    public update(entity: PaymentRecordUpdateEntity): void {
        // EntityUtils.setLocalDate(entity, "Date");
        // EntityUtils.setLocalDate(entity, "Valor");
        EntityUtils.setBoolean(entity, "Deleted");
        const previousEntity = this.findById(entity.Id);
        this.dao.update(entity);
        this.triggerEvent({
            operation: "update",
            table: "CODBEX_PAYMENTRECORD",
            entity: entity,
            previousEntity: previousEntity,
            key: {
                name: "Id",
                column: "PAYMENTRECORD_ID",
                value: entity.Id
            }
        });
    }

    public upsert(entity: PaymentRecordCreateEntity | PaymentRecordUpdateEntity): number {
        const id = (entity as PaymentRecordUpdateEntity).Id;
        if (!id) {
            return this.create(entity);
        }

        const existingEntity = this.findById(id);
        if (existingEntity) {
            this.update(entity as PaymentRecordUpdateEntity);
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
            table: "CODBEX_PAYMENTRECORD",
            entity: entity,
            key: {
                name: "Id",
                column: "PAYMENTRECORD_ID",
                value: id
            }
        });
    }

    public count(options?: PaymentRecordEntityOptions): number {
        return this.dao.count(options);
    }

    public customDataCount(): number {
        const resultSet = query.execute('SELECT COUNT(*) AS COUNT FROM "CODBEX_PAYMENTRECORD"');
        if (resultSet !== null && resultSet[0] !== null) {
            if (resultSet[0].COUNT !== undefined && resultSet[0].COUNT !== null) {
                return resultSet[0].COUNT;
            } else if (resultSet[0].count !== undefined && resultSet[0].count !== null) {
                return resultSet[0].count;
            }
        }
        return 0;
    }

    private async triggerEvent(data: PaymentRecordEntityEvent | PaymentRecordUpdateEntityEvent) {
        const triggerExtensions = await extensions.loadExtensionModules("codbex-payments-PaymentRecord-PaymentRecord", ["trigger"]);
        triggerExtensions.forEach(triggerExtension => {
            try {
                triggerExtension.trigger(data);
            } catch (error) {
                console.error(error);
            }            
        });
        producer.topic("codbex-payments-PaymentRecord-PaymentRecord").send(JSON.stringify(data));
    }
}
