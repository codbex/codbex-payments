import { Entity, Table, Id, Generated, Column, Documentation } from '@aerokit/sdk/db'

@Entity('PaymentAdjustmentEntity')
@Table('CODBEX_PAYMENTADJUSTMENT')
@Documentation('PaymentAdjustment entity mapping')
export class PaymentAdjustmentEntity {

    @Id()
    @Generated('sequence')
    @Documentation('Id')
    @Column({
        name: 'PAYMENTADJUSTMENT_ID',
        type: 'integer',
    })
    public Id?: number;

    @Documentation('Date')
    @Column({
        name: 'PAYMENTADJUSTMENT_DATE',
        type: 'date',
        nullable: true,
    })
    public Date!: Date;

    @Documentation('Valor')
    @Column({
        name: 'PAYMENTADJUSTMENT_VALOR',
        type: 'date',
        nullable: true,
    })
    public Valor!: Date;

    @Documentation('Amount')
    @Column({
        name: 'PAYMENTADJUSTMENT_AMOUNT',
        type: 'big_decimal',
        precision: 16,
        scale: 2,
        nullable: true,
    })
    public Amount!: number;

    @Documentation('Currency')
    @Column({
        name: 'PAYMENTADJUSTMENT_CURRENCY',
        type: 'integer',
        nullable: true,
    })
    public Currency!: number;

    @Documentation('Company')
    @Column({
        name: 'PAYMENTADJUSTMENT_COMPANY',
        type: 'integer',
        nullable: true,
    })
    public Company!: number;

    @Documentation('Reason')
    @Column({
        name: 'PAYMENTADJUSTMENT_REASON',
        type: 'string',
        length: 100,
        nullable: true,
    })
    public Reason?: string;

    @Documentation('UUID')
    @Column({
        name: 'PAYMENTADJUSTMENT_UUID',
        type: 'string',
        length: 36,
        nullable: true,
    })
    public UUID?: string;

}

(new PaymentAdjustmentEntity());
