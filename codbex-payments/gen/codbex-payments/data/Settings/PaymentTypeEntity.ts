import { Entity, Table, Id, Generated, Column, Documentation } from '@aerokit/sdk/db'

@Entity('PaymentTypeEntity')
@Table('CODBEX_PAYMENTTYPE')
@Documentation('PaymentType entity mapping')
export class PaymentTypeEntity {

    @Id()
    @Generated('sequence')
    @Documentation('Id')
    @Column({
        name: 'PAYMENTTYPE_ID',
        type: 'integer',
    })
    public Id?: number;

    @Documentation('Name')
    @Column({
        name: 'PAYMENTTYPE_NAME',
        type: 'string',
        length: 20,
        nullable: true,
    })
    public Name?: string;

}

(new PaymentTypeEntity());
