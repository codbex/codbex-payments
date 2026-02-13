import { Repository, EntityEvent, EntityConstructor } from '@aerokit/sdk/db'
import { Component } from '@aerokit/sdk/component'
import { Producer } from '@aerokit/sdk/messaging'
import { Extensions } from '@aerokit/sdk/extensions'
import { PaymentRecordDirectionEntity } from './PaymentRecordDirectionEntity'

@Component('PaymentRecordDirectionRepository')
export class PaymentRecordDirectionRepository extends Repository<PaymentRecordDirectionEntity> {

    constructor() {
        super((PaymentRecordDirectionEntity as EntityConstructor));
    }

    protected override async triggerEvent(data: EntityEvent<PaymentRecordDirectionEntity>): Promise<void> {
        const triggerExtensions = await Extensions.loadExtensionModules('codbex-payments-Settings-PaymentRecordDirection', ['trigger']);
        triggerExtensions.forEach(triggerExtension => {
            try {
                triggerExtension.trigger(data);
            } catch (error) {
                console.error(error);
            }
        });
        Producer.topic('codbex-payments-Settings-PaymentRecordDirection').send(JSON.stringify(data));
    }
}
