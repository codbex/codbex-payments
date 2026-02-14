import { Repository, EntityEvent, EntityConstructor } from '@aerokit/sdk/db'
import { Component } from '@aerokit/sdk/component'
import { Producer } from '@aerokit/sdk/messaging'
import { Extensions } from '@aerokit/sdk/extensions'
import { PaymentRecordEntity } from './PaymentRecordEntity'

@Component('PaymentRecordRepository')
export class PaymentRecordRepository extends Repository<PaymentRecordEntity> {

    constructor() {
        super((PaymentRecordEntity as EntityConstructor));
    }

    public override create(entity: PaymentRecordEntity): string | number {
        entity.UUID = require("sdk/utils/uuid").random();
        return super.create(entity);
    }

    public override upsert(entity: PaymentRecordEntity): string | number {
        entity.UUID = require("sdk/utils/uuid").random();
        return super.upsert(entity);
    }

    protected override async triggerEvent(data: EntityEvent<PaymentRecordEntity>): Promise<void> {
        const triggerExtensions = await Extensions.loadExtensionModules('codbex-payments-PaymentRecord-PaymentRecord', ['trigger']);
        triggerExtensions.forEach(triggerExtension => {
            try {
                triggerExtension.trigger(data);
            } catch (error) {
                console.error(error);
            }
        });
        Producer.topic('codbex-payments-PaymentRecord-PaymentRecord').send(JSON.stringify(data));
    }
}
