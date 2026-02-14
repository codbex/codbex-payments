import { Repository, EntityEvent, EntityConstructor } from '@aerokit/sdk/db'
import { Component } from '@aerokit/sdk/component'
import { Producer } from '@aerokit/sdk/messaging'
import { Extensions } from '@aerokit/sdk/extensions'
import { PaymentTypeEntity } from './PaymentTypeEntity'

@Component('PaymentTypeRepository')
export class PaymentTypeRepository extends Repository<PaymentTypeEntity> {

    constructor() {
        super((PaymentTypeEntity as EntityConstructor));
    }

    protected override async triggerEvent(data: EntityEvent<PaymentTypeEntity>): Promise<void> {
        const triggerExtensions = await Extensions.loadExtensionModules('codbex-payments-Settings-PaymentType', ['trigger']);
        triggerExtensions.forEach(triggerExtension => {
            try {
                triggerExtension.trigger(data);
            } catch (error) {
                console.error(error);
            }
        });
        Producer.topic('codbex-payments-Settings-PaymentType').send(JSON.stringify(data));
    }
}
