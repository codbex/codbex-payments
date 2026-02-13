import { Entity, Table, Id, Generated, Column, Documentation } from '@aerokit/sdk/db'

@Entity('PaymentStatusEntity')
@Table('CODBEX_PAYMENTSTATUS')
@Documentation('PaymentStatus entity mapping')
export class PaymentStatusEntity {

    @Id()
    @Generated('sequence')
    @Documentation('Id')
    @Column({
        name: 'PAYMENTSTATUS_ID',
        type: 'integer',
    })
    public Id?: number;

    @Documentation('Name')
    @Column({
        name: 'PAYMENTSTATUS_NAME',
        type: 'string',
        length: 20,
        nullable: true,
    })
    public Name?: string;

}

(new PaymentStatusEntity());
