import { Repository, EntityEvent, EntityConstructor } from '@aerokit/sdk/db'
import { Component } from '@aerokit/sdk/component'
import { Producer } from '@aerokit/sdk/messaging'
import { Extensions } from '@aerokit/sdk/extensions'
import { SupplierPaymentEntity } from './SupplierPaymentEntity'
// custom imports
import { NumberGeneratorService } from "/codbex-number-generator/service/generator";

@Component('SupplierPaymentRepository')
export class SupplierPaymentRepository extends Repository<SupplierPaymentEntity> {

    constructor() {
        super((SupplierPaymentEntity as EntityConstructor));
    }

    public override create(entity: SupplierPaymentEntity): string | number {
        entity.Name = new NumberGeneratorService().generate(19);
        entity.UUID = require("sdk/utils/uuid").random();
        return super.create(entity);
    }

    public override upsert(entity: SupplierPaymentEntity): string | number {
        entity.Name = new NumberGeneratorService().generate(19);
        entity.UUID = require("sdk/utils/uuid").random();
        return super.upsert(entity);
    }

    protected override async triggerEvent(data: EntityEvent<SupplierPaymentEntity>): Promise<void> {
        const triggerExtensions = await Extensions.loadExtensionModules('codbex-payments-SupplierPayment-SupplierPayment', ['trigger']);
        triggerExtensions.forEach(triggerExtension => {
            try {
                triggerExtension.trigger(data);
            } catch (error) {
                console.error(error);
            }
        });
        Producer.topic('codbex-payments-SupplierPayment-SupplierPayment').send(JSON.stringify(data));
    }
}
