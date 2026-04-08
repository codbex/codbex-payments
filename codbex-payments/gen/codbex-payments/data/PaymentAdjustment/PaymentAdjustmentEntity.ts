import { Entity, Table, Id, Generated, Column, Documentation, CreatedAt, CreatedBy, UpdatedAt, UpdatedBy} from '@aerokit/sdk/db'

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
    })
    public Date!: Date;

    @Documentation('Valor')
    @Column({
        name: 'PAYMENTADJUSTMENT_VALOR',
        type: 'date',
    })
    public Valor!: Date;

    @Documentation('Amount')
    @Column({
        name: 'PAYMENTADJUSTMENT_AMOUNT',
        type: 'big_decimal',
        precision: 16,
        scale: 2,
    })
    public Amount!: number;

    @Documentation('Currency')
    @Column({
        name: 'PAYMENTADJUSTMENT_CURRENCY',
        type: 'integer',
    })
    public Currency!: number;

    @Documentation('Company')
    @Column({
        name: 'PAYMENTADJUSTMENT_COMPANY',
        type: 'integer',
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

    @Documentation('CreatedAt')
    @Column({
        name: 'PAYMENTADJUSTMENT_CREATEDAT',
        type: 'timestamp',
        nullable: true,
    })
    @CreatedAt()
    public CreatedAt?: Date;

    @Documentation('CreatedBy')
    @Column({
        name: 'PAYMENTADJUSTMENT_CREATEDBY',
        type: 'string',
        length: 20,
        nullable: true,
    })
    @CreatedBy()
    public CreatedBy?: string;

    @Documentation('UpdatedAt')
    @Column({
        name: 'PAYMENTADJUSTMENT_UPDATEDAT',
        type: 'timestamp',
        nullable: true,
    })
    @UpdatedAt()
    public UpdatedAt?: Date;

    @Documentation('UpdatedBy')
    @Column({
        name: 'PAYMENTADJUSTMENT_UPDATEDBY',
        type: 'string',
        length: 20,
        nullable: true,
    })
    @UpdatedBy()
    public UpdatedBy?: string;

}

(new PaymentAdjustmentEntity());
