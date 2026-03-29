import { Repository, EntityEvent, EntityConstructor, Options } from '@aerokit/sdk/db'
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

    public override findById(id: string | number, options?: Options): SupplierPaymentEntity | undefined {
        const entity = super.findById(id, options);
        if (entity) {
            entity.Date = entity.Date ? new Date(entity.Date) : undefined;
            entity.Valor = entity.Valor ? new Date(entity.Valor) : undefined;
        }
        return entity;
    }

    public override findAll(options?: Options): SupplierPaymentEntity[] {
        const entities = super.findAll(options);
        entities.forEach(entity => {
            entity.Date = entity.Date ? new Date(entity.Date) : undefined;
            entity.Valor = entity.Valor ? new Date(entity.Valor) : undefined;
        });
        return entities;
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
