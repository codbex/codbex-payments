import { Repository, EntityEvent, EntityConstructor, Options } from '@aerokit/sdk/db'
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

    public override findById(id: string | number, options?: Options): EmployeePaymentEntity | undefined {
        const entity = super.findById(id, options);
        if (entity) {
            entity.Date = entity.Date ? new Date(entity.Date) : undefined;
            entity.Valor = entity.Valor ? new Date(entity.Valor) : undefined;
        }
        return entity;
    }

    public override findAll(options?: Options): EmployeePaymentEntity[] {
        const entities = super.findAll(options);
        entities.forEach(entity => {
            entity.Date = entity.Date ? new Date(entity.Date) : undefined;
            entity.Valor = entity.Valor ? new Date(entity.Valor) : undefined;
        });
        return entities;
    }

    public override create(entity: EmployeePaymentEntity): string | number {
        entity.Name = new NumberGeneratorService().generateByType('Employee Payment');
        entity.UUID = require("sdk/utils/uuid").random();
        return super.create(entity);
    }

    public override upsert(entity: EmployeePaymentEntity): string | number {
        entity.Name = new NumberGeneratorService().generateByType('Employee Payment');
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
