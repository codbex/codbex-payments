import { sql, query } from "@aerokit/sdk/db";
import { producer } from "@aerokit/sdk/messaging";
import { extensions } from "@aerokit/sdk/extensions";
import { dao as daoApi } from "@aerokit/sdk/db";

export interface PaymentRecordDirectionEntity {
    readonly Id: number;
    Name?: string;
}

export interface PaymentRecordDirectionCreateEntity {
    readonly Name?: string;
}

export interface PaymentRecordDirectionUpdateEntity extends PaymentRecordDirectionCreateEntity {
    readonly Id: number;
}

export interface PaymentRecordDirectionEntityOptions {
    $filter?: {
        equals?: {
            Id?: number | number[];
            Name?: string | string[];
        };
        notEquals?: {
            Id?: number | number[];
            Name?: string | string[];
        };
        contains?: {
            Id?: number;
            Name?: string;
        };
        greaterThan?: {
            Id?: number;
            Name?: string;
        };
        greaterThanOrEqual?: {
            Id?: number;
            Name?: string;
        };
        lessThan?: {
            Id?: number;
            Name?: string;
        };
        lessThanOrEqual?: {
            Id?: number;
            Name?: string;
        };
    },
    $select?: (keyof PaymentRecordDirectionEntity)[],
    $sort?: string | (keyof PaymentRecordDirectionEntity)[],
    $order?: 'ASC' | 'DESC',
    $offset?: number,
    $limit?: number,
    $language?: string
}

export interface PaymentRecordDirectionEntityEvent {
    readonly operation: 'create' | 'update' | 'delete';
    readonly table: string;
    readonly entity: Partial<PaymentRecordDirectionEntity>;
    readonly key: {
        name: string;
        column: string;
        value: number;
    }
}

export interface PaymentRecordDirectionUpdateEntityEvent extends PaymentRecordDirectionEntityEvent {
    readonly previousEntity: PaymentRecordDirectionEntity;
}

export class PaymentRecordDirectionRepository {

    private static readonly DEFINITION = {
        table: "CODBEX_PAYMENTRECORDDIRECTION",
        properties: [
            {
                name: "Id",
                column: "PAYMENTRECORDDIRECTION_ID",
                type: "INTEGER",
                id: true,
                autoIncrement: true,
            },
            {
                name: "Name",
                column: "PAYMENTRECORDDIRECTION_NAME",
                type: "VARCHAR",
            }
        ]
    };

    private readonly dao;

    constructor(dataSource = "DefaultDB") {
        this.dao = daoApi.create(PaymentRecordDirectionRepository.DEFINITION, undefined, dataSource);
    }

    public findAll(options: PaymentRecordDirectionEntityOptions = {}): PaymentRecordDirectionEntity[] {
        let list = this.dao.list(options);
        return list;
    }

    public findById(id: number, options: PaymentRecordDirectionEntityOptions = {}): PaymentRecordDirectionEntity | undefined {
        const entity = this.dao.find(id);
        return entity ?? undefined;
    }

    public create(entity: PaymentRecordDirectionCreateEntity): number {
        const id = this.dao.insert(entity);
        this.triggerEvent({
            operation: "create",
            table: "CODBEX_PAYMENTRECORDDIRECTION",
            entity: entity,
            key: {
                name: "Id",
                column: "PAYMENTRECORDDIRECTION_ID",
                value: id
            }
        });
        return id;
    }

    public update(entity: PaymentRecordDirectionUpdateEntity): void {
        const previousEntity = this.findById(entity.Id);
        this.dao.update(entity);
        this.triggerEvent({
            operation: "update",
            table: "CODBEX_PAYMENTRECORDDIRECTION",
            entity: entity,
            previousEntity: previousEntity,
            key: {
                name: "Id",
                column: "PAYMENTRECORDDIRECTION_ID",
                value: entity.Id
            }
        });
    }

    public upsert(entity: PaymentRecordDirectionCreateEntity | PaymentRecordDirectionUpdateEntity): number {
        const id = (entity as PaymentRecordDirectionUpdateEntity).Id;
        if (!id) {
            return this.create(entity);
        }

        const existingEntity = this.findById(id);
        if (existingEntity) {
            this.update(entity as PaymentRecordDirectionUpdateEntity);
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
            table: "CODBEX_PAYMENTRECORDDIRECTION",
            entity: entity,
            key: {
                name: "Id",
                column: "PAYMENTRECORDDIRECTION_ID",
                value: id
            }
        });
    }

    public count(options?: PaymentRecordDirectionEntityOptions): number {
        return this.dao.count(options);
    }

    public customDataCount(): number {
        const resultSet = query.execute('SELECT COUNT(*) AS COUNT FROM "CODBEX_PAYMENTRECORDDIRECTION"');
        if (resultSet !== null && resultSet[0] !== null) {
            if (resultSet[0].COUNT !== undefined && resultSet[0].COUNT !== null) {
                return resultSet[0].COUNT;
            } else if (resultSet[0].count !== undefined && resultSet[0].count !== null) {
                return resultSet[0].count;
            }
        }
        return 0;
    }

    private async triggerEvent(data: PaymentRecordDirectionEntityEvent | PaymentRecordDirectionUpdateEntityEvent) {
        const triggerExtensions = await extensions.loadExtensionModules("codbex-payments-Settings-PaymentRecordDirection", ["trigger"]);
        triggerExtensions.forEach(triggerExtension => {
            try {
                triggerExtension.trigger(data);
            } catch (error) {
                console.error(error);
            }            
        });
        producer.topic("codbex-payments-Settings-PaymentRecordDirection").send(JSON.stringify(data));
    }
}
