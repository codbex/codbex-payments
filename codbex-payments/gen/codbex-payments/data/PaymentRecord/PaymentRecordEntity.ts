import { Entity, Table, Id, Generated, Column, Documentation, CreatedAt, CreatedBy, UpdatedAt, UpdatedBy} from '@aerokit/sdk/db'

@Entity('PaymentRecordEntity')
@Table('CODBEX_PAYMENTRECORD')
@Documentation('PaymentRecord entity mapping')
export class PaymentRecordEntity {

    @Id()
    @Generated('sequence')
    @Documentation('Id')
    @Column({
        name: 'PAYMENTRECORD_ID',
        type: 'integer',
    })
    public Id?: number;

    @Documentation('Date')
    @Column({
        name: 'PAYMENTRECORD_DATE',
        type: 'date',
    })
    public Date!: Date;

    @Documentation('Valor')
    @Column({
        name: 'PAYMENTRECORD_VALOR',
        type: 'date',
    })
    public Valor!: Date;

    @Documentation('OurPartyIBAN')
    @Column({
        name: 'PAYMENTRECORD_OURPARTYIBAN',
        type: 'string',
        length: 34,
    })
    public OurPartyIBAN!: string;

    @Documentation('CounterpartyIBAN')
    @Column({
        name: 'PAYMENTRECORD_COUNTERPARTYIBAN',
        type: 'string',
        length: 34,
    })
    public CounterpartyIBAN!: string;

    @Documentation('CounterpartyName')
    @Column({
        name: 'PAYMENTRECORD_COUNTERPARTYNAME',
        type: 'string',
        length: 100,
        nullable: true,
    })
    public CounterpartyName?: string;

    @Documentation('Amount')
    @Column({
        name: 'PAYMENTRECORD_AMOUNT',
        type: 'big_decimal',
        precision: 16,
        scale: 2,
    })
    public Amount!: number;

    @Documentation('Currency')
    @Column({
        name: 'PAYMENTRECORD_CURRENCY',
        type: 'integer',
    })
    public Currency!: number;

    @Documentation('PaymentDirection')
    @Column({
        name: 'PAYMENTRECORD_PAYMENTDIRECTION',
        type: 'integer',
    })
    public PaymentDirection!: number;

    @Documentation('PaymentType')
    @Column({
        name: 'PAYMENTRECORD_PAYMENTTYPE',
        type: 'integer',
    })
    public PaymentType!: number;

    @Documentation('Reason')
    @Column({
        name: 'PAYMENTRECORD_REASON',
        type: 'string',
        length: 100,
        nullable: true,
    })
    public Reason?: string;

    @Documentation('Description')
    @Column({
        name: 'PAYMENTRECORD_DESCRIPTION',
        type: 'string',
        length: 100,
        nullable: true,
    })
    public Description?: string;

    @Documentation('Company')
    @Column({
        name: 'PAYMENTRECORD_COMPANY',
        type: 'integer',
        nullable: true,
    })
    public Company?: number;

    @Documentation('UUID')
    @Column({
        name: 'PAYMENTRECORD_UUID',
        type: 'string',
        length: 36,
    })
    public UUID?: string;

    @Documentation('Reference')
    @Column({
        name: 'PAYMENTRECORD_REFERENCE',
        type: 'string',
        length: 36,
        nullable: true,
    })
    public Reference?: string;

    @Documentation('Deleted')
    @Column({
        name: 'PAYMENTRECORD_DELETED',
        type: 'boolean',
        nullable: true,
    })
    public Deleted?: boolean;

    @Documentation('DeletedAt')
    @Column({
        name: 'PAYMENTRECORD_DELETEDAT',
        type: 'timestamp',
        nullable: true,
    })
    public DeletedAt?: Date;

    @Documentation('DeletedReason')
    @Column({
        name: 'PAYMENTRECORD_DELETEDREASON',
        type: 'string',
        length: 255,
        nullable: true,
    })
    public DeletedReason?: string;

    @Documentation('CreatedAt')
    @Column({
        name: 'PAYMENTRECORD_CREATEDAT',
        type: 'timestamp',
        nullable: true,
    })
    @CreatedAt()
    public CreatedAt?: Date;

    @Documentation('CreatedBy')
    @Column({
        name: 'PAYMENTRECORD_CREATEDBY',
        type: 'string',
        length: 20,
        nullable: true,
    })
    @CreatedBy()
    public CreatedBy?: string;

    @Documentation('UpdatedAt')
    @Column({
        name: 'PAYMENTRECORD_UPDATEDAT',
        type: 'timestamp',
        nullable: true,
    })
    @UpdatedAt()
    public UpdatedAt?: Date;

    @Documentation('UpdatedBy')
    @Column({
        name: 'PAYMENTRECORD_UPDATEDBY',
        type: 'string',
        length: 20,
        nullable: true,
    })
    @UpdatedBy()
    public UpdatedBy?: string;

}

(new PaymentRecordEntity());
