import { sql, query } from "@aerokit/sdk/db";
import { producer } from "@aerokit/sdk/messaging";
import { extensions } from "@aerokit/sdk/extensions";
import { dao as daoApi } from "@aerokit/sdk/db";

export interface PaymentTypeEntity {
    readonly Id: number;
    Name?: string;
}

export interface PaymentTypeCreateEntity {
    readonly Name?: string;
}

export interface PaymentTypeUpdateEntity extends PaymentTypeCreateEntity {
    readonly Id: number;
}

export interface PaymentTypeEntityOptions {
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
    $select?: (keyof PaymentTypeEntity)[],
    $sort?: string | (keyof PaymentTypeEntity)[],
    $order?: 'ASC' | 'DESC',
    $offset?: number,
    $limit?: number,
    $language?: string
}

export interface PaymentTypeEntityEvent {
    readonly operation: 'create' | 'update' | 'delete';
    readonly table: string;
    readonly entity: Partial<PaymentTypeEntity>;
    readonly key: {
        name: string;
        column: string;
        value: number;
    }
}

export interface PaymentTypeUpdateEntityEvent extends PaymentTypeEntityEvent {
    readonly previousEntity: PaymentTypeEntity;
}

export class PaymentTypeRepository {

    private static readonly DEFINITION = {
        table: "CODBEX_PAYMENTTYPE",
        properties: [
            {
                name: "Id",
                column: "PAYMENTTYPE_ID",
                type: "INTEGER",
                id: true,
                autoIncrement: true,
            },
            {
                name: "Name",
                column: "PAYMENTTYPE_NAME",
                type: "VARCHAR",
            }
        ]
    };

    private readonly dao;

    constructor(dataSource = "DefaultDB") {
        this.dao = daoApi.create(PaymentTypeRepository.DEFINITION, undefined, dataSource);
    }

    public findAll(options: PaymentTypeEntityOptions = {}): PaymentTypeEntity[] {
        let list = this.dao.list(options);
        return list;
    }

    public findById(id: number, options: PaymentTypeEntityOptions = {}): PaymentTypeEntity | undefined {
        const entity = this.dao.find(id);
        return entity ?? undefined;
    }

    public create(entity: PaymentTypeCreateEntity): number {
        const id = this.dao.insert(entity);
        this.triggerEvent({
            operation: "create",
            table: "CODBEX_PAYMENTTYPE",
            entity: entity,
            key: {
                name: "Id",
                column: "PAYMENTTYPE_ID",
                value: id
            }
        });
        return id;
    }

    public update(entity: PaymentTypeUpdateEntity): void {
        const previousEntity = this.findById(entity.Id);
        this.dao.update(entity);
        this.triggerEvent({
            operation: "update",
            table: "CODBEX_PAYMENTTYPE",
            entity: entity,
            previousEntity: previousEntity,
            key: {
                name: "Id",
                column: "PAYMENTTYPE_ID",
                value: entity.Id
            }
        });
    }

    public upsert(entity: PaymentTypeCreateEntity | PaymentTypeUpdateEntity): number {
        const id = (entity as PaymentTypeUpdateEntity).Id;
        if (!id) {
            return this.create(entity);
        }

        const existingEntity = this.findById(id);
        if (existingEntity) {
            this.update(entity as PaymentTypeUpdateEntity);
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
            table: "CODBEX_PAYMENTTYPE",
            entity: entity,
            key: {
                name: "Id",
                column: "PAYMENTTYPE_ID",
                value: id
            }
        });
    }

    public count(options?: PaymentTypeEntityOptions): number {
        return this.dao.count(options);
    }

    public customDataCount(): number {
        const resultSet = query.execute('SELECT COUNT(*) AS COUNT FROM "CODBEX_PAYMENTTYPE"');
        if (resultSet !== null && resultSet[0] !== null) {
            if (resultSet[0].COUNT !== undefined && resultSet[0].COUNT !== null) {
                return resultSet[0].COUNT;
            } else if (resultSet[0].count !== undefined && resultSet[0].count !== null) {
                return resultSet[0].count;
            }
        }
        return 0;
    }

    private async triggerEvent(data: PaymentTypeEntityEvent | PaymentTypeUpdateEntityEvent) {
        const triggerExtensions = await extensions.loadExtensionModules("codbex-payments-Settings-PaymentType", ["trigger"]);
        triggerExtensions.forEach(triggerExtension => {
            try {
                triggerExtension.trigger(data);
            } catch (error) {
                console.error(error);
            }            
        });
        producer.topic("codbex-payments-Settings-PaymentType").send(JSON.stringify(data));
    }
}
