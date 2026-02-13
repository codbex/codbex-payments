import { Repository, EntityEvent, EntityConstructor } from '@aerokit/sdk/db'
import { Component } from '@aerokit/sdk/component'
import { Producer } from '@aerokit/sdk/messaging'
import { Extensions } from '@aerokit/sdk/extensions'
import { PaymentStatusEntity } from './PaymentStatusEntity'

@Component('PaymentStatusRepository')
export class PaymentStatusRepository extends Repository<PaymentStatusEntity> {

    constructor() {
        super((PaymentStatusEntity as EntityConstructor));
    }

    protected override async triggerEvent(data: EntityEvent<PaymentStatusEntity>): Promise<void> {
        const triggerExtensions = await Extensions.loadExtensionModules('codbex-payments-Settings-PaymentStatus', ['trigger']);
        triggerExtensions.forEach(triggerExtension => {
            try {
                triggerExtension.trigger(data);
            } catch (error) {
                console.error(error);
            }
        });
        Producer.topic('codbex-payments-Settings-PaymentStatus').send(JSON.stringify(data));
    }
}
