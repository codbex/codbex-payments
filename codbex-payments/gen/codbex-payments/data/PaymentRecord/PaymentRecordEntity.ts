import { Entity, Table, Id, Generated, Column, Documentation } from '@aerokit/sdk/db'

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

    @Documentation('CompanyIBAN')
    @Column({
        name: 'PAYMENTRECORD_COMPANYIBAN',
        type: 'string',
        length: 34,
        nullable: true,
    })
    public CompanyIBAN?: string;

    @Documentation('CounterpartyIBAN')
    @Column({
        name: 'PAYMENTRECORD_COUNTERPARTYIBAN',
        type: 'string',
        length: 34,
        nullable: true,
    })
    public CounterpartyIBAN?: string;

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
        nullable: true,
    })
    public Amount?: number;

    @Documentation('Currency')
    @Column({
        name: 'PAYMENTRECORD_CURRENCY',
        type: 'integer',
        nullable: true,
    })
    public Currency?: number;

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

    @Documentation('PaymentRecordDirection')
    @Column({
        name: 'PAYMENTRECORD_PAYMENTRECORDDIRECTION',
        type: 'integer',
        nullable: true,
    })
    public PaymentRecordDirection?: number;

    @Documentation('PaymentStatus')
    @Column({
        name: 'PAYMENTRECORD_PAYMENTSTATUS',
        type: 'integer',
        nullable: true,
    })
    public PaymentStatus?: number;

    @Documentation('PaymentType')
    @Column({
        name: 'PAYMENTRECORD_PAYMENTTYPE',
        type: 'integer',
        nullable: true,
    })
    public PaymentType?: number;

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

}

(new PaymentRecordEntity());
