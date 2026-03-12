import { sql, query } from "@aerokit/sdk/db";
import { producer } from "@aerokit/sdk/messaging";
import { extensions } from "@aerokit/sdk/extensions";
import { dao as daoApi } from "@aerokit/sdk/db";
import { EntityUtils } from "../utils/EntityUtils";
// custom imports
import { NumberGeneratorService } from "/codbex-number-generator/service/generator";

export interface SupplierPaymentEntity {
    readonly Id: number;
    Supplier: number;
    Date: Date;
    Valor: Date;
    OurPartyIBAN: string;
    CounterpartyIBAN: string;
    CounterpartyName?: string;
    Amount: number;
    Currency: number;
    Reason: string;
    Description?: string;
    Company?: number;
    Name?: string;
    UUID: string;
    Reference?: string;
    PaymentMethod: number;
}

export interface SupplierPaymentCreateEntity {
    readonly Supplier: number;
    readonly Date: Date;
    readonly Valor: Date;
    readonly OurPartyIBAN: string;
    readonly CounterpartyIBAN: string;
    readonly CounterpartyName?: string;
    readonly Amount: number;
    readonly Currency: number;
    readonly Reason: string;
    readonly Description?: string;
    readonly Company?: number;
    readonly Reference?: string;
    readonly PaymentMethod: number;
}

export interface SupplierPaymentUpdateEntity extends SupplierPaymentCreateEntity {
    readonly Id: number;
}

export interface SupplierPaymentEntityOptions {
    $filter?: {
        equals?: {
            Id?: number | number[];
            Supplier?: number | number[];
            Date?: Date | Date[];
            Valor?: Date | Date[];
            OurPartyIBAN?: string | string[];
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
            PaymentMethod?: number | number[];
        };
        notEquals?: {
            Id?: number | number[];
            Supplier?: number | number[];
            Date?: Date | Date[];
            Valor?: Date | Date[];
            OurPartyIBAN?: string | string[];
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
            PaymentMethod?: number | number[];
        };
        contains?: {
            Id?: number;
            Supplier?: number;
            Date?: Date;
            Valor?: Date;
            OurPartyIBAN?: string;
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
            PaymentMethod?: number;
        };
        greaterThan?: {
            Id?: number;
            Supplier?: number;
            Date?: Date;
            Valor?: Date;
            OurPartyIBAN?: string;
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
            PaymentMethod?: number;
        };
        greaterThanOrEqual?: {
            Id?: number;
            Supplier?: number;
            Date?: Date;
            Valor?: Date;
            OurPartyIBAN?: string;
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
            PaymentMethod?: number;
        };
        lessThan?: {
            Id?: number;
            Supplier?: number;
            Date?: Date;
            Valor?: Date;
            OurPartyIBAN?: string;
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
            PaymentMethod?: number;
        };
        lessThanOrEqual?: {
            Id?: number;
            Supplier?: number;
            Date?: Date;
            Valor?: Date;
            OurPartyIBAN?: string;
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
            PaymentMethod?: number;
        };
    },
    $select?: (keyof SupplierPaymentEntity)[],
    $sort?: string | (keyof SupplierPaymentEntity)[],
    $order?: 'ASC' | 'DESC',
    $offset?: number,
    $limit?: number,
    $language?: string
}

export interface SupplierPaymentEntityEvent {
    readonly operation: 'create' | 'update' | 'delete';
    readonly table: string;
    readonly entity: Partial<SupplierPaymentEntity>;
    readonly key: {
        name: string;
        column: string;
        value: number;
    }
}

export interface SupplierPaymentUpdateEntityEvent extends SupplierPaymentEntityEvent {
    readonly previousEntity: SupplierPaymentEntity;
}

export class SupplierPaymentRepository {

    private static readonly DEFINITION = {
        table: "CODBEX_SUPPLIERPAYMENT",
        properties: [
            {
                name: "Id",
                column: "SUPPLIERPAYMENT_ID",
                type: "INTEGER",
                id: true,
                autoIncrement: true,
            },
            {
                name: "Supplier",
                column: "SUPPLIERPAYMENT_SUPPLIER",
                type: "INTEGER",
                required: true
            },
            {
                name: "Date",
                column: "SUPPLIERPAYMENT_DATE",
                type: "DATE",
                required: true
            },
            {
                name: "Valor",
                column: "SUPPLIERPAYMENT_VALOR",
                type: "DATE",
                required: true
            },
            {
                name: "OurPartyIBAN",
                column: "SUPPLIERPAYMENT_OURPARTYIBAN",
                type: "VARCHAR",
                required: true
            },
            {
                name: "CounterpartyIBAN",
                column: "SUPPLIERPAYMENT_COUNTERPARTYIBAN",
                type: "VARCHAR",
                required: true
            },
            {
                name: "CounterpartyName",
                column: "SUPPLIERPAYMENT_COUNTERPARTYNAME",
                type: "VARCHAR",
            },
            {
                name: "Amount",
                column: "SUPPLIERPAYMENT_AMOUNT",
                type: "DECIMAL",
                required: true
            },
            {
                name: "Currency",
                column: "SUPPLIERPAYMENT_CURRENCY",
                type: "INTEGER",
                required: true
            },
            {
                name: "Reason",
                column: "SUPPLIERPAYMENT_REASON",
                type: "VARCHAR",
                required: true
            },
            {
                name: "Description",
                column: "SUPPLIERPAYMENT_DESCRIPTION",
                type: "VARCHAR",
            },
            {
                name: "Company",
                column: "SUPPLIERPAYMENT_COMPANY",
                type: "INTEGER",
            },
            {
                name: "Name",
                column: "SUPPLIERPAYMENT_NAME",
                type: "VARCHAR",
            },
            {
                name: "UUID",
                column: "SUPPLIERPAYMENT_UUID",
                type: "VARCHAR",
                required: true
            },
            {
                name: "Reference",
                column: "SUPPLIERPAYMENT_REFERENCE",
                type: "VARCHAR",
            },
            {
                name: "PaymentMethod",
                column: "SUPPLIERPAYMENT_PAYMENTMETHOD",
                type: "INTEGER",
                required: true
            }
        ]
    };

