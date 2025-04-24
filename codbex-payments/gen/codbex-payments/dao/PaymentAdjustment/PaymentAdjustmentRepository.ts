import { query } from "sdk/db";
import { producer } from "sdk/messaging";
import { extensions } from "sdk/extensions";
import { dao as daoApi } from "sdk/db";
import { EntityUtils } from "../utils/EntityUtils";

export interface PaymentAdjustmentEntity {
    readonly Id: number;
    Date?: Date;
    Valor?: Date;
    Amount?: number;
    Currency?: number;
    Company?: number;
    Reason?: string;
    UUID?: string;
}

export interface PaymentAdjustmentCreateEntity {
    readonly Date?: Date;
    readonly Valor?: Date;
    readonly Amount?: number;
    readonly Currency?: number;
    readonly Company?: number;
    readonly Reason?: string;
}

export interface PaymentAdjustmentUpdateEntity extends PaymentAdjustmentCreateEntity {
    readonly Id: number;
}

export interface PaymentAdjustmentEntityOptions {
    $filter?: {
        equals?: {
            Id?: number | number[];
            Date?: Date | Date[];
            Valor?: Date | Date[];
            Amount?: number | number[];
            Currency?: number | number[];
            Company?: number | number[];
            Reason?: string | string[];
            UUID?: string | string[];
        };
        notEquals?: {
            Id?: number | number[];
            Date?: Date | Date[];
            Valor?: Date | Date[];
            Amount?: number | number[];
            Currency?: number | number[];
            Company?: number | number[];
            Reason?: string | string[];
            UUID?: string | string[];
        };
        contains?: {
            Id?: number;
            Date?: Date;
            Valor?: Date;
            Amount?: number;
            Currency?: number;
            Company?: number;
            Reason?: string;
            UUID?: string;
        };
        greaterThan?: {
            Id?: number;
            Date?: Date;
            Valor?: Date;
            Amount?: number;
            Currency?: number;
            Company?: number;
            Reason?: string;
            UUID?: string;
        };
        greaterThanOrEqual?: {
            Id?: number;
            Date?: Date;
            Valor?: Date;
            Amount?: number;
            Currency?: number;
            Company?: number;
            Reason?: string;
            UUID?: string;
        };
        lessThan?: {
            Id?: number;
            Date?: Date;
            Valor?: Date;
            Amount?: number;
            Currency?: number;
            Company?: number;
            Reason?: string;
            UUID?: string;
        };
        lessThanOrEqual?: {
            Id?: number;
            Date?: Date;
            Valor?: Date;
            Amount?: number;
            Currency?: number;
            Company?: number;
            Reason?: string;
            UUID?: string;
        };
    },
    $select?: (keyof PaymentAdjustmentEntity)[],
    $sort?: string | (keyof PaymentAdjustmentEntity)[],
    $order?: 'ASC' | 'DESC',
    $offset?: number,
    $limit?: number,
}

interface PaymentAdjustmentEntityEvent {
    readonly operation: 'create' | 'update' | 'delete';
    readonly table: string;
    readonly entity: Partial<PaymentAdjustmentEntity>;
    readonly key: {
        name: string;
        column: string;
        value: number;
    }
}

interface PaymentAdjustmentUpdateEntityEvent extends PaymentAdjustmentEntityEvent {
    readonly previousEntity: PaymentAdjustmentEntity;
}

export class PaymentAdjustmentRepository {

    private static readonly DEFINITION = {
        table: "CODBEX_PAYMENTADJUSTMENT",
        properties: [
            {
                name: "Id",
                column: "PAYMENTADJUSTMENT_ID",
                type: "INTEGER",
                id: true,
                autoIncrement: true,
            },
            {
                name: "Date",
                column: "PAYMENTADJUSTMENT_DATE",
                type: "DATE",
            },
            {
                name: "Valor",
                column: "PAYMENTADJUSTMENT_VALOR",
                type: "DATE",
            },
            {
                name: "Amount",
                column: "PAYMENTADJUSTMENT_AMOUNT",
                type: "DECIMAL",
            },
            {
                name: "Currency",
                column: "PAYMENTADJUSTMENT_CURRENCY",
                type: "INTEGER",
            },
            {
                name: "Company",
                column: "PAYMENTADJUSTMENT_COMPANY",
                type: "INTEGER",
            },
            {
                name: "Reason",
                column: "PAYMENTADJUSTMENT_REASON",
                type: "VARCHAR",
            },
            {
                name: "UUID",
                column: "PAYMENTADJUSTMENT_UUID",
                type: "VARCHAR",
            }
        ]
    };

