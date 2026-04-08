import { Repository, EntityEvent, EntityConstructor, Options } from '@aerokit/sdk/db'
import { Component } from '@aerokit/sdk/component'
import { Producer } from '@aerokit/sdk/messaging'
import { Extensions } from '@aerokit/sdk/extensions'
import { PaymentAdjustmentEntity } from './PaymentAdjustmentEntity'

@Component('PaymentAdjustmentRepository')
export class PaymentAdjustmentRepository extends Repository<PaymentAdjustmentEntity> {

    constructor() {
        super((PaymentAdjustmentEntity as EntityConstructor));
    }

    public override findById(id: string | number, options?: Options): PaymentAdjustmentEntity | undefined {
        const entity = super.findById(id, options);
        if (entity) {
            entity.Date = entity.Date ? new Date(entity.Date) : undefined;
            entity.Valor = entity.Valor ? new Date(entity.Valor) : undefined;
            entity.CreatedAt = entity.CreatedAt ? new Date(entity.CreatedAt) : undefined;
            entity.UpdatedAt = entity.UpdatedAt ? new Date(entity.UpdatedAt) : undefined;
        }
        return entity;
    }

    public override findAll(options?: Options): PaymentAdjustmentEntity[] {
        const entities = super.findAll(options);
        entities.forEach(entity => {
            entity.Date = entity.Date ? new Date(entity.Date) : undefined;
            entity.Valor = entity.Valor ? new Date(entity.Valor) : undefined;
            entity.CreatedAt = entity.CreatedAt ? new Date(entity.CreatedAt) : undefined;
            entity.UpdatedAt = entity.UpdatedAt ? new Date(entity.UpdatedAt) : undefined;
        });
        return entities;
    }

    public override create(entity: PaymentAdjustmentEntity): string | number {
        entity.UUID = require("sdk/utils/uuid").random();
        return super.create(entity);
    }

    public override upsert(entity: PaymentAdjustmentEntity): string | number {
        entity.UUID = require("sdk/utils/uuid").random();
        return super.upsert(entity);
    }

    protected override async triggerEvent(data: EntityEvent<PaymentAdjustmentEntity>): Promise<void> {
        const triggerExtensions = await Extensions.loadExtensionModules('codbex-payments-PaymentAdjustment-PaymentAdjustment', ['trigger']);
        triggerExtensions.forEach(triggerExtension => {
            try {
                triggerExtension.trigger(data);
            } catch (error) {
                console.error(error);
            }
        });
        Producer.topic('codbex-payments-PaymentAdjustment-PaymentAdjustment').send(JSON.stringify(data));
    }
}
