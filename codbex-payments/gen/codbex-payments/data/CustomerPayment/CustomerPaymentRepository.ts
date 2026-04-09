import { Repository, EntityEvent, EntityConstructor, Options } from '@aerokit/sdk/db'
import { Component } from '@aerokit/sdk/component'
import { Producer } from '@aerokit/sdk/messaging'
import { Extensions } from '@aerokit/sdk/extensions'
import { CustomerPaymentEntity } from './CustomerPaymentEntity'
// custom imports
import { NumberGeneratorService } from "/codbex-number-generator/service/generator";

@Component('CustomerPaymentRepository')
export class CustomerPaymentRepository extends Repository<CustomerPaymentEntity> {

    constructor() {
        super((CustomerPaymentEntity as EntityConstructor));
    }

    public override findById(id: string | number, options?: Options): CustomerPaymentEntity | undefined {
        const entity = super.findById(id, options);
        if (entity) {
            entity.Date = entity.Date ? new Date(entity.Date) : undefined;
            entity.Valor = entity.Valor ? new Date(entity.Valor) : undefined;
            entity.CreatedAt = entity.CreatedAt ? new Date(entity.CreatedAt) : undefined;
            entity.UpdatedAt = entity.UpdatedAt ? new Date(entity.UpdatedAt) : undefined;
        }
        return entity;
    }

    public override findAll(options?: Options): CustomerPaymentEntity[] {
        const entities = super.findAll(options);
        entities.forEach(entity => {
            entity.Date = entity.Date ? new Date(entity.Date) : undefined;
            entity.Valor = entity.Valor ? new Date(entity.Valor) : undefined;
            entity.CreatedAt = entity.CreatedAt ? new Date(entity.CreatedAt) : undefined;
            entity.UpdatedAt = entity.UpdatedAt ? new Date(entity.UpdatedAt) : undefined;
        });
        return entities;
    }

    public override create(entity: CustomerPaymentEntity): string | number {
        entity.Name = new NumberGeneratorService().generateByType('Customer Payment');
        entity.UUID = require("sdk/utils/uuid").random();
        return super.create(entity);
    }

    public override upsert(entity: CustomerPaymentEntity): string | number {
        entity.Name = new NumberGeneratorService().generateByType('Customer Payment');
        entity.UUID = require("sdk/utils/uuid").random();
        return super.upsert(entity);
    }

    protected override async triggerEvent(data: EntityEvent<CustomerPaymentEntity>): Promise<void> {
        const triggerExtensions = await Extensions.loadExtensionModules('codbex-payments-CustomerPayment-CustomerPayment', ['trigger']);
        triggerExtensions.forEach(triggerExtension => {
            try {
                triggerExtension.trigger(data);
            } catch (error) {
                console.error(error);
            }
        });
        Producer.topic('codbex-payments-CustomerPayment-CustomerPayment').send(JSON.stringify(data));
    }
}
