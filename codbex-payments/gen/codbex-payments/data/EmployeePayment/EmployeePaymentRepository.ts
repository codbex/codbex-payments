import { Repository, EntityEvent, EntityConstructor } from '@aerokit/sdk/db'
import { Component } from '@aerokit/sdk/component'
import { Producer } from '@aerokit/sdk/messaging'
import { Extensions } from '@aerokit/sdk/extensions'
import { EmployeePaymentEntity } from './EmployeePaymentEntity'
// custom imports
import { NumberGeneratorService } from "/codbex-number-generator/service/generator";

@Component('EmployeePaymentRepository')
export class EmployeePaymentRepository extends Repository<EmployeePaymentEntity> {

    constructor() {
        super((EmployeePaymentEntity as EntityConstructor));
    }

    public override create(entity: EmployeePaymentEntity): string | number {
        entity.Name = new NumberGeneratorService().generate(20);
        entity.UUID = require("sdk/utils/uuid").random();
        return super.create(entity);
    }

    public override upsert(entity: EmployeePaymentEntity): string | number {
        entity.Name = new NumberGeneratorService().generate(20);
        entity.UUID = require("sdk/utils/uuid").random();
        return super.upsert(entity);
    }

    protected override async triggerEvent(data: EntityEvent<EmployeePaymentEntity>): Promise<void> {
        const triggerExtensions = await Extensions.loadExtensionModules('codbex-payments-EmployeePayment-EmployeePayment', ['trigger']);
        triggerExtensions.forEach(triggerExtension => {
            try {
                triggerExtension.trigger(data);
            } catch (error) {
                console.error(error);
            }
        });
        Producer.topic('codbex-payments-EmployeePayment-EmployeePayment').send(JSON.stringify(data));
    }
}
