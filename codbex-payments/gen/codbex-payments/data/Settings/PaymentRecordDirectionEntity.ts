import { Entity, Table, Id, Generated, Column, Documentation } from '@aerokit/sdk/db'

@Entity('PaymentRecordDirectionEntity')
@Table('CODBEX_PAYMENTRECORDDIRECTION')
@Documentation('PaymentRecordDirection entity mapping')
export class PaymentRecordDirectionEntity {

    @Id()
    @Generated('sequence')
    @Documentation('Id')
    @Column({
        name: 'PAYMENTRECORDDIRECTION_ID',
        type: 'integer',
    })
    public Id?: number;

    @Documentation('Name')
    @Column({
        name: 'PAYMENTRECORDDIRECTION_NAME',
        type: 'string',
        length: 20,
        nullable: true,
    })
    public Name?: string;

}

(new PaymentRecordDirectionEntity());
