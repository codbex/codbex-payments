import { Repository, EntityEvent, EntityConstructor } from '@aerokit/sdk/db'
import { Component } from '@aerokit/sdk/component'
import { Producer } from '@aerokit/sdk/messaging'
import { Extensions } from '@aerokit/sdk/extensions'
import { PaymentDirectionEntity } from './PaymentDirectionEntity'

@Component('PaymentDirectionRepository')
export class PaymentDirectionRepository extends Repository<PaymentDirectionEntity> {

    constructor() {
        super((PaymentDirectionEntity as EntityConstructor));
    }

    protected override async triggerEvent(data: EntityEvent<PaymentDirectionEntity>): Promise<void> {
        const triggerExtensions = await Extensions.loadExtensionModules('codbex-payments-Settings-PaymentDirection', ['trigger']);
        triggerExtensions.forEach(triggerExtension => {
            try {
                triggerExtension.trigger(data);
            } catch (error) {
                console.error(error);
            }
        });
        Producer.topic('codbex-payments-Settings-PaymentDirection').send(JSON.stringify(data));
    }
}