    private readonly dao;

    constructor(dataSource = "DefaultDB") {
        this.dao = daoApi.create(PaymentAdjustmentRepository.DEFINITION, undefined, dataSource);
    }

    public findAll(options: PaymentAdjustmentEntityOptions = {}): PaymentAdjustmentEntity[] {
        return this.dao.list(options).map((e: PaymentAdjustmentEntity) => {
            EntityUtils.setDate(e, "Date");
            EntityUtils.setDate(e, "Valor");
            return e;
        });
    }

    public findById(id: number): PaymentAdjustmentEntity | undefined {
        const entity = this.dao.find(id);
        EntityUtils.setDate(entity, "Date");
        EntityUtils.setDate(entity, "Valor");
        return entity ?? undefined;
    }

    public create(entity: PaymentAdjustmentCreateEntity): number {
        EntityUtils.setLocalDate(entity, "Date");
        EntityUtils.setLocalDate(entity, "Valor");
        // @ts-ignore
        (entity as PaymentAdjustmentEntity).UUID = require("sdk/utils/uuid").random();
        const id = this.dao.insert(entity);
        this.triggerEvent({
            operation: "create",
            table: "CODBEX_PAYMENTADJUSTMENT",
            entity: entity,
            key: {
                name: "Id",
                column: "PAYMENTADJUSTMENT_ID",
                value: id
            }
        });
        return id;
    }

    public update(entity: PaymentAdjustmentUpdateEntity): void {
        // EntityUtils.setLocalDate(entity, "Date");
        // EntityUtils.setLocalDate(entity, "Valor");
        const previousEntity = this.findById(entity.Id);
        this.dao.update(entity);
        this.triggerEvent({
            operation: "update",
            table: "CODBEX_PAYMENTADJUSTMENT",
            entity: entity,
            previousEntity: previousEntity,
            key: {
                name: "Id",
                column: "PAYMENTADJUSTMENT_ID",
                value: entity.Id
            }
        });
    }

    public upsert(entity: PaymentAdjustmentCreateEntity | PaymentAdjustmentUpdateEntity): number {
        const id = (entity as PaymentAdjustmentUpdateEntity).Id;
        if (!id) {
            return this.create(entity);
        }

        const existingEntity = this.findById(id);
        if (existingEntity) {
            this.update(entity as PaymentAdjustmentUpdateEntity);
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
            table: "CODBEX_PAYMENTADJUSTMENT",
            entity: entity,
            key: {
                name: "Id",
                column: "PAYMENTADJUSTMENT_ID",
                value: id
            }
        });
    }

    public count(options?: PaymentAdjustmentEntityOptions): number {
        return this.dao.count(options);
    }

    public customDataCount(): number {
        const resultSet = query.execute('SELECT COUNT(*) AS COUNT FROM "CODBEX_PAYMENTADJUSTMENT"');
        if (resultSet !== null && resultSet[0] !== null) {
            if (resultSet[0].COUNT !== undefined && resultSet[0].COUNT !== null) {
                return resultSet[0].COUNT;
            } else if (resultSet[0].count !== undefined && resultSet[0].count !== null) {
                return resultSet[0].count;
            }
        }
        return 0;
    }

    private async triggerEvent(data: PaymentAdjustmentEntityEvent | PaymentAdjustmentUpdateEntityEvent) {
        const triggerExtensions = await extensions.loadExtensionModules("codbex-payments-PaymentAdjustment-PaymentAdjustment", ["trigger"]);
        triggerExtensions.forEach(triggerExtension => {
            try {
                triggerExtension.trigger(data);
            } catch (error) {
                console.error(error);
            }            
        });
        producer.topic("codbex-payments-PaymentAdjustment-PaymentAdjustment").send(JSON.stringify(data));
    }
}
