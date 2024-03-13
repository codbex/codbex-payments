import { query } from "sdk/db";
import { producer } from "sdk/messaging";
import { extensions } from "sdk/extensions";
import { dao as daoApi } from "sdk/db";

export interface PaymentStatusEntity {
    readonly Id: number;
    Name?: string;
}

export interface PaymentStatusCreateEntity {
    readonly Name?: string;
}

export interface PaymentStatusUpdateEntity extends PaymentStatusCreateEntity {
    readonly Id: number;
}

export interface PaymentStatusEntityOptions {
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
    $select?: (keyof PaymentStatusEntity)[],
    $sort?: string | (keyof PaymentStatusEntity)[],
    $order?: 'asc' | 'desc',
    $offset?: number,
    $limit?: number,
}

interface PaymentStatusEntityEvent {
    readonly operation: 'create' | 'update' | 'delete';
    readonly table: string;
    readonly entity: Partial<PaymentStatusEntity>;
    readonly key: {
        name: string;
        column: string;
        value: number;
    }
}

export class PaymentStatusRepository {

    private static readonly DEFINITION = {
        table: "CODBEX_PAYMENTSTATUS",
        properties: [
            {
                name: "Id",
                column: "PAYMENTSTATUS_ID",
                type: "INTEGER",
                id: true,
                autoIncrement: true,
            },
            {
                name: "Name",
                column: "PAYMENTSTATUS_NAME",
                type: "VARCHAR",
            }
        ]
    };

    private readonly dao;

    constructor(dataSource?: string) {
        this.dao = daoApi.create(PaymentStatusRepository.DEFINITION, null, dataSource);
    }

    public findAll(options?: PaymentStatusEntityOptions): PaymentStatusEntity[] {
        return this.dao.list(options);
    }

    public findById(id: number): PaymentStatusEntity | undefined {
        const entity = this.dao.find(id);
        return entity ?? undefined;
    }

    public create(entity: PaymentStatusCreateEntity): number {
        const id = this.dao.insert(entity);
        this.triggerEvent({
            operation: "create",
            table: "CODBEX_PAYMENTSTATUS",
            entity: entity,
            key: {
                name: "Id",
                column: "PAYMENTSTATUS_ID",
                value: id
            }
        });
        return id;
    }

    public update(entity: PaymentStatusUpdateEntity): void {
        this.dao.update(entity);
        this.triggerEvent({
            operation: "update",
            table: "CODBEX_PAYMENTSTATUS",
            entity: entity,
            key: {
                name: "Id",
                column: "PAYMENTSTATUS_ID",
                value: entity.Id
            }
        });
    }

    public upsert(entity: PaymentStatusCreateEntity | PaymentStatusUpdateEntity): number {
        const id = (entity as PaymentStatusUpdateEntity).Id;
        if (!id) {
            return this.create(entity);
        }

        const existingEntity = this.findById(id);
        if (existingEntity) {
            this.update(entity as PaymentStatusUpdateEntity);
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
            table: "CODBEX_PAYMENTSTATUS",
            entity: entity,
            key: {
                name: "Id",
                column: "PAYMENTSTATUS_ID",
                value: id
            }
        });
    }

    public count(options?: PaymentStatusEntityOptions): number {
        return this.dao.count(options);
    }

    public customDataCount(): number {
        const resultSet = query.execute('SELECT COUNT(*) AS COUNT FROM "CODBEX_PAYMENTSTATUS"');
        if (resultSet !== null && resultSet[0] !== null) {
            if (resultSet[0].COUNT !== undefined && resultSet[0].COUNT !== null) {
                return resultSet[0].COUNT;
            } else if (resultSet[0].count !== undefined && resultSet[0].count !== null) {
                return resultSet[0].count;
            }
        }
        return 0;
    }

    private async triggerEvent(data: PaymentStatusEntityEvent) {
        const triggerExtensions = await extensions.loadExtensionModules("codbex-payments-Settings-PaymentStatus", ["trigger"]);
        triggerExtensions.forEach(triggerExtension => {
            try {
                triggerExtension.trigger(data);
            } catch (error) {
                console.error(error);
            }            
        });
        producer.topic("codbex-payments-Settings-PaymentStatus").send(JSON.stringify(data));
    }
}