    private readonly dao;

    constructor(dataSource = "DefaultDB") {
        this.dao = daoApi.create(SupplierPaymentRepository.DEFINITION, undefined, dataSource);
    }

    public findAll(options: SupplierPaymentEntityOptions = {}): SupplierPaymentEntity[] {
        if (options.$sort === undefined && options.$order === undefined) {
            options.$sort = "Date";
            options.$order = "DESC";
        }
        let list = this.dao.list(options).map((e: SupplierPaymentEntity) => {
            EntityUtils.setDate(e, "Date");
            EntityUtils.setDate(e, "Valor");
            return e;
        });
        return list;
    }

    public findById(id: number, options: SupplierPaymentEntityOptions = {}): SupplierPaymentEntity | undefined {
        const entity = this.dao.find(id);
        EntityUtils.setDate(entity, "Date");
        EntityUtils.setDate(entity, "Valor");
        return entity ?? undefined;
    }

    public create(entity: SupplierPaymentCreateEntity): number {
        EntityUtils.setLocalDate(entity, "Date");
        EntityUtils.setLocalDate(entity, "Valor");
        // @ts-ignore
        (entity as SupplierPaymentEntity).Name = new NumberGeneratorService().generate(19);
        // @ts-ignore
        (entity as SupplierPaymentEntity).UUID = require("sdk/utils/uuid").random();
        const id = this.dao.insert(entity);
        this.triggerEvent({
            operation: "create",
            table: "CODBEX_SUPPLIERPAYMENT",
            entity: entity,
            key: {
                name: "Id",
                column: "SUPPLIERPAYMENT_ID",
                value: id
            }
        });
        return id;
    }

    public update(entity: SupplierPaymentUpdateEntity): void {
        // EntityUtils.setLocalDate(entity, "Date");
        // EntityUtils.setLocalDate(entity, "Valor");
        const previousEntity = this.findById(entity.Id);
        this.dao.update(entity);
        this.triggerEvent({
            operation: "update",
            table: "CODBEX_SUPPLIERPAYMENT",
            entity: entity,
            previousEntity: previousEntity,
            key: {
                name: "Id",
                column: "SUPPLIERPAYMENT_ID",
                value: entity.Id
            }
        });
    }

    public upsert(entity: SupplierPaymentCreateEntity | SupplierPaymentUpdateEntity): number {
        const id = (entity as SupplierPaymentUpdateEntity).Id;
        if (!id) {
            return this.create(entity);
        }

        const existingEntity = this.findById(id);
        if (existingEntity) {
            this.update(entity as SupplierPaymentUpdateEntity);
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
            table: "CODBEX_SUPPLIERPAYMENT",
            entity: entity,
            key: {
                name: "Id",
                column: "SUPPLIERPAYMENT_ID",
                value: id
            }
        });
    }

    public count(options?: SupplierPaymentEntityOptions): number {
        return this.dao.count(options);
    }

    public customDataCount(): number {
        const resultSet = query.execute('SELECT COUNT(*) AS COUNT FROM "CODBEX_SUPPLIERPAYMENT"');
        if (resultSet !== null && resultSet[0] !== null) {
            if (resultSet[0].COUNT !== undefined && resultSet[0].COUNT !== null) {
                return resultSet[0].COUNT;
            } else if (resultSet[0].count !== undefined && resultSet[0].count !== null) {
                return resultSet[0].count;
            }
        }
        return 0;
    }

    private async triggerEvent(data: SupplierPaymentEntityEvent | SupplierPaymentUpdateEntityEvent) {
        const triggerExtensions = await extensions.loadExtensionModules("codbex-payments-SupplierPayment-SupplierPayment", ["trigger"]);
        triggerExtensions.forEach(triggerExtension => {
            try {
                triggerExtension.trigger(data);
            } catch (error) {
                console.error(error);
            }            
        });
        producer.topic("codbex-payments-SupplierPayment-SupplierPayment").send(JSON.stringify(data));
    }
}
